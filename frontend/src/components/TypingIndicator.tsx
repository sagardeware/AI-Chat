import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

export function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <Avatar className="h-8 w-8 bg-secondary">
                <AvatarFallback>
                    <Bot className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <div className="flex items-center bg-muted rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2.5 h-2.5 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2.5 h-2.5 bg-foreground/60 rounded-full animate-bounce"></div>
                    </div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-2">
                    AI is typing...
                </span>
            </div>
        </div>
    );
}
