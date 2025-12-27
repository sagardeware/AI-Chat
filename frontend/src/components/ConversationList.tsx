import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConversationListItem } from '@/types';

interface ConversationListProps {
    conversations: ConversationListItem[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    isLoading?: boolean;
}

export function ConversationList({
    conversations,
    activeConversationId,
    onSelectConversation,
    isLoading,
}: ConversationListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading conversations...</div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground text-center">
                    No conversations yet
                </p>
                <p className="text-xs text-muted-foreground/70 text-center mt-1">
                    Start a new chat to begin
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 p-4">
            {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;

                return (
                    <button
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation.id)}
                        className={cn(
                            'flex flex-col items-start gap-2 rounded-lg px-4 py-3 text-left transition-colors',
                            'hover:bg-accent',
                            isActive && 'bg-accent'
                        )}
                    >
                        <div className="flex items-center justify-between w-full gap-2">
                            <span className="text-sm font-medium line-clamp-1 flex-1">
                                {conversation.preview}
                            </span>
                            {isActive && (
                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                                {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                            </span>
                            <span>•</span>
                            <span>{conversation.messageCount} messages</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
