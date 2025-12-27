import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/redis.service.js';

/**
 * Rate limiting middleware using Redis
 * Limits requests per session to prevent spam and API abuse
 */
export async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    // If Redis is not available, skip rate limiting
    if (!redisService.isAvailable()) {
        return next();
    }

    try {
        const sessionId = req.body.sessionId || req.ip || 'anonymous';
        const currentMinute = Math.floor(Date.now() / 60000); // Current minute timestamp
        const key = `ratelimit:${sessionId}:${currentMinute}`;

        // Increment request count
        const count = await redisService.incr(key);

        if (count === null) {
            // Redis error, allow request
            return next();
        }

        // Set expiry on first request
        if (count === 1) {
            await redisService.expire(key, 60);
        }

        // Check if rate limit exceeded
        const RATE_LIMIT = 10; // 10 requests per minute
        if (count > RATE_LIMIT) {
            res.status(429).json({
                error: 'Too many requests. Please slow down and try again in a minute.',
                retryAfter: 60,
            });
            return;
        }

        // Add rate limit headers
        res.setHeader('X-RateLimit-Limit', RATE_LIMIT.toString());
        res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT - count).toString());
        res.setHeader('X-RateLimit-Reset', ((currentMinute + 1) * 60).toString());

        next();
    } catch (error) {
        console.error('❌ Rate limit middleware error:', error);
        // On error, allow the request to proceed
        next();
    }
}
