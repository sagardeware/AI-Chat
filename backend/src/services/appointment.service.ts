import { Appointment, AppointmentStatus, IAppointment } from '../models/index.js';
import mongoose from 'mongoose';

/**
 * Create a new appointment
 */
export async function createAppointment(data: {
    conversationId: string;
    petOwnerName: string;
    petName: string;
    phone: string;
    preferredDateTime: Date;
}): Promise<IAppointment> {
    try {
        // Validate conversationId
        if (!mongoose.Types.ObjectId.isValid(data.conversationId)) {
            throw new Error('Invalid conversation ID');
        }

        // Create appointment
        const appointment = new Appointment({
            conversationId: new mongoose.Types.ObjectId(data.conversationId),
            petOwnerName: data.petOwnerName.trim(),
            petName: data.petName.trim(),
            phone: data.phone.trim(),
            preferredDateTime: new Date(data.preferredDateTime),
            status: AppointmentStatus.PENDING,
        });

        await appointment.save();

        console.log(`✅ Appointment created: ${appointment._id}`);
        return appointment;
    } catch (error: any) {
        console.error('❌ Error creating appointment:', error);
        throw new Error(error.message || 'Failed to create appointment');
    }
}

/**
 * Get appointment by ID
 */
export async function getAppointmentById(appointmentId: string) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return null;
    }

    return await Appointment.findById(appointmentId).lean();
}

/**
 * Get all appointments for a conversation
 */
export async function getAppointmentsByConversation(conversationId: string) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return [];
    }

    return await Appointment.find({
        conversationId: new mongoose.Types.ObjectId(conversationId),
    })
        .sort({ createdAt: -1 })
        .lean();
}

/**
 * Get all appointments (for admin dashboard)
 */
export async function getAllAppointments(filters?: {
    status?: AppointmentStatus;
    startDate?: Date;
    endDate?: Date;
}) {
    const query: any = {};

    if (filters?.status) {
        query.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
        query.preferredDateTime = {};
        if (filters.startDate) {
            query.preferredDateTime.$gte = filters.startDate;
        }
        if (filters.endDate) {
            query.preferredDateTime.$lte = filters.endDate;
        }
    }

    return await Appointment.find(query)
        .sort({ preferredDateTime: 1 })
        .populate('conversationId', 'metadata')
        .lean();
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus
) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        throw new Error('Invalid appointment ID');
    }

    const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true }
    );

    if (!appointment) {
        throw new Error('Appointment not found');
    }

    console.log(`✅ Appointment ${appointmentId} status updated to ${status}`);
    return appointment;
}

/**
 * Cancel appointment
 */
export async function cancelAppointment(appointmentId: string) {
    return await updateAppointmentStatus(appointmentId, AppointmentStatus.CANCELLED);
}

/**
 * Confirm appointment
 */
export async function confirmAppointment(appointmentId: string) {
    return await updateAppointmentStatus(appointmentId, AppointmentStatus.CONFIRMED);
}

/**
 * Delete appointment
 */
export async function deleteAppointment(appointmentId: string) {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        throw new Error('Invalid appointment ID');
    }

    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
        throw new Error('Appointment not found');
    }

    console.log(`🗑️ Appointment ${appointmentId} deleted`);
    return appointment;
}
