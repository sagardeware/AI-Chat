import { useState, useEffect } from 'react';

interface TypewriterTextProps {
    text: string;
    speed?: number; // milliseconds per character
}

export function TypewriterText({ text, speed = 20 }: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed]);

    // Reset when text changes
    useEffect(() => {
        setDisplayedText('');
        setCurrentIndex(0);
    }, [text]);

    return <>{displayedText}</>;
}
