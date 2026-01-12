import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from './components/ChatWidget';
import './index.css';

// Global configuration interface
declare global {
    interface Window {
        VetChatbotConfig?: {
            apiUrl?: string;
            userId?: string;
            userName?: string;
            petName?: string;
            source?: string;
        };
        VetChatbot?: {
            init: () => void;
            destroy: () => void;
            open: () => void;
            close: () => void;
        };
    }
}

class VetChatbotSDK {
    private root: ReactDOM.Root | null = null;
    private container: HTMLDivElement | null = null;

    init() {
        // Create container for the widget
        this.container = document.createElement('div');
        this.container.id = 'vet-chatbot-widget';
        this.container.style.cssText = 'position: fixed; z-index: 9999;';
        document.body.appendChild(this.container);


        // Get configuration
        const config = window.VetChatbotConfig || {};

        // Store config in sessionStorage for the widget to access
        if (config.apiUrl) {
            sessionStorage.setItem('vetChatbot_apiUrl', config.apiUrl);
        }
        if (config.userId) {
            sessionStorage.setItem('vetChatbot_userId', config.userId);
        }
        if (config.userName) {
            sessionStorage.setItem('vetChatbot_userName', config.userName);
        }
        if (config.petName) {
            sessionStorage.setItem('vetChatbot_petName', config.petName);
        }
        if (config.source) {
            sessionStorage.setItem('vetChatbot_source', config.source);
        }

        // Render the widget
        this.root = ReactDOM.createRoot(this.container);
        this.root.render(
            <React.StrictMode>
                <ChatWidget />
            </React.StrictMode>
        );

        console.log('🐾 Vet Chatbot SDK initialized', config);
    }

    destroy() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.container) {
            document.body.removeChild(this.container);
            this.container = null;
        }
        console.log('🐾 Vet Chatbot SDK destroyed');
    }

    open() {
        // Trigger widget open (we'll implement this in ChatWidget)
        const event = new CustomEvent('vetChatbot:open');
        window.dispatchEvent(event);
    }

    close() {
        // Trigger widget close
        const event = new CustomEvent('vetChatbot:close');
        window.dispatchEvent(event);
    }
}

// Auto-initialize when script loads
const sdk = new VetChatbotSDK();

// Expose SDK to window
window.VetChatbot = {
    init: () => sdk.init(),
    destroy: () => sdk.destroy(),
    open: () => sdk.open(),
    close: () => sdk.close(),
};

// Auto-init if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sdk.init());
} else {
    sdk.init();
}

export default sdk;
