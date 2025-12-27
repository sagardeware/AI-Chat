import { Router } from 'express';
import type { Request, Response } from 'express';
import { validateChatMessage, validateSessionId } from '../middleware/validation.js';
import { processChatMessage, getConversationHistory, getAllConversations } from '../services/chat.service.js';
import { getSuggestedQuestions } from '../services/llm.service.js';
import type { ChatRequest, ChatResponse, ConversationHistory, SuggestionsResponse, ConversationsListResponse } from '../types/index.js';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message and get AI reply
 */
router.post('/message', validateChatMessage, async (req: Request, res: Response) => {
    try {
        const { message, sessionId } = req.body as ChatRequest;

        const result = await processChatMessage(message, sessionId);

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
    } catch (error: any) {
        console.error('❌ Error in GET /api/chat/history:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch conversation history',
        });
    }
});

/**
 * GET /api/chat/conversations
 * Get list of all conversations
 */
router.get('/conversations', async (req: Request, res: Response) => {
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
router.get('/suggestions', (req: Request, res: Response) => {
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

export default router;
