# AI Live Chat Agent

A full-stack TypeScript application that provides an AI-powered customer support chat interface using React, Node.js, PostgreSQL, and Google Gemini API.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **LLM**: Google Gemini API (gemini-pro)
- **Validation**: Zod

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Git

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-chat-agent
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your database URL and Gemini API key
```

**Environment Variables** (backend/.env):
```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_chat
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

**Get a Gemini API Key**:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your `.env` file

### 3. Database Setup

```bash
# Run Prisma migrations to create the database schema
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 4. Start the Backend Server

```bash
npm run dev
```

The backend server will start on `http://localhost:3001`

### 5. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env if needed (default points to localhost:3001)
```

**Environment Variables** (frontend/.env):
```
VITE_API_URL=http://localhost:3001
```

### 6. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 7. Open in Browser

Navigate to `http://localhost:5173` and start chatting with the AI support agent!

## 🏗️ Architecture Overview

### Project Structure

```
ai-chat-agent/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and configuration
│   │   ├── services/        # Business logic (LLM, chat)
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Validation, error handling
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Database migrations
│   │   └── seed.ts          # Seed data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # API client, utilities
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Root component
│   └── package.json
└── README.md
```

### Database Schema

**Conversation**
- `id` (UUID) - Primary key
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp
- `metadata` (JSON) - Optional metadata for extensibility

**Message**
- `id` (UUID) - Primary key
- `conversationId` (UUID) - Foreign key to Conversation
- `sender` (Enum: USER | AI) - Message sender
- `text` (String) - Message content
- `timestamp` (DateTime) - Message timestamp

### API Endpoints

#### `POST /api/chat/message`
Send a message and receive an AI response.

**Request:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "reply": "We offer a 30-day return policy...",
  "sessionId": "uuid-session-id",
  "messageId": "uuid-message-id"
}
```

#### `GET /api/chat/history/:sessionId`
Fetch conversation history for a session.

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "sender": "USER",
      "text": "What's your return policy?",
      "timestamp": "2025-12-27T01:00:00Z"
    },
    {
      "id": "uuid",
      "sender": "AI",
      "text": "We offer a 30-day return policy...",
      "timestamp": "2025-12-27T01:00:02Z"
    }
  ],
  "conversationId": "uuid"
}
```

#### `GET /api/chat/suggestions`
Get suggested questions based on the knowledge base.

**Response:**
```json
{
  "suggestions": [
    "What's your return policy?",
    "Do you ship internationally?",
    "What are your support hours?",
    "What payment methods do you accept?"
  ]
}
```

## 🤖 LLM Integration

### Provider
Google Gemini API (gemini-pro model)

### Prompting Strategy

The AI agent is configured with a system prompt that includes:

1. **Persona**: Helpful customer support agent for an e-commerce store
2. **Knowledge Base**:
   - **Shipping**: Free shipping over $50, 3-5 business days, ships to USA, Canada, UK
   - **Returns**: 30-day return policy, free return shipping, full refund
   - **Support Hours**: Mon-Fri 9AM-6PM EST, email support 24/7
   - **Products**: Electronics, Clothing, Home & Garden, Sports
   - **Payments**: Credit cards, PayPal, Apple Pay

3. **Conversation Context**: Last 10 messages are included for contextual responses

### Error Handling & Guardrails

- API timeout handling (30 seconds)
- Rate limit detection and graceful degradation
- Invalid API key detection
- Token limit management (max 150 output tokens)
- Fallback error messages for users

## 🎨 Features

### Core Features
✅ Real-time chat interface with AI responses  
✅ Conversation persistence across page refreshes  
✅ Session management with localStorage  
✅ Contextual AI responses using conversation history  
✅ Suggested questions for easy discovery  
✅ Auto-scroll to latest messages  
✅ Typing indicator while AI is responding  
✅ Input validation (empty messages, length limits)  
✅ Comprehensive error handling  

### UX Enhancements
- Disabled send button during requests
- Character count indicator (max 2000 chars)
- Clickable suggested question chips
- Clear visual distinction between user and AI messages
- Responsive design for mobile and desktop
- Error messages with retry options

## 🧪 Testing

### Manual Testing Checklist

1. **Basic Chat Flow**
   - [ ] Send a message and receive AI response
   - [ ] Send multiple messages in a conversation
   - [ ] Verify AI responses are contextual
   - [ ] Click suggested questions

2. **Persistence**
   - [ ] Refresh page and verify conversation persists
   - [ ] Open in new tab with same session

3. **Error Handling**
   - [ ] Try sending empty message (should be blocked)
   - [ ] Try sending very long message (>2000 chars)
   - [ ] Disconnect internet and send message

4. **FAQ Knowledge**
   - [ ] Ask about shipping policy
   - [ ] Ask about return policy
   - [ ] Ask about support hours
   - [ ] Ask about payment methods

### API Testing

```bash
# Test sending a message
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is your return policy?"}'

# Test getting suggestions
curl http://localhost:3001/api/chat/suggestions

# Test getting history
curl http://localhost:3001/api/chat/history/<session-id>
```

## 🚢 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install && npx prisma generate`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add `DATABASE_URL`, `GEMINI_API_KEY`, `PORT`, `NODE_ENV`
4. Add a PostgreSQL database (Render provides this)

### Frontend Deployment (Vercel)

1. Import your repository on Vercel
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` (your backend URL)
3. Deploy!

## 🔄 Trade-offs & Future Improvements

### Trade-offs Made

1. **No Authentication**: Simplified for the assignment, but production would need user auth
2. **localStorage for Sessions**: Simple but not shareable across devices
3. **Limited Conversation History**: Only last 10 messages for context (cost/performance)
4. **No Real-time Updates**: Polling-based, could use WebSockets for better UX
5. **Basic Error Messages**: Could be more specific and actionable

### If I Had More Time...

1. **Multi-channel Support**: Add WhatsApp, Instagram, Facebook integrations
2. **Admin Dashboard**: View all conversations, analytics, AI performance metrics
3. **Advanced Features**:
   - File/image uploads
   - Rich media responses (images, cards, buttons)
   - Sentiment analysis
   - Auto-escalation to human agents
   - Conversation tagging and categorization
4. **Testing**: Unit tests, integration tests, E2E tests with Playwright
5. **Performance**:
   - Redis caching for frequent queries
   - WebSocket for real-time updates
   - Message pagination for long conversations
6. **AI Improvements**:
   - RAG (Retrieval Augmented Generation) for dynamic knowledge base
   - Fine-tuned model for better brand voice
   - Multi-turn conversation memory
   - Intent detection and routing
7. **DevOps**:
   - Docker containerization
   - CI/CD pipeline
   - Monitoring and logging (Sentry, LogRocket)
   - Load testing and optimization

## 📝 License

MIT

## 👨‍💻 Author

Built as a take-home assignment for Spur - Founding Full-Stack Engineer position.
