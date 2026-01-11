import mongoose, { Schema, Document } from 'mongoose';

/**
 * Message Sender Enum
 */
export enum Sender {
    USER = 'USER',
    AI = 'AI',
}

/**
 * Message Document Interface
 */
export interface IMessage extends Document {
    _id: mongoose.Types.ObjectId;
    conversationId: mongoose.Types.ObjectId;
    sender: Sender;
    text: string;
    timestamp: Date;
}

/**
 * Message Schema
 */
const MessageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        sender: {
            type: String,
            enum: Object.values(Sender),
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        collection: 'messages',
    }
);

// Compound index for efficient queries
MessageSchema.index({ conversationId: 1, timestamp: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
