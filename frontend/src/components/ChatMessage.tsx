import { Avatar, AvatarFallback } from './ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';
import ReactMarkdown from 'react-markdown';
import { TypewriterText } from './TypewriterText';

interface ChatMessageProps {
    message: Message;
    isNew?: boolean; // Track if this is a newly received message
}

export function ChatMessage({ message, isNew = false }: ChatMessageProps) {
    const isUser = message.sender === 'USER';
    const shouldAnimate = !isUser && isNew; // Only animate new AI messages

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
                    {isUser ? (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    ) : (
                        <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                            {shouldAnimate ? (
                                <TypewriterText text={message.text} speed={15} />
                            ) : (
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic">{children}</em>,
                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                            )}
                        </div>
                    )}
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
