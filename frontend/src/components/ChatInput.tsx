import { useState, KeyboardEvent, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Send } from 'lucide-react';
import { getSuggestions } from '@/lib/api';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled: boolean;
}

const MAX_LENGTH = 2000;

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        // Load suggestions on mount
        getSuggestions()
            .then(setSuggestions)
            .catch((error) => {
                console.error('Failed to load suggestions:', error);
            });
    }, []);

    const handleSend = () => {
        const trimmed = message.trim();
        if (trimmed && trimmed.length <= MAX_LENGTH) {
            onSendMessage(trimmed);
            setMessage('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        onSendMessage(suggestion);
    };

    const remainingChars = MAX_LENGTH - message.length;
    const isOverLimit = message.length > MAX_LENGTH;

    return (
        <div className="border-t bg-background p-4 space-y-3">
            {/* Suggested Questions */}
            {suggestions.length > 0 && message.length === 0 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent transition-colors animate-in fade-in slide-in-from-bottom-1"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Input Field */}
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        disabled={disabled}
                        className={isOverLimit ? 'border-destructive' : ''}
                    />
                    <div className="flex justify-between items-center mt-1 px-1">
                        <span
                            className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'
                                }`}
                        >
                            {remainingChars < 100 && `${remainingChars} characters remaining`}
                        </span>
                    </div>
                </div>
                <Button
                    onClick={handleSend}
                    disabled={disabled || !message.trim() || isOverLimit}
                    size="icon"
                    className="shrink-0"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
