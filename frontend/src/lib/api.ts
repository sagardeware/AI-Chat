import axios from 'axios';
import type { ChatRequest, ChatResponse, ConversationHistory, SuggestionsResponse, ConversationListItem, ConversationsListResponse, Appointment, AppointmentsResponse } from '../types';

// Get API URL from SDK config or environment
const getApiUrl = () => {
    // Check if running as SDK (config in sessionStorage)
    const sdkApiUrl = typeof window !== 'undefined'
        ? sessionStorage.getItem('vetChatbot_apiUrl')
        : null;

    return sdkApiUrl || import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

const API_URL = getApiUrl();

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Send a message and get AI response
 */
export async function sendMessage(
    message: string,
    sessionId?: string
): Promise<ChatResponse> {
    // Prepare request body
    const requestBody: ChatRequest = {
        message,
        sessionId,
    };

    // If this is a new conversation (no sessionId), include context from SDK config
    if (!sessionId) {
        const context: ChatRequest['context'] = {};

        // Read from sessionStorage (set by SDK)
        const userId = sessionStorage.getItem('vetChatbot_userId');
        const userName = sessionStorage.getItem('vetChatbot_userName');
        const petName = sessionStorage.getItem('vetChatbot_petName');
        const source = sessionStorage.getItem('vetChatbot_source');

        // Only include context if at least one value exists
        if (userId || userName || petName || source) {
            if (userId) context.userId = userId;
            if (userName) context.userName = userName;
            if (petName) context.petName = petName;
            if (source) context.source = source;

            requestBody.context = context;
        }
    }

    const response = await api.post<ChatResponse>('/chat/message', requestBody);
    return response.data;
}

/**
 * Get conversation history
 */
export async function getHistory(sessionId: string): Promise<ConversationHistory> {
    const response = await api.get<ConversationHistory>(`/chat/history/${sessionId}`);
    return response.data;
}

/**
 * Get suggested questions
 */
export async function getSuggestions(): Promise<string[]> {
    const response = await api.get<SuggestionsResponse>('/chat/suggestions');
    return response.data.suggestions;
}

/**
 * Get list of all conversations
 */
export async function getConversations(): Promise<ConversationListItem[]> {
    const response = await api.get<ConversationsListResponse>('/chat/conversations');
    return response.data.conversations;
}

/**
 * Get all appointments
 */
export async function getAppointments(): Promise<Appointment[]> {
    const response = await api.get<AppointmentsResponse>('/chat/appointments');
    return response.data.appointments;
}


