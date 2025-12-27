const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY is not set. LLM features will not work.');
}

// Type for Gemini API response
interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

// Knowledge base for the fictional e-commerce store
const KNOWLEDGE_BASE = `
You are a helpful customer support agent for "TechMart" - a modern e-commerce store.

STORE INFORMATION:
- Shipping Policy: Free shipping on orders over $50. Standard shipping takes 3-5 business days. We ship to USA, Canada, and UK.
- Return Policy: 30-day return policy on all items. Free return shipping. Full refund upon receipt of returned items.
- Support Hours: Monday to Friday, 9 AM - 6 PM EST. Email support available 24/7 at support@techmart.com
- Product Categories: Electronics, Clothing, Home & Garden, Sports & Outdoors
- Payment Methods: We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay
- Order Tracking: Customers receive tracking information via email once order ships
- Customer Service: Phone: 1-800-TECHMART, Live Chat available during business hours

GUIDELINES:
- Be friendly, professional, and concise
- Answer questions based on the information above
- If you don't know something, politely say you'll need to check with the team
- Keep responses under 3 sentences when possible
- Always maintain a helpful and positive tone
`;

const SUGGESTED_QUESTIONS = [
    "What's your return policy?",
    "Do you ship internationally?",
    "What are your support hours?",
    "What payment methods do you accept?",
    "How long does shipping take?",
    "How can I track my order?",
];

/**
 * Generate AI reply using Gemini API
 */
export async function generateReply(
    conversationHistory: Array<{ sender: 'USER' | 'AI'; text: string }>,
    userMessage: string
): Promise<string> {
    try {
        // Build conversation history for context
        const contents = [
            {
                role: 'user',
                parts: [{ text: KNOWLEDGE_BASE }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood. I am a helpful customer support agent for TechMart. How can I help you today?' }]
            },
            ...conversationHistory.slice(-10).map((msg) => ({
                role: msg.sender === 'USER' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            })),
            {
                role: 'user',
                parts: [{ text: userMessage }]
            }
        ];

        // Make direct REST API call to v1beta endpoint
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        maxOutputTokens: 800,
                        temperature: 0.7,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json() as GeminiResponse;
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text || text.trim().length === 0) {
            throw new Error('Empty response from Gemini API');
        }

        return text.trim();
    } catch (error: any) {
        console.error('❌ Gemini API Error:', error);

        // Handle specific error cases
        if (error.message?.includes('API key') || error.message?.includes('401')) {
            throw new Error('Invalid or missing API key. Please check your GEMINI_API_KEY environment variable.');
        }

        if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('429')) {
            return "I apologize, but I'm experiencing high demand right now. Please try again in a moment.";
        }

        if (error.message?.includes('timeout')) {
            return "I'm sorry, but I'm taking too long to respond. Please try asking your question again.";
        }

        // Generic fallback
        return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team at support@techmart.com.";
    }
}

/**
 * Get suggested questions based on knowledge base
 */
export function getSuggestedQuestions(): string[] {
    return SUGGESTED_QUESTIONS;
}
