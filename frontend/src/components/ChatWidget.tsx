import { useState } from 'react';
import { ChatContainer } from './ChatContainer';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';

/**
 * ChatWidget - Floating, expandable chatbot widget
 * Can be collapsed to a button or expanded to show full chat interface
 */
export function ChatWidget() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleWidget = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {/* Collapsed State - Floating Button */}
            {!isExpanded && (
                <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Button
                        onClick={toggleWidget}
                        size="lg"
                        className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        aria-label="Open chat"
                    >
                        <MessageCircle className="h-8 w-8" />
                    </Button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat with us
                    </div>
                </div>
            )}

            {/* Expanded State - Chat Interface */}
            {isExpanded && (
                <div className="fixed bottom-6 right-6 max-md:bottom-4 max-md:right-4 max-md:left-4 z-50 animate-in fade-in slide-in-from-bottom-8 duration-300">
                    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                        {/* Widget Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base">Veterinary Assistant</h3>
                                    <p className="text-xs text-white/80">We're here to help! 🐾</p>
                                </div>
                            </div>
                            <Button
                                onClick={toggleWidget}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white hover:bg-white/20"
                                aria-label="Close chat"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Chat Container - Desktop */}
                        <div className="hidden md:block w-[400px] h-[600px] pt-16">
                            <ChatContainer isWidget={true} />
                        </div>

                        {/* Chat Container - Mobile (Centered with rounded corners) */}
                        <div className="md:hidden w-full h-[650px] max-h-[90vh] pt-16">
                            <ChatContainer isWidget={true} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
