import axios from 'axios';
import type { ChatRequest, ChatResponse, ConversationHistory, SuggestionsResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    const response = await api.post<ChatResponse>('/chat/message', {
        message,
        sessionId,
    } as ChatRequest);
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
