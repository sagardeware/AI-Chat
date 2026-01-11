import { Appointment } from '../models/index.js';

/**
 * Clinic working hours and slot configuration
 */
export const CLINIC_CONFIG = {
    WORKING_HOURS: {
        START: 10, // 10 AM
        END: 18,   // 6 PM (last appointment at 5 PM)
    },
    SLOT_DURATION_HOURS: 1,
    AVAILABLE_SLOTS: [10, 11, 12, 13, 14, 15, 16, 17], // 10 AM to 5 PM
};

/**
 * Check if a time slot is within working hours
 */
export function isWithinWorkingHours(hour: number): boolean {
    return hour >= CLINIC_CONFIG.WORKING_HOURS.START &&
        hour < CLINIC_CONFIG.WORKING_HOURS.END;
}

/**
 * Check if a specific date/time slot is available
 */
export async function isSlotAvailable(requestedDateTime: Date): Promise<boolean> {
    const hour = requestedDateTime.getHours();

    // Check if within working hours
    if (!isWithinWorkingHours(hour)) {
        return false;
    }

    // Check if slot is in valid hourly slots
    if (!CLINIC_CONFIG.AVAILABLE_SLOTS.includes(hour)) {
        return false;
    }

    // Check if slot is already booked
    const startTime = new Date(requestedDateTime);
    startTime.setMinutes(0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + CLINIC_CONFIG.SLOT_DURATION_HOURS);

    // Find any appointments that overlap with this time slot
    const existingAppointments = await Appointment.find({
        preferredDateTime: {
            $gte: startTime,
            $lt: endTime,
        },
        status: { $ne: 'cancelled' }, // Exclude cancelled appointments
    });

    return existingAppointments.length === 0;
}

/**
 * Get available slots for a specific date
 */
export async function getAvailableSlotsForDate(date: Date): Promise<number[]> {
    const availableSlots: number[] = [];

    for (const hour of CLINIC_CONFIG.AVAILABLE_SLOTS) {
        const slotDateTime = new Date(date);
        slotDateTime.setHours(hour, 0, 0, 0);

        const isAvailable = await isSlotAvailable(slotDateTime);
        if (isAvailable) {
            availableSlots.push(hour);
        }
    }

    return availableSlots;
}

/**
 * Format hour to readable time string
 */
export function formatTimeSlot(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
}

/**
 * Get available slots as formatted strings
 */
export async function getAvailableSlotsFormatted(date: Date): Promise<string[]> {
    const slots = await getAvailableSlotsForDate(date);
    return slots.map(formatTimeSlot);
}

/**
 * Validate appointment time and provide feedback
 */
export async function validateAppointmentTime(requestedDateTime: Date): Promise<{
    isValid: boolean;
    message: string;
    availableSlots?: string[];
}> {
    const now = new Date();
    const hour = requestedDateTime.getHours();

    // Check if in the past
    if (requestedDateTime < now) {
        return {
            isValid: false,
            message: 'Cannot book appointments in the past. Please choose a future date and time.',
        };
    }

    // Check minimum notice (1 hour)
    const minNotice = new Date(now.getTime() + 60 * 60 * 1000);
    if (requestedDateTime < minNotice) {
        return {
            isValid: false,
            message: 'Appointments require at least 1 hour advance notice. Please choose a later time.',
        };
    }

    // Check maximum advance (90 days)
    const maxAdvance = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    if (requestedDateTime > maxAdvance) {
        return {
            isValid: false,
            message: 'Appointments can only be booked up to 3 months in advance. Please choose an earlier date.',
        };
    }

    // Check if Sunday (clinic closed)
    if (requestedDateTime.getDay() === 0) {
        return {
            isValid: false,
            message: 'Our clinic is closed on Sundays. Please choose another day (Monday-Saturday).',
        };
    }

    // Check if within working hours
    if (!isWithinWorkingHours(hour)) {
        return {
            isValid: false,
            message: `Our clinic hours are from ${formatTimeSlot(CLINIC_CONFIG.WORKING_HOURS.START)} to ${formatTimeSlot(CLINIC_CONFIG.WORKING_HOURS.END - 1)}. Please choose a time within these hours.`,
        };
    }

    // Check if on the hour
    if (!CLINIC_CONFIG.AVAILABLE_SLOTS.includes(hour)) {
        return {
            isValid: false,
            message: 'Appointments must be scheduled on the hour (e.g., 10 AM, 11 AM, 12 PM, etc.).',
        };
    }

    // Check if slot is available
    const isAvailable = await isSlotAvailable(requestedDateTime);

    if (!isAvailable) {
        // Get available slots for that day
        const availableSlots = await getAvailableSlotsFormatted(requestedDateTime);

        if (availableSlots.length === 0) {
            return {
                isValid: false,
                message: 'Unfortunately, all slots are booked for this day. Please choose another date.',
            };
        }

        return {
            isValid: false,
            message: `This time slot is already booked. Available slots for this day are: ${availableSlots.join(', ')}.`,
            availableSlots,
        };
    }

    return {
        isValid: true,
        message: 'This time slot is available!',
    };
}

/**
 * Parse user input to extract date and time
 */
export function parseAppointmentDateTime(input: string): Date | null {
    const now = new Date();
    let appointmentDate = new Date(now);

    // Handle "tomorrow"
    if (input.toLowerCase().includes('tomorrow')) {
        appointmentDate.setDate(appointmentDate.getDate() + 1);
    }
    // Handle "today"
    else if (input.toLowerCase().includes('today')) {
        // Keep current date
    }
    // Handle specific dates (can be enhanced)
    else {
        // Try to parse date from input
        const dateMatch = input.match(/(\d{1,2})\/(\d{1,2})/);
        if (dateMatch) {
            const month = parseInt(dateMatch[1]) - 1; // Month is 0-indexed
            const day = parseInt(dateMatch[2]);
            appointmentDate.setMonth(month, day);
        }
    }

    // Extract time
    const timeMatch = input.match(/(\d{1,2})\s*(am|pm|AM|PM)?/);
    if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const meridiem = timeMatch[2]?.toLowerCase();

        if (meridiem === 'pm' && hour < 12) hour += 12;
        if (meridiem === 'am' && hour === 12) hour = 0;

        appointmentDate.setHours(hour, 0, 0, 0);
        return appointmentDate;
    }

    return null;
}
