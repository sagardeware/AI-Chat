export function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <div className="h-4 w-4 text-muted-foreground">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            </div>
            <div className="flex items-center bg-muted rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
