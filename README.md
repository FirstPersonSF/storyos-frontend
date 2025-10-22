# StoryOS Frontend

React frontend for StoryOS - Content management system for enterprise storytelling.

## Features
- UNF Elements View - Browse reusable content
- Deliverables View - Check for impact alerts
- Interactive Phase 2 Demo - Test deliverable creation and management
- Real-time version tracking
- Clean Tailwind UI

## Quick Start

### Local Development (Testing Backend Changes)

```bash
# 1. Install dependencies
npm install

# 2. Configure to use local backend
echo "VITE_API_URL=http://localhost:8000" > .env

# 3. Start dev server
npm run dev

# 4. Make sure backend is running on localhost:8000
```

### Production Mode

```bash
# 1. Configure to use Railway backend
echo "VITE_API_URL=https://web-production-9c58.up.railway.app" > .env

# 2. Start dev server (or deploy to Vercel)
npm run dev
```

## ⚠️ Important: Environment Configuration

The frontend uses `.env` to determine which backend to connect to:

```bash
# Local development
VITE_API_URL=http://localhost:8000

# Production (Railway)
VITE_API_URL=https://web-production-9c58.up.railway.app
```

**Critical:** After changing `.env`, you MUST restart the dev server (Ctrl+C, then `npm run dev`)

### Common Mistake

If you're testing backend changes locally but the browser shows old behavior:
1. Check `.env` - it might be pointing to Railway instead of localhost
2. Restart the dev server after changing `.env`
3. Hard refresh the browser (Cmd+Shift+R)

**👉 See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup and troubleshooting**

## Deployment

Deployed to Vercel with automatic GitHub integration.

**Production API:** https://web-production-9c58.up.railway.app

## Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Detailed development setup, workflow, and troubleshooting
- **[DEMO_MOCKUP.md](./DEMO_MOCKUP.md)** - Demo page UI/UX specifications
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Architecture and implementation details
