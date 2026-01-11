/**
 * Get Gemini API key from environment
 * Using a function to ensure it's read after dotenv.config()
 */
function getGeminiApiKey(): string {
    const key = process.env.GEMINI_API_KEY || '';
    if (!key) {
        console.warn('⚠️  GEMINI_API_KEY is not set. LLM features will not work.');
    }
    return key;
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

// Veterinary Knowledge Base
const KNOWLEDGE_BASE = `
You are a helpful veterinary assistant chatbot for a veterinary clinic.

YOUR CAPABILITIES:
1. Answer general veterinary questions
2. Help book veterinary appointments with Dr. Peteshwar Dogari

VETERINARY TOPICS YOU CAN HELP WITH:
- Pet care and general health advice
- Vaccination schedules and recommendations
- Common pet illnesses and symptoms
- Diet and nutrition guidance
- Preventive care tips
- Behavioral concerns
- Emergency care guidance (always recommend immediate vet visit for emergencies)

CLINIC HOURS & APPOINTMENT INFORMATION:
- Veterinarian: Dr. Peteshwar Dogari
- Clinic Hours: 10 AM to 6 PM
- Appointment Duration: 1 hour each
- Available Time Slots: 10 AM, 11 AM, 12 PM, 1 PM, 2 PM, 3 PM, 4 PM, 5 PM
- Appointments must be scheduled on the hour (not 10:30, 11:15, etc.)

APPOINTMENT BOOKING:
When a user wants to book an appointment, you need to collect:
1. Pet Owner Name
2. Pet Name
3. Phone Number
4. Preferred Date and Time

IMPORTANT GUIDELINES:
- Be friendly, professional, and empathetic
- Keep responses concise (2-3 sentences when possible)
- For medical emergencies, always recommend immediate veterinary care
- Do not diagnose serious conditions - recommend in-person examination
- If asked about non-veterinary topics, politely redirect to veterinary matters
- **IMPORTANT**: Ask for ALL appointment details in ONE message to save time
- Only ask for missing details if user doesn't provide everything
- Confirm all details before finalizing an appointment

APPOINTMENT TIME VALIDATION:
- If user requests a time outside 10 AM - 6 PM, politely inform them of clinic hours
- If user requests a time not on the hour (e.g., 10:30 AM), ask them to choose an hourly slot
- Remind users that appointments are 1 hour long
- If a user asks for a specific time, acknowledge it and proceed with booking

APPOINTMENT BOOKING FLOW:
1. When user wants to book, ask for ALL details at once:
   "I'd be happy to help you book an appointment with Dr. Peteshwar Dogari! Please provide:
   - Your name
   - Your pet's name
   - Your phone number
   - Preferred date and time (our hours are 10 AM to 6 PM)"

2. If user provides all details, confirm immediately:
   "Perfect! Let me confirm: Appointment for [Pet Name] with [Owner Name], scheduled for [Date/Time], contact: [Phone]. Is this correct?"

3. If user misses some details, ask ONLY for the missing ones:
   "Thank you! I just need a few more details: [list missing items]"

4. After confirmation, finalize:
   "Wonderful! Your appointment with Dr. Peteshwar Dogari is confirmed for [Date/Time]. We look forward to seeing you and [Pet Name]!"

Example Efficient Conversation:
User: "I need to book an appointment"
You: "I'd be happy to help you book an appointment with Dr. Peteshwar Dogari! Please provide your name, your pet's name, your phone number, and your preferred date and time. Our clinic hours are 10 AM to 6 PM, and appointments are available on the hour."
User: "My name is John Doe, my dog Buddy needs a checkup, my number is 555-1234, tomorrow at 2 PM works"
You: "Perfect! Let me confirm: Appointment for Buddy with John Doe, scheduled for tomorrow at 2:00 PM, contact number 555-1234. Is this correct?"
User: "Yes"
You: "Wonderful! Your appointment with Dr. Peteshwar Dogari is confirmed for tomorrow at 2:00 PM. We look forward to seeing you and Buddy!"
`;

const SUGGESTED_QUESTIONS = [
    "What vaccinations does my puppy need?",
    "How often should I take my cat to the vet?",
    "What should I feed my senior dog?",
    "I'd like to book an appointment",
    "What are signs of illness in pets?",
    "How can I prevent fleas and ticks?",
];

/**
 * Call Gemini API with specified model
 */
async function callGeminiAPI(
    model: string,
    contents: any[],
    generationConfig: any
): Promise<string> {
    const apiKey = getGeminiApiKey();
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig,
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
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: any): boolean {
    const errorMessage = error.message?.toLowerCase() || '';
    return (
        errorMessage.includes('quota') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('429') ||
        errorMessage.includes('resource_exhausted')
    );
}

/**
 * Detect if user wants to book an appointment
 */
export function detectAppointmentIntent(message: string): boolean {
    const appointmentKeywords = [
        'appointment',
        'book',
        'schedule',
        'visit',
        'see the vet',
        'come in',
        'bring my pet',
        'reservation',
    ];

    const lowerMessage = message.toLowerCase();
    return appointmentKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Extract appointment information from conversation
 * Returns extracted fields or null if not found
 */
export function extractAppointmentInfo(conversationHistory: Array<{ sender: 'USER' | 'AI'; text: string }>) {
    const info: {
        petOwnerName?: string;
        petName?: string;
        phone?: string;
        preferredDateTime?: string;
    } = {};

    // Simple extraction logic - can be enhanced with NLP
    const userMessages = conversationHistory
        .filter(msg => msg.sender === 'USER')
        .map(msg => msg.text);

    // Look for phone numbers (simple pattern)
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    for (const msg of userMessages) {
        const phoneMatch = msg.match(phonePattern);
        if (phoneMatch && !info.phone) {
            info.phone = phoneMatch[0];
        }
    }

    // Look for dates/times (simple patterns)
    const datePatterns = [
        /tomorrow/i,
        /today/i,
        /next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
        /\d{1,2}(am|pm)/i,
        /\d{1,2}:\d{2}/,
    ];

    for (const msg of userMessages) {
        for (const pattern of datePatterns) {
            if (pattern.test(msg) && !info.preferredDateTime) {
                info.preferredDateTime = msg;
                break;
            }
        }
    }

    return info;
}

/**
 * Generate AI reply using Gemini API with automatic fallback
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
                parts: [{ text: 'Understood. I am a helpful veterinary assistant. How can I help you and your pet today?' }]
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

        const generationConfig = {
            maxOutputTokens: 800,
            temperature: 0.7,
        };

        // Cascading fallback: try multiple models in order
        const models = [
            { name: 'gemini-2.5-flash', quota: '20 RPD' },
            { name: 'gemini-2.5-flash-lite', quota: '20 RPD' },
            { name: 'gemini-3-flash', quota: '20 RPD' },
            { name: 'gemma-3-12b', quota: '14.4K RPD' },
        ];

        let lastError: any = null;

        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            try {
                console.log(`🤖 Trying model ${i + 1}/${models.length}: ${model.name} (${model.quota})`);
                const response = await callGeminiAPI(model.name, contents, generationConfig);
                console.log(`✅ Success with ${model.name}`);
                return response;
            } catch (error: any) {
                lastError = error;

                if (isRateLimitError(error)) {
                    console.log(`⚠️  ${model.name} rate limit hit (${model.quota} exceeded)`);
                    // Try next model
                    if (i < models.length - 1) {
                        console.log(`🔄 Falling back to ${models[i + 1].name}...`);
                        continue;
                    }
                } else {
                    // Non-rate-limit error, throw immediately
                    throw error;
                }
            }
        }

        // All models failed
        console.error('❌ All models exhausted');
        throw lastError || new Error('All AI models are currently unavailable');

    } catch (error: any) {
        console.error('❌ Gemini API Error:', error);

        // Handle specific error cases
        if (error.message?.includes('API key') || error.message?.includes('401')) {
            throw new Error('Invalid or missing API key. Please check your GEMINI_API_KEY environment variable.');
        }

        if (isRateLimitError(error)) {
            return "I apologize, but I'm experiencing high demand right now. Please try again in a moment.";
        }

        if (error.message?.includes('timeout')) {
            return "I'm sorry, but I'm taking too long to respond. Please try asking your question again.";
        }

        // Generic fallback
        return "I apologize, but I'm having trouble processing your request right now. Please try again or call our clinic directly for immediate assistance.";
    }
}

/**
 * Get suggested questions based on veterinary knowledge base
 */
export function getSuggestedQuestions(): string[] {
    return SUGGESTED_QUESTIONS;
}

/**
 * Extract appointment details from conversation using AI
 */
export async function extractAppointmentDetails(
    conversationHistory: Array<{ sender: string; text: string }>
): Promise<{
    petOwnerName: string | null;
    petName: string | null;
    phone: string | null;
    preferredDateTime: string | null;
} | null> {
    try {
        const apiKey = getGeminiApiKey();

        // Build conversation context
        const conversationText = conversationHistory
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join('\n');

        const extractionPrompt = `
You are a data extraction assistant. Extract the following appointment details from this conversation:

Conversation:
${conversationText}

Extract and return ONLY a JSON object with these exact fields:
{
  "petOwnerName": "full name of the pet owner",
  "petName": "name of the pet",
  "phone": "phone number (digits only)",
  "preferredDateTime": "date and time in natural language (e.g., 'tomorrow at 5 PM', 'day after tomorrow at 2 PM')"
}

Rules:
- If a field is not found, use null
- For phone, extract only digits
- For preferredDateTime, keep the natural language format from the conversation
- Return ONLY the JSON object, no other text

JSON:`;

        // Try multiple models in order
        const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3-flash', 'gemma-3-12b'];

        for (const modelName of models) {
            try {
                console.log(`🤖 Extraction: Trying ${modelName}...`);

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                role: 'user',
                                parts: [{ text: extractionPrompt }]
                            }],
                            generationConfig: {
                                maxOutputTokens: 200,
                                temperature: 0.1,
                            },
                        }),
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    if (response.status === 429) {
                        console.log(`⚠️  ${modelName} rate limit hit, trying next model...`);
                        continue; // Try next model
                    }
                    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
                }

                const data = await response.json() as GeminiResponse;
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!text) {
                    console.log(`⚠️  ${modelName} returned no text, trying next model...`);
                    continue;
                }

                // Extract JSON from response (might have markdown code blocks)
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error('No JSON found in AI response:', text);
                    continue;
                }

                const extracted = JSON.parse(jsonMatch[0]);

                console.log(`✅ Extraction successful with ${modelName}:`, extracted);

                return {
                    petOwnerName: extracted.petOwnerName || null,
                    petName: extracted.petName || null,
                    phone: extracted.phone ? extracted.phone.replace(/\D/g, '') : null,
                    preferredDateTime: extracted.preferredDateTime || null,
                };
            } catch (error: any) {
                console.error(`❌ Error with ${modelName}:`, error.message);
                // Continue to next model
            }
        }

        // All models failed
        console.error('❌ All extraction models exhausted');
        return null;
    } catch (error) {
        console.error('❌ Error extracting appointment details:', error);
        return null;
    }
}
