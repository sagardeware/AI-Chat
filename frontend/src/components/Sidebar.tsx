import { X, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ConversationList } from './ConversationList';
import { cn } from '@/lib/utils';
import type { ConversationListItem } from '@/types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: ConversationListItem[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewChat: () => void;
    isLoading?: boolean;
}

export function Sidebar({
    isOpen,
    onClose,
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewChat,
    isLoading,
}: SidebarProps) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed left-0 top-0 h-full w-80 bg-card border-r z-50 transition-transform duration-300',
                    'lg:static lg:z-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Conversations</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onNewChat}
                                title="New Chat"
                            >
                                <MessageSquarePlus className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="lg:hidden"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Conversation List */}
                    <ScrollArea className="flex-1">
                        <ConversationList
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            onSelectConversation={onSelectConversation}
                            isLoading={isLoading}
                        />
                    </ScrollArea>
                </div>
            </div>
        </>
    );
}
