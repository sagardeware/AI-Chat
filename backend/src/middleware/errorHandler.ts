import type { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Log error for debugging
    console.error('❌ Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    // Don't expose internal errors to client
    const statusCode = err.statusCode || 500;
    const message =
        statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred. Please try again later.'
            : err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`,
    });
}
