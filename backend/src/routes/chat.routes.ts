import { Router } from 'express';
import type { Request, Response } from 'express';
import { validateChatMessage, validateSessionId } from '../middleware/validation.js';
import { rateLimitMiddleware } from '../middleware/ratelimit.middleware.js';
import { processChatMessage, getConversationHistory, getAllConversations } from '../services/chat.service.js';
import { createAppointment, getAllAppointments } from '../services/appointment.service.js';
import { getSuggestedQuestions } from '../services/llm.service.js';
import type { ChatRequest, ChatResponse, ConversationHistory, SuggestionsResponse, ConversationsListResponse, AppointmentRequest, AppointmentResponse } from '../types/index.js';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message and get AI reply (with rate limiting)
 * Supports optional context from SDK config
 */
router.post('/message', rateLimitMiddleware, validateChatMessage, async (req: Request, res: Response) => {
    try {
        const { message, sessionId, context } = req.body as ChatRequest;

        const result = await processChatMessage(message, sessionId, context);

        const response: ChatResponse = {
            reply: result.reply,
            sessionId: result.sessionId,
            messageId: result.messageId,
        };

        res.json(response);
    } catch (error: any) {
        console.error('❌ Error in POST /api/chat/message:', error);
        res.status(500).json({
            error: error.message || 'Failed to process message',
        });
    }
});

/**
 * GET /api/chat/history/:sessionId
 * Fetch conversation history
 */
router.get('/history/:sessionId', validateSessionId, async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;

        const history = await getConversationHistory(sessionId);

        if (!history) {
            return res.status(404).json({
                error: 'Conversation not found',
            });
        }

        const response: ConversationHistory = {
            messages: history.messages,
            conversationId: history.conversationId,
        };

        res.json(response);
        return;
    } catch (error: any) {
        console.error('❌ Error in GET /api/chat/history:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch conversation history',
        });
        return;
    }
});

/**
 * GET /api/chat/conversations
 * Get list of all conversations
 */
router.get('/conversations', async (_req: Request, res: Response) => {
    try {
        const conversations = await getAllConversations();

        const response: ConversationsListResponse = {
            conversations,
        };

        res.json(response);
    } catch (error: any) {
        console.error('❌ Error in GET /api/chat/conversations:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch conversations',
        });
    }
});

/**
 * GET /api/chat/suggestions
 * Get suggested questions
 */
router.get('/suggestions', (_req: Request, res: Response) => {
    try {
        const suggestions = getSuggestedQuestions();

        const response: SuggestionsResponse = {
            suggestions,
        };

        res.json(response);
    } catch (error: any) {
        console.error('❌ Error in GET /api/chat/suggestions:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch suggestions',
        });
    }
});

/**
 * POST /api/chat/appointment
 * Create a new veterinary appointment
 */
router.post('/appointment', async (req: Request, res: Response) => {
    try {
        const { conversationId, petOwnerName, petName, phone, preferredDateTime } = req.body as AppointmentRequest;

        // Validate required fields
        if (!conversationId || !petOwnerName || !petName || !phone || !preferredDateTime) {
            return res.status(400).json({
                error: 'Missing required fields: conversationId, petOwnerName, petName, phone, preferredDateTime',
            });
        }

        const appointment = await createAppointment({
            conversationId,
            petOwnerName,
            petName,
            phone,
            preferredDateTime: new Date(preferredDateTime),
        });

        const response: AppointmentResponse = {
            success: true,
            appointmentId: appointment._id.toString(),
            message: 'Appointment booked successfully',
            appointment: {
                id: appointment._id.toString(),
                petOwnerName: appointment.petOwnerName,
                petName: appointment.petName,
                phone: appointment.phone,
                preferredDateTime: appointment.preferredDateTime,
                status: appointment.status,
            },
        };

        res.json(response);
    } catch (error: any) {
        console.error('❌ Error in POST /api/chat/appointment:', error);
        res.status(500).json({
            error: error.message || 'Failed to create appointment',
        });
        return;
    }
});

/**
 * GET /api/chat/appointments
 * Get all appointments (for admin dashboard)
 */
router.get('/appointments', async (_req: Request, res: Response) => {
    try {
        const appointments = await getAllAppointments();

        res.json({
            success: true,
            appointments: appointments.map((apt: any) => ({
                id: apt._id.toString(),
                conversationId: apt.conversationId.toString(),
                petOwnerName: apt.petOwnerName,
                petName: apt.petName,
                phone: apt.phone,
                preferredDateTime: apt.preferredDateTime,
                status: apt.status,
                createdAt: apt.createdAt,
            })),
        });
    } catch (error: any) {
        console.error('❌ Error in GET /api/chat/appointments:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch appointments',
        });
    }
});

/**
 * GET /api/chat/slots/:date
 * Get available appointment slots for a specific date
 * Date format: YYYY-MM-DD
 */
router.get('/slots/:date', async (req: Request, res: Response) => {
    try {
        const { date } = req.params;

        // Parse date
        const requestedDate = new Date(date);

        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({
                error: 'Invalid date format. Use YYYY-MM-DD',
            });
        }

        // Import slot service
        const { getAvailableSlotsFormatted } = await import('../services/slot.service.js');

        // Get available slots
        const availableSlots = await getAvailableSlotsFormatted(requestedDate);

        res.json({
            success: true,
            date: requestedDate.toISOString().split('T')[0],
            availableSlots,
            count: availableSlots.length,
        });
        return;
    } catch (error: any) {
        console.error('❌ Error in GET /api/chat/slots:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch available slots',
        });
        return;
    }
});

export default router;
