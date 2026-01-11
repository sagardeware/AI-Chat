/**
 * Export all Mongoose models
 */
export { Conversation } from './Conversation.model.js';
export { Message, Sender } from './Message.model.js';
export { Appointment, AppointmentStatus } from './Appointment.model.js';

// Type-only exports
export type { IConversation } from './Conversation.model.js';
export type { IMessage } from './Message.model.js';
export type { IAppointment } from './Appointment.model.js';
