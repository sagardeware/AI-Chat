# 🐾 AI-Powered Veterinary Chatbot Platform

> An intelligent, full-stack chatbot platform for veterinary clinics with appointment booking, AI-powered conversations, and an embeddable SDK for seamless website integration.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [SDK Integration](#-sdk-integration)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This is a **production-ready AI chatbot platform** specifically designed for veterinary clinics. It provides:

- 🤖 **Intelligent Conversations** - Powered by Google Gemini AI for natural, context-aware responses
- 📅 **Smart Appointment Booking** - AI extracts appointment details from natural language
- 🔌 **Embeddable SDK** - One-line integration for any website
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 💾 **Conversation History** - Persistent chat sessions with MongoDB
- 🎨 **Beautiful UI** - Modern, accessible interface with smooth animations

---

## ✨ Features

### 🤖 AI-Powered Chat
- **Natural Language Understanding** - Understands pet health questions in conversational language
- **Context-Aware Responses** - Maintains conversation context across messages
- **Multi-Model Fallback** - Cascading model strategy ensures high availability
- **Suggested Questions** - Quick-reply buttons for common queries
- **Markdown Support** - Rich text formatting in responses

### 📅 Appointment Management
- **AI Extraction** - Automatically extracts pet name, owner name, date/time from conversation
- **Slot Validation** - Checks availability before booking
- **Confirmation System** - User confirms details before final booking
- **Appointment Display** - View all booked appointments on the main page with shadcn/ui components
- **Real-time Updates** - Refresh appointments with a single click
- **Status Tracking** - Visual badges for pending, confirmed, and cancelled appointments
- **Appointment History** - View past and upcoming appointments
- **Flexible Scheduling** - Supports custom clinic hours and slot durations

### 🎨 Modern UI with Shadcn/UI
- **Premium Components** - Professional Card, Badge, and Button components
- **Responsive Grid** - Adaptive layout (1-3 columns based on screen size)
- **Icon Integration** - Lucide icons for enhanced visual clarity
- **Loading States** - Animated spinners and skeleton screens
- **Error Handling** - User-friendly error messages with retry options
- **Empty States** - Helpful messaging when no data is available
- **Custom Animations** - Smooth fade-in and slide-in transitions

### 🔌 Embeddable SDK
- **One-Line Integration** - Add chatbot to any website with a single script tag
- **Customizable Configuration** - Set API URL, user info, and branding
- **CSS Isolation** - No style conflicts with host website
- **Mobile Responsive** - Adapts to screen size (floating widget or centered modal)
- **Improved Mobile Height** - Enhanced chatbox height (650px) for better mobile experience
- **Programmatic API** - Control widget via JavaScript (`open()`, `close()`, etc.)

### 💬 User Experience
- **Typing Indicators** - Shows when AI is thinking
- **Message Timestamps** - Track conversation timeline
- **Smooth Animations** - Fade-in effects and transitions
- **Error Handling** - Graceful error messages and retry logic
- **Accessibility** - ARIA labels and keyboard navigation

### 🔐 Security & Performance
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Backend validates all user inputs
- **Rate Limiting Ready** - Prepared for production rate limits
- **Environment Variables** - Secure API key management
- **Optimized Bundle** - SDK is only 144KB (gzipped)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Websites                          │
│  (Veterinary Clinic Sites with Embedded SDK)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + SDK)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Main App    │  │  Chat Widget │  │  Embeddable  │      │
│  │  (Vite)      │  │  Component   │  │  SDK (UMD)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Chat Routes │  │  Appointment │  │  LLM Service │      │
│  │              │  │  Routes      │  │  (Gemini)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────┬───────────────────────────────────────┬────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│   MongoDB Atlas  │                  │  Google Gemini   │
│  (Conversations, │                  │   AI API         │
│   Appointments)  │                  │                  │
└──────────────────┘                  └──────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/UI** - Premium accessible component library
- **Radix UI** - Headless UI primitives
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants

### **Backend**
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database and ODM
- **CORS** - Cross-origin resource sharing
- **Google Gemini API** - AI language model

### **DevOps & Deployment**
- **Render** - Cloud hosting platform
- **MongoDB Atlas** - Managed database
- **GitHub** - Version control
- **npm** - Package management

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-Chat.git
   cd AI-Chat
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

5. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open the application**
   - Main app: http://localhost:5173
   - Backend API: http://localhost:3001

---

## 📁 Project Structure

```
AI-Chat/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Conversation.ts      # Conversation schema
│   │   │   ├── Appointment.ts       # Appointment schema
│   │   │   └── Slot.ts              # Slot schema
│   │   ├── routes/
│   │   │   ├── chat.routes.ts       # Chat endpoints
│   │   │   └── appointment.routes.ts # Appointment endpoints
│   │   ├── services/
│   │   │   ├── chat.service.ts      # Chat business logic
│   │   │   ├── llm.service.ts       # AI integration
│   │   │   ├── appointment.service.ts # Appointment logic
│   │   │   └── slot.service.ts      # Slot management
│   │   └── index.ts                 # Express app setup
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget.tsx       # Floating widget
│   │   │   ├── ChatContainer.tsx    # Main chat UI
│   │   │   ├── ChatMessage.tsx      # Message display
│   │   │   ├── ChatInput.tsx        # Input field
│   │   │   ├── AppointmentsList.tsx # Appointments display
│   │   │   └── ui/                  # Shadcn UI components
│   │   │       ├── card.tsx         # Card component
│   │   │       ├── badge.tsx        # Badge component
│   │   │       ├── button.tsx       # Button component
│   │   │       └── separator.tsx    # Separator component
│   │   ├── hooks/
│   │   │   └── useAppointments.ts   # Appointments custom hook
│   │   ├── lib/
│   │   │   ├── api.ts               # API client
│   │   │   └── utils.ts             # Utility functions
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   ├── App.tsx                  # Main app
│   │   ├── sdk.tsx                  # SDK entry point
│   │   └── index.css                # Global styles + animations
│   ├── dist-sdk/                    # SDK build output
│   ├── demo.html                    # SDK demo page
│   ├── components.json              # Shadcn UI config
│   ├── package.json
│   ├── vite.config.ts               # Vite configuration
│   └── tsconfig.json
│
├── DEPLOYMENT.md                    # Deployment guide
├── QUICK_DEPLOY.md                  # Quick reference
├── SDK_README.md                    # SDK documentation
├── APPOINTMENTS_FEATURE.md          # Appointments feature docs
├── SHADCN_REDESIGN.md               # UI redesign documentation
└── README.md                        # This file
```

---

## 📡 API Documentation

### **Chat Endpoints**

#### `POST /api/chat/message`
Send a message and get AI response.

**Request:**
```json
{
  "message": "What vaccinations does my puppy need?",
  "conversationId": "optional-conversation-id",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "reply": "Puppies typically need...",
  "conversationId": "conv-abc123",
  "appointmentConfirmed": false
}
```

#### `GET /api/chat/conversations/:userId`
Get conversation history for a user.

#### `GET /api/chat/suggestions`
Get suggested questions.

### **Appointment Endpoints**

#### `GET /api/chat/appointments`
Get all appointments (for display on main page).

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "id": "apt-123",
      "conversationId": "conv-abc",
      "petOwnerName": "John Doe",
      "petName": "Buddy",
      "phone": "555-1234",
      "preferredDateTime": "2026-01-15T14:00:00Z",
      "status": "pending",
      "createdAt": "2026-01-12T10:30:00Z"
    }
  ]
}
```

#### `GET /api/appointments/slots/available`
Get available appointment slots.

**Query Parameters:**
- `date` - Date in YYYY-MM-DD format

#### `POST /api/appointments`
Create a new appointment.

**Request:**
```json
{
  "petName": "Buddy",
  "ownerName": "John Doe",
  "contactNumber": "1234567890",
  "dateTime": "2026-01-15T14:00:00Z",
  "reason": "Vaccination"
}
```

#### `GET /api/appointments/:userId`
Get appointments for a user.

---

## 🔌 SDK Integration

### **Quick Start**

Add this to any HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Clinic</title>
</head>
<body>
    <h1>Welcome to Our Clinic!</h1>
    
    <!-- SDK Configuration -->
    <script>
        window.VetChatbotConfig = {
            apiUrl: 'https://your-backend.onrender.com',
            userId: 'clinic-user-123',
            userName: 'John Doe',
            source: 'clinic-website'
        };
    </script>
    
    <!-- Load SDK -->
    <script src="https://your-frontend.onrender.com/sdk/vet-chatbot-sdk.umd.cjs"></script>
</body>
</html>
```

### **Configuration Options**

```javascript
window.VetChatbotConfig = {
    apiUrl: 'https://your-backend.onrender.com',  // Required
    userId: 'unique-user-id',                      // Optional
    userName: 'User Name',                         // Optional
    petName: 'Pet Name',                           // Optional
    source: 'website-identifier'                   // Optional
};
```

### **Programmatic Control**

```javascript
// Open the chat widget
window.VetChatbot.open();

// Close the chat widget
window.VetChatbot.close();

// Destroy the widget
window.VetChatbot.destroy();

// Reinitialize
window.VetChatbot.init();
```

**For detailed SDK documentation, see [SDK_README.md](./SDK_README.md)**

---

## 🚀 Deployment

### **Quick Deploy to Render**

1. **Update Frontend Build Command:**
   ```bash
   npm install && npm run build:all
   ```

2. **Set Environment Variables** (on Render dashboard)

3. **Push to GitHub** - Render auto-deploys!

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📸 Screenshots

### Main Chat Interface
![Chat Interface](./screenshots/chat-interface.png)
*Modern, responsive chat interface with AI-powered responses*

### Appointment Booking
![Appointment Booking](./screenshots/appointment-booking.png)
*Smart appointment booking with AI extraction*

### Mobile View
![Mobile View](./screenshots/mobile-view.png)
*Centered modal design on mobile devices*

### SDK Integration
![SDK Demo](./screenshots/sdk-demo.png)
*Embeddable widget on a clinic website*

---

## 🎨 Key Features Breakdown

### **1. Intelligent Conversation Management**
- Persistent conversation history stored in MongoDB
- Context maintained across multiple messages
- User identification for personalized experiences
- Conversation retrieval and continuation

### **2. AI-Powered Appointment Booking**
```typescript
// AI extracts structured data from natural language
User: "I'd like to book an appointment for my dog Buddy tomorrow at 2pm"

AI Extracts:
{
  petName: "Buddy",
  dateTime: "2026-01-13T14:00:00Z",
  ownerName: "John Doe" // from context
}
```

### **3. Multi-Model Fallback Strategy**
```typescript
const models = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b'
];

// Automatically tries next model if one fails
```

### **4. Slot Management System**
- Dynamic slot generation based on clinic hours
- Real-time availability checking
- Concurrent booking prevention
- Flexible slot duration configuration

### **5. Responsive SDK**
- **Desktop:** Floating widget (400×600px) in bottom-right
- **Mobile:** Centered modal with rounded corners
- **Tablet:** Adaptive sizing
- **All devices:** Smooth animations and transitions

---

## 🧪 Testing

### **Run Tests Locally**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### **Test SDK Integration**

1. Build SDK: `npm run build:sdk`
2. Serve demo: `npx serve .`
3. Open: `http://localhost:3000/demo.html`

---

## 🔧 Development

### **Build SDK**
```bash
cd frontend
npm run build:sdk
```
Output: `dist-sdk/vet-chatbot-sdk.umd.cjs`

### **Build Everything**
```bash
npm run build:all
```
Builds main app + SDK and copies SDK to `dist/sdk/`

### **Code Style**
```bash
npm run lint
```

---

## 🌟 Highlights

- ✅ **Production-Ready** - Deployed on Render with MongoDB Atlas
- ✅ **Type-Safe** - Full TypeScript coverage
- ✅ **Scalable** - Modular architecture for easy expansion
- ✅ **Accessible** - WCAG compliant with ARIA labels
- ✅ **Performant** - Optimized bundle size (144KB SDK)
- ✅ **Documented** - Comprehensive docs and inline comments
- ✅ **Tested** - Manual testing across devices and browsers

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sagar Deware**

- GitHub: [@sagardeware](https://github.com/sagardeware)
- LinkedIn: [Sagar Deware](https://linkedin.com/in/sagardeware)

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) - AI language model
- [Render](https://render.com/) - Hosting platform
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide Icons](https://lucide.dev/) - Icon library

---

## 📚 Additional Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Quick Deploy Reference](./QUICK_DEPLOY.md) - TL;DR deployment guide
- [SDK Documentation](./SDK_README.md) - Complete SDK reference
- [Appointment System](./APPOINTMENT_SYSTEM_COMPLETE.md) - Appointment feature details
- [Slot Management](./SLOT_MANAGEMENT.md) - Slot system documentation

---

## 🎯 Roadmap

- [ ] Add user authentication
- [ ] Implement admin dashboard
- [ ] Add email notifications for appointments
- [ ] Support multiple languages
- [ ] Add voice input/output
- [ ] Implement analytics dashboard
- [ ] Add payment integration
- [ ] Support multiple clinics (multi-tenancy)

---

<div align="center">

**Built with ❤️ for veterinary clinics worldwide**

⭐ Star this repo if you find it helpful!

</div>
