# 🚀 Quick Deployment Reference

## 📋 TL;DR - Deploy in 3 Steps

### 1️⃣ Update Render Build Command
```bash
npm install && npm run build:all
```

### 2️⃣ Push to GitHub
```bash
git add .
git commit -m "Add SDK deployment support"
git push origin main
```

### 3️⃣ Render Auto-Deploys ✨
- Backend: Auto-deploys from your backend repo
- Frontend: Auto-deploys with SDK included

---

## 🔗 Your Deployed URLs

After deployment, your URLs will be:

| Component | URL |
|-----------|-----|
| **Backend API** | `https://your-backend.onrender.com` |
| **Frontend App** | `https://your-frontend.onrender.com` |
| **SDK File** | `https://your-frontend.onrender.com/sdk/vet-chatbot-sdk.umd.cjs` |

---

## 📝 SDK Integration Code (For Clients)

Share this code with clinics who want to embed your chatbot:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Clinic</title>
</head>
<body>
    <!-- Your clinic website content -->
    <h1>Welcome to Our Clinic!</h1>
    
    <!-- Chatbot SDK Integration -->
    <script>
        window.VetChatbotConfig = {
            apiUrl: 'https://YOUR-BACKEND.onrender.com',
            userId: 'clinic-123',
            userName: 'Clinic User',
            source: 'clinic-website'
        };
    </script>
    <script src="https://YOUR-FRONTEND.onrender.com/sdk/vet-chatbot-sdk.umd.cjs"></script>
</body>
</html>
```

**Replace:**
- `YOUR-BACKEND.onrender.com` → Your actual backend URL
- `YOUR-FRONTEND.onrender.com` → Your actual frontend URL

---

## ✅ Pre-Deployment Checklist

- [ ] Backend environment variables set on Render
  - `MONGODB_URI`
  - `GEMINI_API_KEY`
  - `FRONTEND_URL`
  - `NODE_ENV=production`

- [ ] Frontend environment variables set on Render
  - `VITE_API_URL` (your backend URL)

- [ ] Build command updated to `npm run build:all`

- [ ] CORS enabled for all origins (already done)

---

## 🧪 Test After Deployment

### Test Backend:
```bash
curl https://your-backend.onrender.com/health
```
Should return: `{"status":"ok"}`

### Test Frontend:
Visit: `https://your-frontend.onrender.com`

### Test SDK:
1. Create `test.html` with integration code
2. Open in browser
3. Chat widget should appear in bottom-right

---

## 🎯 Current Build Process

When you run `npm run build:all`:

1. ✅ Builds main React app → `dist/`
2. ✅ Builds SDK → `dist-sdk/`
3. ✅ Copies SDK to `dist/sdk/` for deployment
4. ✅ Ready for Render to serve

---

## 📊 File Structure After Build

```
dist/
├── assets/           # Main app assets
├── sdk/              # SDK files (for clients)
│   └── vet-chatbot-sdk.umd.cjs
├── index.html        # Main app
├── favicon.ico
└── logo.png
```

---

## 🔄 Update Workflow

1. Make changes locally
2. Test: `npm run dev` (frontend) + `npm run dev` (backend)
3. Build SDK: `npm run build:sdk`
4. Commit: `git add . && git commit -m "Update"`
5. Push: `git push origin main`
6. ✨ Render auto-deploys

---

## 🐛 Common Issues

### SDK not loading?
- Check: `https://your-frontend.onrender.com/sdk/vet-chatbot-sdk.umd.cjs`
- Should download a 144KB JavaScript file

### CORS errors?
- Backend already allows all origins
- Check `apiUrl` in `VetChatbotConfig`

### Widget not appearing?
- Open browser console (F12)
- Look for JavaScript errors
- Verify `apiUrl` is correct

---

## 📞 Support

- **Deployment Guide:** `DEPLOYMENT.md`
- **SDK Documentation:** `SDK_README.md`
- **Render Logs:** Check dashboard for errors

---

**Ready to deploy? Just update the build command on Render and push to GitHub!** 🚀
