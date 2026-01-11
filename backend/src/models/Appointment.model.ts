import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

/**
 * Appointment Status Enum
 */
export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
}

/**
 * Appointment Document Interface
 */
export interface IAppointment extends Document {
    _id: mongoose.Types.ObjectId;
    conversationId: mongoose.Types.ObjectId;
    petOwnerName: string;
    petName: string;
    phone: string;
    preferredDateTime: Date;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Appointment Schema
 */
const AppointmentSchema = new Schema<IAppointment>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        petOwnerName: {
            type: String,
            required: [true, 'Pet owner name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name must not exceed 100 characters'],
        },
        petName: {
            type: String,
            required: [true, 'Pet name is required'],
            trim: true,
            minlength: [1, 'Pet name must be at least 1 character'],
            maxlength: [50, 'Pet name must not exceed 50 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            validate: {
                validator: function (v: string) {
                    // Allow various phone formats
                    return validator.isMobilePhone(v, 'any', { strictMode: false });
                },
                message: 'Please provide a valid phone number',
            },
        },
        preferredDateTime: {
            type: Date,
            required: [true, 'Preferred date and time is required'],
            validate: {
                validator: function (v: Date) {
                    // Ensure appointment is in the future
                    return v > new Date();
                },
                message: 'Appointment date must be in the future',
            },
        },
        status: {
            type: String,
            enum: Object.values(AppointmentStatus),
            default: AppointmentStatus.PENDING,
        },
    },
    {
        timestamps: true,
        collection: 'appointments',
    }
);

// Indexes for performance
AppointmentSchema.index({ createdAt: -1 });
AppointmentSchema.index({ preferredDateTime: 1 });
AppointmentSchema.index({ status: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
