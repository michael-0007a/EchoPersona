# Deployment Guide: Frontend (Vercel) + Backend (Render)

## Overview
- **Frontend**: Deployed on Vercel (Next.js app)
- **Backend**: Deployed on Render (FastAPI Python app)
- **Connection**: Frontend communicates with backend via API calls

---

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to https://render.com/
2. Sign up/login with GitHub

### 1.2 Deploy Backend
1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository `EchoPersona`
4. Configure the service:
   - **Name**: echopersona-backend
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 1.3 Configure Backend
1. In Render dashboard, go to Environment
2. Add environment variable:
   - Key: `PYTHON_VERSION`
   - Value: `3.12.0` (Important: Python 3.13 breaks SpeechRecognition)
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyDJyXuRJ1XS7gFJ4iCOWBR02WhPSlPDVmI`
3. Click "Save Changes"
4. Render will auto-deploy

### 1.4 Get Backend URL
1. Once deployed, Render will provide a URL like:
   - `https://echopersona-backend.onrender.com`
2. **Copy this URL** - you'll need it for frontend setup

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com/
2. Sign up/login with GitHub

### 2.2 Import Project
1. Click "Add New Project"
2. Select your `EchoPersona` repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.3 Configure Environment Variables
1. In Vercel project settings, add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://echopersona-backend.onrender.com` (from Step 1.4)
2. Click "Deploy"

---

## Step 3: Update Backend CORS Settings

After deploying frontend, you'll get a Vercel URL like:
- `https://echo-persona.vercel.app`

### 3.1 Update CORS in backend/main.py
Replace the CORS allowed origins with your actual Vercel URL:
```python
allow_origins=[
    "http://localhost:3000",  # Keep for local dev
    "https://your-frontend.vercel.app",  # Your actual Vercel URL
],
```

### 3.2 Commit and Push
```bash
git add backend/main.py
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy with the new CORS settings.

---

## Step 4: Verify Connection

1. Visit your Vercel frontend URL
2. Open browser DevTools (F12) → Network tab
3. Try to interact with the app
4. Check that API calls are going to your Render backend URL
5. Verify responses are successful (status 200)

---

## Troubleshooting

### Python Version Issues (Important!)
**Error**: `ModuleNotFoundError: No module named 'aifc'`
- **Cause**: Python 3.13 removed the `aifc` module that SpeechRecognition depends on
- **Solution**: Set `PYTHON_VERSION=3.12.0` in Render environment variables
- The `runtime.txt` and `.python-version` files in the repo will also enforce Python 3.12

### CORS Errors
If you see CORS errors in browser console:
1. Make sure backend CORS includes your exact Vercel URL
2. Check Render logs to see if requests are reaching backend
3. Ensure `allow_credentials=True` is set in CORS middleware

### Module Not Found Errors (Frontend)
- Make sure `frontend` is set as Root Directory in Vercel settings
- Verify `tsconfig.json` has proper path aliases

### Backend Not Starting (Render)
- Check Render logs for errors
- Verify all dependencies in `requirements.txt` are installable
- Ensure `GEMINI_API_KEY` is set in Render environment variables
- Verify Python version is set to 3.12.0 (not 3.13)

### API Calls Failing
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check that Render backend is running (check Render dashboard)
- Ensure Render backend has public access enabled

---

## Local Development

### Frontend (runs on localhost:3000)
```bash
cd frontend
npm install
npm run dev
```

### Backend (runs on localhost:8000)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Setup
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Cost
- **Render**: Free tier includes 750 hours/month (backend)
- **Vercel**: Free tier includes unlimited deployments (frontend)

Both are free for hobby/personal projects! 🎉

---

## Important Notes

1. **Python 3.12 Required**: Do NOT use Python 3.13 - it breaks the SpeechRecognition library
2. **Render Free Tier**: Backend may sleep after 15 minutes of inactivity (first request will be slow)
3. **Environment Variables**: Make sure to set them in both Render and Vercel dashboards
