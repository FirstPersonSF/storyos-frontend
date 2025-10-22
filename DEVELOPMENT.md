# Development Setup Guide

## Quick Start

### Local Development (Testing Backend Changes)

```bash
# 1. Set frontend to use local backend
echo "VITE_API_URL=http://localhost:8000" > .env

# 2. Start frontend dev server
npm run dev

# 3. Hard refresh browser (Cmd+Shift+R)
```

**Important:** The frontend dev server reads `.env` at startup. If you change `.env`, you MUST restart the dev server.

### Production Mode (Using Railway Backend)

```bash
# 1. Set frontend to use Railway
echo "VITE_API_URL=https://web-production-9c58.up.railway.app" > .env

# 2. Restart frontend dev server (or deploy to Vercel)
npm run dev
```

---

## Environment Configuration

### The `.env` File

The frontend determines which backend to use via the `VITE_API_URL` environment variable:

**File:** `.env`
```bash
# Local development (use this when testing backend changes locally)
VITE_API_URL=http://localhost:8000

# OR

# Production (use this when deploying to Vercel or testing production)
VITE_API_URL=https://web-production-9c58.up.railway.app
```

**How it works:**
```javascript
// src/api/client.js
const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-9c58.up.railway.app';
```

- If `VITE_API_URL` is set in `.env` → uses that URL
- If `VITE_API_URL` is not set → defaults to Railway production

---

## ⚠️ Common Mistakes

### Mistake #1: Testing Local Backend Changes, But `.env` Points to Railway

**Symptoms:**
- You fixed a bug in the backend code
- Backend test scripts show the fix working
- Browser still shows the old bug
- No requests appear in local backend logs

**Why:** Your browser is hitting Railway production, not localhost:8000

**Solution:**
```bash
# Check what .env is set to
cat .env

# If it shows Railway URL, change it:
echo "VITE_API_URL=http://localhost:8000" > .env

# MUST restart dev server for change to take effect
# Ctrl+C to stop, then:
npm run dev

# Hard refresh browser: Cmd+Shift+R
```

### Mistake #2: Changing `.env` But Not Restarting Dev Server

**Symptoms:**
- You updated `.env` to localhost
- Browser still hits Railway

**Why:** Vite loads environment variables at startup, not dynamically

**Solution:**
```bash
# Always restart after changing .env
# Press Ctrl+C to stop the dev server
# Then restart:
npm run dev
```

### Mistake #3: Forgetting to Hard Refresh Browser

**Symptoms:**
- Backend updated
- `.env` correctly set to localhost
- Dev server restarted
- Still seeing old behavior

**Why:** Browser cached the old JavaScript bundle

**Solution:**
```bash
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
# Or open in Incognito/Private mode
```

---

## Full Local Development Workflow

### Initial Setup (First Time)

```bash
# 1. Clone repository
git clone https://github.com/FirstPersonSF/storyos-frontend.git
cd storyos-frontend

# 2. Install dependencies
npm install

# 3. Configure for local development
echo "VITE_API_URL=http://localhost:8000" > .env

# 4. Start dev server
npm run dev
```

### Daily Development Workflow

**Starting your day:**

```bash
# 1. Pull latest changes
git pull

# 2. Verify .env is set for local development
cat .env
# Should show: VITE_API_URL=http://localhost:8000

# 3. Start frontend
npm run dev

# 4. Start backend (in separate terminal)
cd /Users/drewf/Desktop/Python/storyos_protoype
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 5. Open browser to http://localhost:5173
```

**Testing changes:**

```bash
# After making frontend changes:
# - Changes auto-reload via Vite HMR (no restart needed)

# After making backend changes:
# - Backend auto-reloads via uvicorn --reload
# - BUT if changes don't appear, see backend TROUBLESHOOTING.md

# After changing .env:
# - MUST restart frontend dev server (Ctrl+C, then npm run dev)

# After either change:
# - Hard refresh browser (Cmd+Shift+R)
```

---

## Deployment Workflow

### Deploying to Vercel

```bash
# 1. Ensure .env points to Railway for production
echo "VITE_API_URL=https://web-production-9c58.up.railway.app" > .env

# 2. Commit changes
git add .
git commit -m "Your commit message"

# 3. Push to GitHub (triggers Vercel deployment)
git push origin master

# 4. Vercel auto-deploys (takes ~30 seconds)
# Check status: vercel ls
```

**Note:** Vercel doesn't use the `.env` file. It uses:
- `VITE_API_URL` environment variable set in Vercel dashboard (if configured)
- OR the default fallback in `src/api/client.js` (Railway URL)

Currently, we don't have `VITE_API_URL` set in Vercel, so it uses the default Railway URL.

---

## Quick Reference Commands

### Check Current Configuration
```bash
# What backend is the frontend using?
cat .env

# Is the dev server running?
lsof -i:5173

# What's the latest Vercel deployment?
vercel ls
```

### Switch Backends
```bash
# Switch to local backend
echo "VITE_API_URL=http://localhost:8000" > .env
# Restart dev server

# Switch to Railway backend
echo "VITE_API_URL=https://web-production-9c58.up.railway.app" > .env
# Restart dev server
```

### Troubleshooting
```bash
# Frontend not loading?
npm run dev

# Changes not appearing?
# Hard refresh: Cmd+Shift+R

# No requests in backend logs?
cat .env  # Check if pointing to localhost

# Getting CORS errors?
# Backend might not be running on localhost:8000
```

---

## Project Structure

```
storyos-frontend/
├── .env                    # Environment configuration (gitignored)
├── .vercel/                # Vercel deployment config
├── src/
│   ├── api/
│   │   └── client.js       # API client (reads VITE_API_URL)
│   ├── components/         # React components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   └── App.jsx             # Main app component
├── vercel.json             # Vercel configuration
└── package.json            # Dependencies and scripts
```

---

## Incident Log

### October 21, 2025 - Frontend Pointing to Wrong Backend

**Time Lost:** 1+ hours

**Issue:** Backend changes not appearing in browser despite being verified in code

**Root Cause:** `.env` was set to `https://web-production-9c58.up.railway.app` instead of `http://localhost:8000`

**Why It Was Confusing:**
- Backend code had the fix
- Backend test scripts showed fix working
- But browser showed old buggy behavior
- No requests appeared in local server logs

**Resolution:**
1. Changed `.env` to `http://localhost:8000`
2. Restarted frontend dev server
3. Hard refreshed browser
4. Fix immediately worked

**Lesson Learned:**
**ALWAYS check `.env` before debugging backend changes!**

```bash
# Make this your first debugging step:
cat .env
```

**Prevention:**
- Created this DEVELOPMENT.md guide
- Added quick reference section
- Documented the exact mistake and solution
