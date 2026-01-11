import mongoose, { Schema, Document } from 'mongoose';

/**
 * Conversation Document Interface
 */
export interface IConversation extends Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    metadata?: {
        userId?: string;
        userName?: string;
        petName?: string;
        source?: string;
        [key: string]: any; // Allow additional context fields
    };
}

/**
 * Conversation Schema
 */
const ConversationSchema = new Schema<IConversation>(
    {
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'conversations',
    }
);

// Indexes for performance
ConversationSchema.index({ createdAt: -1 });
ConversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
