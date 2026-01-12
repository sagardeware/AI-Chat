import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { redisService } from './services/redis.service.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

// Load environment variables FIRST
dotenv.config();

// Initialize Redis and MongoDB
await redisService.init();
await connectDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// For SDK: Allow all origins so the widget can be embedded on any website
// In production, you might want to restrict this to specific domains
const allowedOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // SDK demo (serve)
    'https://ai-chat-frontend-pm8e.onrender.com',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // In development, allow all origins for SDK testing
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        // In production, check against whitelist
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // For SDK: Allow all origins in production too
            // Comment this out if you want to restrict to specific domains
            callback(null, true);

            // Uncomment below to restrict to whitelist only:
            // callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API routes
app.use('/api/chat', chatRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server started successfully!');
    console.log(`📡 Listening on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set'}`);
    console.log(`💾 MongoDB: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured'}`);
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
    console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

    try {
        await redisService.disconnect();
        await disconnectDatabase();
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
