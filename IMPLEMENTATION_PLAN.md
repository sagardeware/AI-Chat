# 🎯 Veterinary Chatbot SDK - Implementation Plan

## 📋 Project Overview
Converting existing AI Chat application into an embeddable Veterinary Chatbot SDK with appointment booking functionality.

---

## ✅ Phase 1: Backend Migration (PostgreSQL → MongoDB)
**Status**: 🟡 IN PROGRESS  
**Effort**: 4-6 hours

### Tasks:
- [ ] 1.1 Install Mongoose and MongoDB dependencies
- [ ] 1.2 Remove Prisma dependencies
- [ ] 1.3 Create Mongoose connection setup
- [ ] 1.4 Create Conversation model (Mongoose schema)
- [ ] 1.5 Create Message model (Mongoose schema)
- [ ] 1.6 Create Appointment model (NEW - Mongoose schema)
- [ ] 1.7 Update chat.service.ts to use Mongoose
- [ ] 1.8 Create appointment.service.ts (NEW)
- [ ] 1.9 Update all database queries
- [ ] 1.10 Test all endpoints
- [ ] 1.11 Update .env with MongoDB URI

---

## ✅ Phase 2: AI Knowledge Base Update
**Status**: ⚪ PENDING  
**Effort**: 1-2 hours

### Tasks:
- [ ] 2.1 Update KNOWLEDGE_BASE to veterinary topics
- [ ] 2.2 Add appointment booking intent detection
- [ ] 2.3 Add field extraction logic (name, pet name, phone, date/time)
- [ ] 2.4 Create conversational booking flow
- [ ] 2.5 Add validation for appointment fields
- [ ] 2.6 Add confirmation step before saving
- [ ] 2.7 Update suggested questions to veterinary topics

---

## ✅ Phase 3: Widget UI (Full-screen → Floating)
**Status**: ⚪ PENDING  
**Effort**: 4-5 hours

### Tasks:
- [ ] 3.1 Create ChatWidget.tsx (floating wrapper component)
- [ ] 3.2 Add collapsed state (circular button, bottom-right)
- [ ] 3.3 Add expanded state (400px × 600px chat interface)
- [ ] 3.4 Implement expand/collapse animations
- [ ] 3.5 Update ChatContainer for widget mode
- [ ] 3.6 Add close button
- [ ] 3.7 Update styling for widget dimensions
- [ ] 3.8 Ensure mobile responsiveness
- [ ] 3.9 Add shadow/border styling
- [ ] 3.10 Test on different screen sizes

---

## ✅ Phase 4: SDK Script Development
**Status**: ⚪ PENDING  
**Effort**: 8-10 hours

### Tasks:
- [ ] 4.1 Install Webpack/Rollup for bundling
- [ ] 4.2 Create SDK entry point (src/sdk/index.ts)
- [ ] 4.3 Set up build configuration for standalone bundle
- [ ] 4.4 Implement window.VetChatbotConfig parsing
- [ ] 4.5 Add context passing to backend
- [ ] 4.6 Update backend to accept and store context
- [ ] 4.7 Auto-inject widget into host page
- [ ] 4.8 Namespace CSS to avoid conflicts
- [ ] 4.9 Update CORS for cross-origin support
- [ ] 4.10 Create test HTML page for SDK integration
- [ ] 4.11 Minify and optimize bundle
- [ ] 4.12 Test on different websites

---

## ✅ Phase 5: Deployment & Documentation
**Status**: ⚪ PENDING  
**Effort**: 2-3 hours

### Tasks:
- [ ] 5.1 Deploy backend to Render
- [ ] 5.2 Deploy frontend/SDK to Render Static Site
- [ ] 5.3 Update environment variables
- [ ] 5.4 Test deployed SDK
- [ ] 5.5 Create README.md with setup instructions
- [ ] 5.6 Create .env.example files
- [ ] 5.7 Document architecture decisions
- [ ] 5.8 Create demo video/screenshots

---

## 🗂️ Database Schema Changes

### Conversation Model (MongoDB)
```javascript
{
  _id: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  metadata: {
    userId?: String,
    userName?: String,
    petName?: String,
    source?: String,
    // Any other context from SDK config
  },
  // messages stored separately with conversationId reference
}
```

### Message Model (MongoDB)
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: 'Conversation'),
  sender: String (enum: ['USER', 'AI']),
  text: String,
  timestamp: Date
}
```

### Appointment Model (NEW - MongoDB)
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: 'Conversation'),
  petOwnerName: String (required),
  petName: String (required),
  phone: String (required),
  preferredDateTime: Date (required),
  status: String (enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 New API Endpoints

### POST /api/chat/appointment
Create a new appointment

**Request:**
```json
{
  "conversationId": "string",
  "petOwnerName": "John Doe",
  "petName": "Buddy",
  "phone": "+1234567890",
  "preferredDateTime": "2026-01-15T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "appointmentId": "string",
  "message": "Appointment booked successfully"
}
```

---

## 📦 Dependencies to Add

### Backend:
```json
{
  "mongoose": "^8.0.0",
  "validator": "^13.11.0"  // For phone/email validation
}
```

### Frontend (SDK):
```json
{
  "webpack": "^5.89.0",
  "webpack-cli": "^5.1.4",
  "babel-loader": "^9.1.3",
  "@babel/preset-react": "^7.23.3",
  "@babel/preset-typescript": "^7.23.3"
}
```

---

## 🎨 Widget Design Specs

### Collapsed State:
- Position: `fixed`, `bottom: 20px`, `right: 20px`
- Size: `60px × 60px` circular button
- Icon: Veterinary icon (paw, stethoscope, or bot)
- Background: Primary color with gradient
- Shadow: `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`
- Hover: Scale up slightly, show tooltip

### Expanded State:
- Position: `fixed`, `bottom: 20px`, `right: 20px`
- Size: `400px × 600px` (desktop), `100vw × 100vh` (mobile)
- Border radius: `12px`
- Shadow: `box-shadow: 0 8px 24px rgba(0,0,0,0.2)`
- Animation: Smooth scale-up from collapsed state

---

## 🧪 Testing Checklist

### Backend:
- [ ] MongoDB connection successful
- [ ] All CRUD operations work
- [ ] Appointment creation works
- [ ] Context is stored in metadata
- [ ] Redis caching still works
- [ ] Rate limiting still works

### Frontend:
- [ ] Widget opens/closes smoothly
- [ ] Chat functionality works in widget mode
- [ ] Appointment booking flow works
- [ ] Mobile responsive
- [ ] Works on different browsers

### SDK:
- [ ] Script loads on external website
- [ ] Widget auto-injects correctly
- [ ] Context config is parsed
- [ ] No CSS conflicts with host page
- [ ] Works without config (graceful fallback)
- [ ] CORS allows cross-origin requests

---

## 📝 Environment Variables

### Backend (.env):
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vetchat?retryWrites=true&w=majority

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Redis (Optional)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true

# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🚀 Deployment Plan

### Backend (Render Web Service):
1. Connect GitHub repository
2. Root Directory: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables: Add all from .env

### Frontend/SDK (Render Static Site):
1. Connect GitHub repository
2. Root Directory: `frontend`
3. Build Command: `npm install && npm run build:sdk`
4. Publish Directory: `dist`
5. Environment Variables: `VITE_API_URL`

---

## 📊 Progress Tracking

| Phase | Status | Progress | Estimated Time | Actual Time |
|-------|--------|----------|----------------|-------------|
| Phase 1: MongoDB Migration | 🟡 In Progress | 0% | 4-6 hours | - |
| Phase 2: AI Update | ⚪ Pending | 0% | 1-2 hours | - |
| Phase 3: Widget UI | ⚪ Pending | 0% | 4-5 hours | - |
| Phase 4: SDK Development | ⚪ Pending | 0% | 8-10 hours | - |
| Phase 5: Deployment | ⚪ Pending | 0% | 2-3 hours | - |
| **Total** | | **0%** | **19-26 hours** | **-** |

---

## 🎯 Success Criteria

### Minimum Viable Product (MVP):
- ✅ SDK script can be embedded with single `<script>` tag
- ✅ Floating widget appears in bottom-right corner
- ✅ Widget expands/collapses smoothly
- ✅ AI answers veterinary questions
- ✅ Appointment booking flow works conversationally
- ✅ Context from SDK config is captured and stored
- ✅ Works on any website without conflicts
- ✅ Deployed and accessible via public URL

### Bonus Features (if time permits):
- 🎁 Admin dashboard to view appointments
- 🎁 Email notifications for appointments
- 🎁 Multiple language support
- 🎁 Custom theming via SDK config
- 🎁 Analytics tracking

---

## 📚 Documentation Deliverables

1. **README.md** - Setup instructions, architecture overview
2. **.env.example** - Environment variable templates
3. **ARCHITECTURE.md** - System design, decisions, trade-offs
4. **SDK_INTEGRATION.md** - How to embed SDK on websites
5. **API_DOCUMENTATION.md** - API endpoints reference

---

**Last Updated**: 2026-01-11 23:43 IST  
**Status**: Phase 1 Starting Now 🚀
