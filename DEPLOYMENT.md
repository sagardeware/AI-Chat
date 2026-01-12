# 🚀 Deployment Guide - AI Chat with SDK

This guide covers deploying the backend API, frontend application, and SDK to Render.

## 📋 Overview

Your application has three components:
1. **Backend API** - Node.js/Express server
2. **Frontend App** - React application (main chat interface)
3. **SDK** - Embeddable widget for external websites

## 🔧 Prerequisites

- ✅ Backend deployed on Render
- ✅ Frontend deployed on Render
- ✅ MongoDB Atlas database
- ✅ Google Gemini API key

---

## 🎯 Deployment Strategy

### **Option 1: Serve SDK from Frontend (Recommended)**

The SDK will be served as a static file from your frontend deployment.

**URL Structure:**
- Frontend: `https://your-frontend.onrender.com`
- SDK: `https://your-frontend.onrender.com/sdk/vet-chatbot-sdk.umd.cjs`

---

## 📦 Step 1: Update Frontend Build Process

The `package.json` has been updated with:

```json
{
  "scripts": {
    "build:all": "npm run build && npm run build:sdk && npm run postbuild",
    "postbuild": "node -e \"require('fs').cpSync('dist-sdk', 'dist/sdk', {recursive: true})\""
  }
}
```

**What this does:**
1. `npm run build` - Builds the main React app → `dist/`
2. `npm run build:sdk` - Builds the SDK → `dist-sdk/`
3. `npm run postbuild` - Copies SDK files to `dist/sdk/` for deployment

---

## 🚀 Step 2: Update Render Build Command

### **Frontend Service on Render:**

1. Go to your frontend service on Render
2. Update the **Build Command**:
   ```bash
   npm install && npm run build:all
   ```
3. Keep **Start Command** as:
   ```bash
   npm run preview
   ```
   OR if using a static site:
   ```bash
   npx serve dist -p $PORT
   ```

---

## 🌐 Step 3: Update Environment Variables

### **Backend (.env on Render):**
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://your-frontend.onrender.com
NODE_ENV=production
```

### **Frontend (.env on Render):**
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📝 Step 4: Update CORS Configuration

Your backend is already configured to allow all origins for SDK embedding:

```typescript
// backend/src/index.ts
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        // Allow all origins for SDK
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        // Production: Allow all origins for SDK embedding
        callback(null, true);
    },
    credentials: true,
}));
```

**Security Note:** If you want to restrict SDK usage to specific domains, update the `allowedOrigins` array.

---

## 🔗 Step 5: SDK Integration for Clients

Once deployed, clients can integrate the SDK like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Veterinary Clinic</title>
</head>
<body>
    <h1>Welcome to Our Clinic!</h1>
    
    <!-- SDK Configuration -->
    <script>
        window.VetChatbotConfig = {
            apiUrl: 'https://your-backend.onrender.com',
            userId: 'clinic-user-123',
            userName: 'Clinic User',
            source: 'my-clinic-website'
        };
    </script>
    
    <!-- Load SDK -->
    <script src="https://your-frontend.onrender.com/sdk/vet-chatbot-sdk.umd.cjs"></script>
</body>
</html>
```

---

## 🧪 Step 6: Test Deployment

### **Test Backend:**
```bash
curl https://your-backend.onrender.com/health
```
Expected: `{"status":"ok"}`

### **Test Frontend:**
Visit: `https://your-frontend.onrender.com`

### **Test SDK:**
1. Create a test HTML file with the integration code above
2. Update URLs to your deployed backend/frontend
3. Open in browser and verify widget appears

---

## 📊 Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed with `build:all` command
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] SDK accessible at `/sdk/vet-chatbot-sdk.umd.cjs`
- [ ] Test SDK integration on a sample page
- [ ] MongoDB connection working
- [ ] Gemini API key valid

---

## 🔄 Continuous Deployment

### **Automatic Deploys:**

Render automatically deploys when you push to your main branch.

**Workflow:**
1. Make changes locally
2. Test locally (`npm run dev`)
3. Build SDK (`npm run build:sdk`)
4. Commit and push to GitHub
5. Render auto-deploys both backend and frontend

---

## 🐛 Troubleshooting

### **SDK not loading:**
- Check browser console for errors
- Verify SDK URL is accessible: `https://your-frontend.onrender.com/sdk/vet-chatbot-sdk.umd.cjs`
- Ensure CORS is enabled on backend

### **CORS errors:**
- Verify backend `CORS` configuration allows the origin
- Check `FRONTEND_URL` environment variable

### **Widget not appearing:**
- Check browser console for JavaScript errors
- Verify `window.VetChatbotConfig.apiUrl` is correct
- Ensure backend is running

### **Styles not working:**
- SDK bundles all CSS - no external stylesheets needed
- Check if host page has conflicting global CSS (like `* { margin: 0 }`)

---

## 📈 Monitoring

### **Backend Logs:**
```bash
# View on Render dashboard
Logs → Backend Service
```

### **Frontend Logs:**
```bash
# View on Render dashboard
Logs → Frontend Service
```

---

## 🎨 Customization for Clients

Clients can customize the SDK by modifying `window.VetChatbotConfig`:

```javascript
window.VetChatbotConfig = {
    apiUrl: 'https://your-backend.onrender.com',
    userId: 'unique-user-id',
    userName: 'John Doe',
    petName: 'Buddy',
    source: 'clinic-website'
};
```

---

## 🔐 Security Best Practices

1. **API Keys:** Never expose API keys in frontend code
2. **CORS:** Restrict origins in production if not public SDK
3. **Rate Limiting:** Implement on backend to prevent abuse
4. **HTTPS:** Always use HTTPS in production
5. **Input Validation:** Backend validates all inputs

---

## 📚 Additional Resources

- [SDK Documentation](./SDK_README.md)
- [Render Documentation](https://render.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

## 🎉 Success!

Your AI Chat application with SDK is now deployed and ready for clients to integrate!

**Next Steps:**
1. Share SDK integration code with clients
2. Monitor usage and errors
3. Collect feedback for improvements
4. Scale as needed on Render

---

**Questions?** Check the troubleshooting section or review the logs on Render dashboard.
