import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { sendMessage, getHistory } from '@/lib/api';
import type { Message } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

const SESSION_STORAGE_KEY = 'chat_session_id';

export function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSessionId) {
            setSessionId(savedSessionId);
            loadHistory(savedSessionId);
        }
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const loadHistory = async (sid: string) => {
        try {
            const history = await getHistory(sid);
            setMessages(history.messages);
        } catch (err) {
            console.error('Failed to load history:', err);
            // If history fails to load, start fresh
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setSessionId(null);
        }
    };

    const handleSendMessage = async (text: string) => {
        setError(null);
        setIsLoading(true);

        // Add user message optimistically
        const userMessage: Message = {
            id: crypto.randomUUID(),
            sender: 'USER',
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await sendMessage(text, sessionId || undefined);

            // Save session ID
            if (!sessionId) {
                setSessionId(response.sessionId);
                localStorage.setItem(SESSION_STORAGE_KEY, response.sessionId);
            }

            // Add AI response
            const aiMessage: Message = {
                id: response.messageId,
                sender: 'AI',
                text: response.reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err: any) {
            console.error('Failed to send message:', err);
            setError(
                err.response?.data?.error ||
                err.message ||
                'Failed to send message. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
    };

    const handleNewChat = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionId(null);
        setMessages([]);
        setError(null);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col shadow-lg">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">TechMart Support</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            AI-powered customer support • Always here to help
                        </p>
                    </div>
                    {messages.length > 0 && (
                        <Button variant="outline" size="sm" onClick={handleNewChat}>
                            New Chat
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👋</div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Welcome to TechMart Support!
                                </h3>
                                <p className="text-muted-foreground">
                                    Ask me anything about our products, shipping, returns, or support hours.
                                </p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {isLoading && <TypingIndicator />}

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-destructive">Error</p>
                                    <p className="text-sm text-destructive/90 mt-1">{error}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRetry}
                                        className="mt-2"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </CardContent>
        </Card>
    );
}
