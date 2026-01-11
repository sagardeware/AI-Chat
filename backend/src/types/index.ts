export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

export interface ChatRequest {
    message: string;
    sessionId?: string;
    context?: {
        userId?: string;
        userName?: string;
        petName?: string;
        source?: string;
        [key: string]: any;
    };
}

export interface ChatResponse {
    reply: string;
    sessionId: string;
    messageId: string;
}

export interface ConversationHistory {
    messages: Array<{
        id: string;
        sender: 'USER' | 'AI';
        text: string;
        timestamp: Date;
    }>;
    conversationId: string;
}

export interface SuggestionsResponse {
    suggestions: string[];
}

export interface ConversationListItem {
    id: string;
    preview: string;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
}

export interface ConversationsListResponse {
    conversations: ConversationListItem[];
}

export interface AppointmentRequest {
    conversationId: string;
    petOwnerName: string;
    petName: string;
    phone: string;
    preferredDateTime: string | Date;
}

export interface AppointmentResponse {
    success: boolean;
    appointmentId: string;
    message: string;
    appointment: {
        id: string;
        petOwnerName: string;
        petName: string;
        phone: string;
        preferredDateTime: Date;
        status: string;
    };
}
