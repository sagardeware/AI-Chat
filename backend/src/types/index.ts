export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

export interface ChatRequest {
    message: string;
    sessionId?: string;
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
