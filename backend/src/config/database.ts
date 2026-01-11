import mongoose from 'mongoose';

/**
 * MongoDB Connection Setup
 */
export async function connectDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);

        console.log('✅ MongoDB: Connected successfully');
        console.log(`📦 Database: ${mongoose.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB: Disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB: Reconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
}

/**
 * Gracefully disconnect from MongoDB
 */
export async function disconnectDatabase() {
    try {
        await mongoose.disconnect();
        console.log('🔴 MongoDB: Disconnected');
    } catch (error) {
        console.error('❌ MongoDB disconnect error:', error);
    }
}

export default mongoose;
