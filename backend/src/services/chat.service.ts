import { Sender } from '@prisma/client';
import prisma from '../config/database.js';
import { generateReply } from './llm.service.js';

/**
 * Create a new conversation
 */
export async function createConversation() {
    return await prisma.conversation.create({
        data: {
            metadata: {
                createdAt: new Date().toISOString(),
            },
        },
    });
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: string) {
    return await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            messages: {
                orderBy: { timestamp: 'asc' },
            },
        },
    });
}

/**
 * Get conversation history
 */
export async function getConversationHistory(conversationId: string) {
    const conversation = await getConversation(conversationId);

    if (!conversation) {
        return null;
    }

    return {
        conversationId: conversation.id,
        messages: conversation.messages.map((msg) => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.timestamp,
        })),
    };
}

/**
 * Save a message to the database
 */
export async function saveMessage(
    conversationId: string,
    sender: Sender,
    text: string
) {
    return await prisma.message.create({
        data: {
            conversationId,
            sender,
            text,
        },
    });
}

/**
 * Get all conversations with metadata
 */
export async function getAllConversations() {
    const conversations = await prisma.conversation.findMany({
        include: {
            messages: {
                orderBy: { timestamp: 'asc' },
                take: 1, // Get first message for preview
            },
            _count: {
                select: { messages: true }
            }
        },
        orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv) => ({
        id: conv.id,
        preview: conv.messages[0]?.text || 'New Chat',
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messageCount: conv._count.messages,
    }));
}

/**
 * Process a chat message and get AI response
 */
export async function processChatMessage(message: string, sessionId?: string) {
    try {
        // Get or create conversation
        let conversation;
        if (sessionId) {
            conversation = await getConversation(sessionId);
            if (!conversation) {
                conversation = await createConversation();
            }
        } else {
            conversation = await createConversation();
        }

        // Get conversation history for context
        const history = await getConversationHistory(conversation.id);
        const conversationContext = history?.messages.map((msg) => ({
            sender: msg.sender,
            text: msg.text,
        })) || [];

        // Save user message
        await saveMessage(conversation.id, Sender.USER, message);

        // Generate AI reply
        const aiReply = await generateReply(conversationContext, message);

        // Save AI message
        const aiMessage = await saveMessage(conversation.id, Sender.AI, aiReply);

        return {
            reply: aiReply,
            sessionId: conversation.id,
            messageId: aiMessage.id,
        };
    } catch (error) {
        console.error('❌ Error processing chat message:', error);
        throw error;
    }
}
