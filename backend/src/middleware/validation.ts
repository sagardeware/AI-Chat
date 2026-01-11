import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// Validation schemas
const chatMessageSchema = z.object({
    message: z
        .string()
        .min(1, 'Message cannot be empty')
        .max(2000, 'Message cannot exceed 2000 characters')
        .trim(),
    sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID format').optional(),
    context: z.record(z.any()).optional(), // Allow any context object
});

const sessionIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID format');

/**
 * Validate chat message request
 */
export function validateChatMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validated = chatMessageSchema.parse(req.body);
        req.body = validated;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            });
        }
        next(error);
    }
}

/**
 * Validate session ID parameter
 */
export function validateSessionId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validated = sessionIdSchema.parse(req.params.sessionId);
        req.params.sessionId = validated;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Invalid session ID format',
                details: error.errors,
            });
        }
        next(error);
    }
}
