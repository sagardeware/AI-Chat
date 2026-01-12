# 🐾 Veterinary Chatbot SDK

An embeddable AI-powered chatbot widget for veterinary clinics. Easy integration, smart appointment booking, and 24/7 pet care assistance.

---

## ✨ Features

- 🤖 **AI-Powered Conversations** - Answers veterinary questions using Google Gemini
- 📅 **Smart Appointment Booking** - Conversational booking with Dr. Peteshwar Dogari
- ⏰ **Slot Validation** - Working hours (10 AM - 6 PM), conflict detection, edge case handling
- 💬 **Floating Widget** - Non-intrusive, expandable/collapsible chat interface
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 📦 **Zero Dependencies** - Self-contained bundle, no conflicts with host site
- 🔧 **Easy Integration** - Single `<script>` tag, works on any website

---

## 🚀 Quick Start

### 1. **Build the SDK**

```bash
cd frontend
npm run build:sdk
```

This creates `dist-sdk/vet-chatbot-sdk.umd.js` (~259 KB)

### 2. **Embed on Your Website**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Vet Clinic</title>
</head>
<body>
    <h1>Welcome to Our Clinic!</h1>
    
    <!-- Configure the chatbot (optional) -->
    <script>
        window.VetChatbotConfig = {
            apiUrl: 'https://your-backend.com', // Your backend API URL
            userId: 'user-123',                  // Optional: User ID
            userName: 'John Doe',                // Optional: User name
            petName: 'Max',                      // Optional: Pet name
            source: 'website'                    // Optional: Traffic source
        };
    </script>
    
    <!-- Load the SDK -->
    <script src="https://your-cdn.com/vet-chatbot-sdk.umd.js"></script>
</body>
</html>
```

### 3. **Done!** 🎉

The chat widget will appear in the bottom-right corner automatically.

---

## 📖 Configuration

### `window.VetChatbotConfig`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `apiUrl` | string | ✅ Yes | Backend API URL (e.g., `https://api.yourvet.com`) |
| `userId` | string | ❌ No | Unique user identifier |
| `userName` | string | ❌ No | User's name (pre-fills in conversation) |
| `petName` | string | ❌ No | Pet's name (pre-fills in conversation) |
| `source` | string | ❌ No | Traffic source for analytics |

**Example:**

```javascript
window.VetChatbotConfig = {
    apiUrl: 'https://api.sunnypaws.vet',
    userId: 'customer-456',
    userName: 'Sarah Johnson',
    petName: 'Bella',
    source: 'homepage'
};
```

---

## 🎮 Programmatic API

Control the widget programmatically using `window.VetChatbot`:

```javascript
// Open the chat widget
window.VetChatbot.open();

// Close the chat widget
window.VetChatbot.close();

// Reinitialize the widget
window.VetChatbot.init();

// Remove the widget from the page
window.VetChatbot.destroy();
```

**Example Use Cases:**

```javascript
// Open chat when user clicks a button
document.getElementById('help-btn').addEventListener('click', () => {
    window.VetChatbot.open();
});

// Auto-open after 5 seconds
setTimeout(() => {
    window.VetChatbot.open();
}, 5000);

// Close on specific page navigation
window.addEventListener('beforeunload', () => {
    window.VetChatbot.close();
});
```

---

## 🏗️ Architecture

### **Frontend (SDK)**
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite (Library Mode)
- **Bundle Format:** UMD (Universal Module Definition)
- **Styling:** Tailwind CSS (injected into JS bundle)
- **Size:** ~259 KB (minified)

### **Backend (API)**
- **Runtime:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini (cascading fallback across 4 models)
- **Caching:** Redis (optional)
- **Validation:** Zod + validator.js

---

## 📦 What's Included

```
frontend/
├── dist-sdk/
│   └── vet-chatbot-sdk.umd.js    # Standalone SDK bundle
├── src/
│   ├── sdk.tsx                    # SDK entry point
│   ├── components/
│   │   ├── ChatWidget.tsx         # Main widget component
│   │   └── ChatContainer.tsx      # Chat interface
│   └── lib/
│       └── api.ts                 # API client (reads SDK config)
└── demo.html                      # Integration demo
```

---

## 🧪 Testing the SDK

### **Local Development:**

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Build SDK:**
   ```bash
   cd frontend
   npm run build:sdk
   ```

3. **Open Demo:**
   ```bash
   # Serve demo.html with a local server
   npx serve .
   ```

4. **Visit:** `http://localhost:3000/demo.html`

---

## 🎨 Customization

### **Widget Appearance**

The widget is styled with Tailwind CSS. To customize:

1. Edit `src/components/ChatWidget.tsx`
2. Modify colors, sizes, animations
3. Rebuild: `npm run build:sdk`

### **Widget Position**

Default: Bottom-right corner

To change position, edit `src/sdk.tsx`:

```typescript
this.container.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999;';
```

### **Widget Size**

Default: 400px × 600px (desktop), full-screen (mobile)

Edit in `src/components/ChatWidget.tsx`:

```typescript
className="w-[500px] h-[700px]"  // Custom size
```

---

## 🔒 Security

### **CORS Configuration**

Update backend CORS to allow your domain:

```typescript
// backend/src/index.ts
app.use(cors({
    origin: ['https://yourwebsite.com', 'http://localhost:3000'],
    credentials: true
}));
```

### **API Key Protection**

- ✅ API keys stored server-side only
- ✅ No sensitive data in frontend bundle
- ✅ Rate limiting enabled (Redis)
- ✅ Input validation (Zod)

---

## 📊 Appointment System

### **Features:**
- ✅ Working hours: 10 AM - 6 PM (Monday-Saturday)
- ✅ Slot duration: 1 hour
- ✅ Conflict detection (no double-booking)
- ✅ Edge case handling:
  - Past time prevention
  - Minimum 1-hour notice
  - Maximum 90-day advance booking
  - Sunday closure
- ✅ AI-powered data extraction
- ✅ Automatic MongoDB storage

### **Booking Flow:**

```
User: "I'd like to book an appointment"
AI: "Please provide your name, pet's name, phone, and preferred time"
User: "John Doe, Max, 5551234567, tomorrow at 2 PM"
AI: "Confirming appointment for Max with John Doe, tomorrow at 2 PM..."
✅ System validates slot → Saves to MongoDB → Confirms to user
```

---

## 🚀 Deployment

### **Frontend (SDK)**

1. **Build:**
   ```bash
   npm run build:sdk
   ```

2. **Upload `dist-sdk/vet-chatbot-sdk.umd.js` to:**
   - CDN (Cloudflare, AWS S3 + CloudFront)
   - Static hosting (Netlify, Vercel)
   - Your own server

3. **Update script src in integration code**

### **Backend (API)**

Deploy to:
- **Render** (recommended)
- **Railway**
- **Heroku**
- **AWS/GCP/Azure**

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AIza...
REDIS_URL=redis://...
REDIS_ENABLED=true
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourwebsite.com
```

---

## 📈 Monitoring

### **Backend Logs:**
```
🤖 Trying model 1/4: gemini-2.5-flash (20 RPD)
✅ Success with gemini-2.5-flash
📝 AI extracted appointment data: { petOwnerName: 'John', petName: 'Max', ... }
✅ Auto-created appointment: 6963fd59... for Max at 1/13/2026, 2:00 PM
```

### **Browser Console:**
```
🐾 Vet Chatbot SDK initialized { apiUrl: 'http://localhost:3001', ... }
```

---

## 🐛 Troubleshooting

### **Widget not appearing:**
- Check browser console for errors
- Verify `apiUrl` in config
- Ensure backend is running
- Check CORS settings

### **API errors:**
- Verify `GEMINI_API_KEY` is set
- Check MongoDB connection
- Review backend logs
- Test API endpoints directly

### **Appointments not saving:**
- Check backend console for extraction logs
- Verify MongoDB connection
- Review slot validation errors
- Check conversation history

---

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/message` | POST | Send message, get AI response |
| `/api/chat/history/:sessionId` | GET | Get conversation history |
| `/api/chat/suggestions` | GET | Get suggested questions |
| `/api/chat/appointments` | GET | List all appointments |
| `/api/chat/slots/:date` | GET | Check available slots |

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] File upload (pet photos)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Calendar integration
- [ ] Multi-doctor support
- [ ] Analytics dashboard

---

## 📄 License

MIT License - Feel free to use in your projects!

---

## 🤝 Support

- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues
- **Email:** support@vetchatbot.com

---

**Built with ❤️ for veterinary clinics worldwide** 🐾
