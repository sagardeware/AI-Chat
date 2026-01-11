import { Conversation, Message, Sender } from '../models/index.js';
import { generateReply } from './llm.service.js';
import { redisService } from './redis.service.js';
import mongoose from 'mongoose';

/**
 * Create a new conversation
 */
export async function createConversation(metadata?: Record<string, any>) {
    const conversation = new Conversation({
        metadata: metadata || {},
    });
    await conversation.save();
    return conversation;
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: string) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return null;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return null;
    }

    // Get messages for this conversation
    const messages = await Message.find({ conversationId: conversation._id })
        .sort({ timestamp: 1 })
        .lean();

    return {
        ...conversation.toObject(),
        messages,
    };
}

/**
 * Get conversation history (with Redis caching)
 */
export async function getConversationHistory(conversationId: string) {
    const cacheKey = `conversation:${conversationId}`;

    // Try to get from cache first
    if (redisService.isAvailable()) {
        try {
            const cached = await redisService.get(cacheKey);
            if (cached) {
                console.log(`✅ Cache HIT for conversation ${conversationId}`);
                return JSON.parse(cached);
            }
            console.log(`❌ Cache MISS for conversation ${conversationId}`);
        } catch (error) {
            console.error('Redis cache read error:', error);
        }
    }

    // Fetch from database
    const conversation = await getConversation(conversationId);

    if (!conversation) {
        return null;
    }

    const result = {
        conversationId: conversation._id.toString(),
        messages: conversation.messages.map((msg: any) => ({
            id: msg._id.toString(),
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.timestamp,
        })),
    };

    // Cache the result (1 hour TTL)
    if (redisService.isAvailable()) {
        try {
            await redisService.set(cacheKey, JSON.stringify(result), 3600);
            console.log(`💾 Cached conversation ${conversationId}`);
        } catch (error) {
            console.error('Redis cache write error:', error);
        }
    }

    return result;
}

/**
 * Save a message to the database
 */
export async function saveMessage(
    conversationId: string,
    sender: Sender,
    text: string
) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new Error('Invalid conversation ID');
    }

    const message = new Message({
        conversationId: new mongoose.Types.ObjectId(conversationId),
        sender,
        text,
        timestamp: new Date(),
    });

    await message.save();

    // Update conversation's updatedAt timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
        updatedAt: new Date(),
    });

    return message;
}

/**
 * Get all conversations with metadata
 */
export async function getAllConversations() {
    const conversations = await Conversation.find()
        .sort({ updatedAt: -1 })
        .lean();

    const conversationsWithDetails = await Promise.all(
        conversations.map(async (conv) => {
            // Get first message for preview
            const firstMessage = await Message.findOne({
                conversationId: conv._id,
            })
                .sort({ timestamp: 1 })
                .lean();

            // Get message count
            const messageCount = await Message.countDocuments({
                conversationId: conv._id,
            });

            return {
                id: conv._id.toString(),
                preview: firstMessage?.text || 'New Chat',
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt,
                messageCount,
            };
        })
    );

    return conversationsWithDetails;
}

/**
 * Process a chat message and get AI response
 */
export async function processChatMessage(
    message: string,
    sessionId?: string,
    context?: Record<string, any>
) {
    try {
        // Get or create conversation
        let conversation;
        if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
            const existing = await Conversation.findById(sessionId);
            if (existing) {
                conversation = existing;
            } else {
                conversation = await createConversation(context);
            }
        } else {
            conversation = await createConversation(context);
        }

        // Get conversation history for context
        const history = await getConversationHistory(conversation._id.toString());
        const conversationContext = history?.messages.map((msg: any) => ({
            sender: msg.sender,
            text: msg.text,
        })) || [];

        // Save user message
        await saveMessage(conversation._id.toString(), Sender.USER, message);

        // Invalidate cache after new message
        if (redisService.isAvailable()) {
            await redisService.del(`conversation:${conversation._id.toString()}`);
            console.log(`🗑️ Invalidated cache for conversation ${conversation._id.toString()}`);
        }

        // Generate AI reply
        const aiReply = await generateReply(conversationContext, message);

        // Save AI message
        const aiMessage = await saveMessage(conversation._id.toString(), Sender.AI, aiReply);

        // Invalidate cache again after AI response
        if (redisService.isAvailable()) {
            await redisService.del(`conversation:${conversation._id.toString()}`);
        }

        // Check if this conversation contains a completed appointment booking
        // Look for confirmation keywords in AI's response
        const appointmentConfirmed = aiReply.toLowerCase().includes('appointment') &&
            (aiReply.toLowerCase().includes('booked') ||
                aiReply.toLowerCase().includes('scheduled') ||
                aiReply.toLowerCase().includes('confirmed'));

        if (appointmentConfirmed) {
            try {
                // Extract appointment details from conversation history using AI
                const allMessages = [...conversationContext, { sender: 'USER', text: message }, { sender: 'AI', text: aiReply }];

                // Import LLM service for AI extraction
                const { extractAppointmentDetails } = await import('./llm.service.js');

                // Use AI to extract appointment details
                const extracted = await extractAppointmentDetails(allMessages);

                if (!extracted) {
                    console.log('⚠️ AI could not extract appointment details');
                    throw new Error('Could not extract appointment details from conversation');
                }

                const { petOwnerName, petName, phone, preferredDateTime } = extracted;

                console.log('📝 AI extracted appointment data:', {
                    petOwnerName,
                    petName,
                    phone,
                    preferredDateTime
                });

                // If we have all required fields, validate and create the appointment
                if (petOwnerName && petName && phone && preferredDateTime) {
                    // Import services
                    const { createAppointment } = await import('./appointment.service.js');
                    const { parseAppointmentDateTime, validateAppointmentTime } = await import('./slot.service.js');

                    // Parse the date/time from AI-extracted natural language
                    const appointmentDate = parseAppointmentDateTime(preferredDateTime);

                    if (appointmentDate) {
                        // Validate the time slot
                        const validation = await validateAppointmentTime(appointmentDate);

                        if (validation.isValid) {
                            // Create the appointment
                            const appointment = await createAppointment({
                                conversationId: conversation._id.toString(),
                                petOwnerName,
                                petName,
                                phone,
                                preferredDateTime: appointmentDate,
                            });

                            console.log(`✅ Auto-created appointment: ${appointment._id} for ${petName} at ${appointmentDate.toLocaleString()}`);

                            // Add a follow-up confirmation message
                            const confirmationMessage = `✅ **Appointment Successfully Booked!**\n\nYour appointment has been confirmed and saved to our system:\n- Pet: ${petName}\n- Owner: ${petOwnerName}\n- Date/Time: ${appointmentDate.toLocaleString()}\n- Appointment ID: ${appointment._id}\n\nWe look forward to seeing you and ${petName}!`;

                            await saveMessage(conversation._id.toString(), Sender.AI, confirmationMessage);
                        } else {
                            console.log(`⚠️ Appointment slot not available: ${validation.message}`);

                            // Add error message about availability
                            const errorMessage = `❌ Sorry, ${validation.message}`;
                            await saveMessage(conversation._id.toString(), Sender.AI, errorMessage);
                        }
                    } else {
                        console.log(`⚠️ Could not parse appointment date/time from: ${preferredDateTime}`);

                        const errorMessage = `❌ Sorry, I couldn't understand the date/time "${preferredDateTime}". Please try again.`;
                        await saveMessage(conversation._id.toString(), Sender.AI, errorMessage);
                    }
                } else {
                    console.log('⚠️ Could not extract all required appointment details');
                }
            } catch (appointmentError: any) {
                console.error('⚠️ Failed to auto-create appointment:', appointmentError);

                // Add error message to conversation
                const errorMessage = `❌ Sorry, I couldn't complete the booking: ${appointmentError.message || 'Unknown error'}. Please try again or call us directly.`;
                await saveMessage(conversation._id.toString(), Sender.AI, errorMessage);
            }
        }

        // Get the latest AI message (might be confirmation or error message)
        const latestMessages = await Message.find({ conversationId: conversation._id })
            .sort({ timestamp: -1 })
            .limit(1)
            .lean();

        const finalReply = latestMessages[0]?.text || aiReply;

        return {
            reply: finalReply,
            sessionId: conversation._id.toString(),
            messageId: aiMessage._id.toString(),
        };
    } catch (error) {
        console.error('❌ Error processing chat message:', error);
        throw error;
    }
}
