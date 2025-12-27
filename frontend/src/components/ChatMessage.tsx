import { Avatar, AvatarFallback } from './ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.sender === 'USER';

    return (
        <div
            className={cn(
                'flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2',
                isUser && 'flex-row-reverse'
            )}
        >
            <Avatar className={cn('h-8 w-8', isUser ? 'bg-primary' : 'bg-secondary')}>
                <AvatarFallback>
                    {isUser ? (
                        <User className="h-4 w-4" />
                    ) : (
                        <Bot className="h-4 w-4" />
                    )}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    'flex flex-col max-w-[75%]',
                    isUser && 'items-end'
                )}
            >
                <div
                    className={cn(
                        'rounded-2xl px-4 py-2 shadow-sm',
                        isUser
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-muted rounded-tl-sm'
                    )}
                >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-2">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
        </div>
    );
}
