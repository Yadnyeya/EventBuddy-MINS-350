# Prototype 2 Setup Guide

Complete guide for setting up and running EventBuddy Prototype 2.

## Overview

Prototype 2 adds the backend database and API layer to EventBuddy, enabling full CRUD operations for events, profiles, connections, and messaging.

**What's Included:**
- ✅ Complete PostgreSQL database schema (11 tables)
- ✅ Row Level Security policies for data protection
- ✅ Express.js API server with 40+ endpoints
- ✅ Supabase integration for auth and database
- ✅ Smart buddy matching algorithm
- ✅ Event management system
- ✅ Safety features (block/report)
- ✅ Smoke tests for API verification

## Prerequisites

Before starting, ensure you have:

- [x] Node.js 18+ installed
- [x] npm or yarn package manager
- [x] Supabase account (free tier works)
- [x] Git for version control
- [x] Code editor (VS Code recommended)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `eventbuddy` (or your choice)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose closest to you
   - **Plan**: Free tier is fine for development
4. Wait 2-3 minutes for project provisioning

### 1.2 Get API Credentials

1. Go to **Project Settings** (gear icon) > **API**
2. Copy these values for later:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (⚠️ Keep secret!)

### 1.3 Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Run each migration in order:

**Migration 1: Schema (01_schema.sql)**
```sql
-- Copy entire contents of db/01_schema.sql
-- Paste into SQL Editor
-- Click "Run"
```
✅ Creates: profiles, events, connections, messages, and 7 other tables

**Migration 2: Seed Data (02_seed.sql) - OPTIONAL**
```sql
-- Copy entire contents of db/02_seed.sql
-- Replace all UUID placeholders with real UUIDs from Supabase Auth
-- Paste into SQL Editor
-- Click "Run"
```
✅ Creates: Sample interests and test data

**Migration 3: Security Policies (03_policies.sql)**
```sql
-- Copy entire contents of db/03_policies.sql
-- Paste into SQL Editor
-- Click "Run"
```
✅ Creates: Row Level Security policies for all tables

### 1.4 Verify Database Setup

In Supabase, go to **Table Editor** and verify these tables exist:
- profiles
- interests
- profile_interests
- events
- event_saves
- event_ratings
- connections
- messages
- blocks
- reports

## Step 2: Environment Configuration

### 2.1 Create .env File

In the **project root**, copy the example file:

```bash
cp .env.example .env
```

### 2.2 Configure Environment Variables

Open `.env` and fill in your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_from_step_1.2
SUPABASE_SERVICE_KEY=your_service_role_key_from_step_1.2

# Application URLs
VITE_APP_URL=http://localhost:5173
API_PORT=3001
```

⚠️ **NEVER commit .env to Git!** It's already in `.gitignore`.

## Step 3: Install Dependencies

### 3.1 Install Frontend Dependencies

```bash
# From project root
npm install
```

This installs:
- React, Vite, Tailwind CSS
- Supabase client library
- React Router

### 3.2 Install API Dependencies

```bash
# From project root
cd api
npm install
cd ..
```

This installs:
- Express.js server
- CORS, Helmet (security)
- Rate limiting
- Supabase client for backend

## Step 4: Run the Application

### 4.1 Start API Server (Terminal 1)

```bash
cd api
npm run dev
```

Expected output:
```
🚀 EventBuddy API Server running on port 3001
📍 Health check: http://localhost:3001/health
📡 API endpoints: http://localhost:3001/api/
🔐 Connected to Supabase: ✅
```

**Troubleshooting:**
- ❌ "Missing Supabase credentials" → Check `.env` file
- ❌ "Port 3001 already in use" → Change `API_PORT` in `.env`

### 4.2 Start Frontend (Terminal 2)

```bash
# From project root (open new terminal)
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4.3 Verify Everything Works

1. **Frontend**: Open http://localhost:5173
2. **API Health**: Open http://localhost:3001/health
3. **API Events**: Open http://localhost:3001/api/events

## Step 5: Run Tests

### 5.1 Make Smoke Tests Executable

```bash
chmod +x tests/smoke.sh
```

### 5.2 Run Smoke Tests

```bash
# Make sure API server is running first!
cd tests
./smoke.sh
```

Expected output:
```
========================================
EventBuddy API Smoke Tests
========================================
API URL: http://localhost:3001

Testing: Health Check
✓ PASSED

Testing: Get All Events (Public)
✓ PASSED

...

========================================
Test Summary
========================================
Passed: 7
Failed: 0
Total:  7

All tests passed! ✓
```

## Step 6: Create Your First User

### 6.1 Sign Up via Frontend

1. Go to http://localhost:5173
2. Click "Sign Up" (you'll need to create this page or use Supabase UI)
3. Enter email and password
4. Check email for verification link
5. Click link to verify

### 6.2 Create Profile via API

Once authenticated, you can test the API:

```bash
# Get your JWT token from Supabase (in browser dev tools)
# Then test profile creation:

curl -X POST http://localhost:3001/api/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "testuser",
    "full_name": "Test User",
    "bio": "I love events!",
    "personality_type": "introvert",
    "major": "Computer Science"
  }'
```

## API Endpoints Reference

See full documentation in `api/README.md`

### Quick Reference

**Public Endpoints:**
- `GET /api/events` - Browse events
- `GET /api/profiles` - Search profiles
- `GET /health` - Server status

**Protected Endpoints (require auth):**
- `POST /api/events` - Create event
- `POST /api/connections` - Send buddy request
- `POST /api/messages` - Send message
- `GET /api/connections/matches/suggestions` - Get match suggestions

## Database Schema Reference

### Core Tables

**profiles** - User profiles with bio, interests, personality type
```sql
id (UUID, PK), username, full_name, bio, avatar_url, 
personality_type, major, university, graduation_year
```

**events** - Student events (study groups, social events)
```sql
id (UUID, PK), host_id (FK), title, description, event_type,
event_date, location, capacity, status
```

**connections** - Buddy matching relationships
```sql
id (UUID, PK), requester_id (FK), receiver_id (FK),
status (pending/accepted/rejected)
```

**messages** - Direct messaging between connected users
```sql
id (UUID, PK), sender_id (FK), receiver_id (FK),
content, is_read
```

### Safety Tables

**blocks** - User blocking for safety
**reports** - Report abusive users/content

Full schema: `supabase/01_schema.sql`

## Project Structure

```
Event Buddy App/
├── api/
│   ├── server.js              # Express server
│   ├── package.json           # API dependencies
│   ├── README.md              # API documentation
│   ├── config/
│   │   └── supabase.js        # Supabase client
│   ├── routes/
│   │   ├── events.js          # Event endpoints
│   │   ├── profiles.js        # Profile endpoints
│   │   ├── connections.js     # Connection endpoints
│   │   └── messages.js        # Message endpoints
│   └── controllers/
│       ├── eventsController.js
│       ├── profilesController.js
│       ├── connectionsController.js
│       └── messagesController.js
├── db/
│   ├── 01_schema.sql          # Database schema
│   ├── 02_seed.sql            # Seed data
│   └── 03_policies.sql        # RLS policies
├── src/
│   ├── App.jsx                # React app entry
│   ├── pages/                 # Page components (to be built)
│   ├── components/            # Reusable components
│   └── services/              # API service layer
├── tests/
│   └── smoke.sh               # API smoke tests
├── .env                       # Environment variables (not committed)
├── .env.example               # Environment template
└── package.json               # Frontend dependencies
```

## Common Issues & Solutions

### Issue: "Cannot connect to Supabase"
**Solution:**
1. Verify `.env` has correct URL and keys
2. Check Supabase project is active (not paused)
3. Verify network connection

### Issue: "401 Unauthorized" on protected routes
**Solution:**
1. Make sure you're sending `Authorization: Bearer <token>` header
2. Token may be expired - get fresh token from Supabase Auth
3. Verify token format is correct

### Issue: Database queries fail
**Solution:**
1. Check RLS policies are set up (`supabase/03_policies.sql`)
2. Verify user is authenticated
3. Check Supabase logs in dashboard: Logs > Database

### Issue: Tests fail
**Solution:**
1. Make sure API server is running on port 3001
2. Check API logs for errors
3. Verify database migrations completed successfully

### Issue: CORS errors
**Solution:**
1. Verify `VITE_APP_URL` in `.env` matches frontend URL
2. Check API server is running
3. Frontend must request from `http://localhost:5173`

## Development Workflow

### Daily Development

1. **Start servers:**
   ```bash
   # Terminal 1: API
   cd api && npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

2. **Make changes** to code

3. **Test manually** in browser

4. **Run smoke tests:**
   ```bash
   cd tests && ./smoke.sh
   ```

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

### Adding New Features

1. **Update database** (if needed):
   - Add table/column in SQL
   - Run in Supabase SQL Editor
   - Add RLS policies

2. **Create API endpoint:**
   - Add route in `api/routes/`
   - Add controller in `api/controllers/`
   - Test with cURL or Postman

3. **Update frontend:**
   - Create service in `client/src/services/`
   - Create page/component in `client/src/pages/` or `client/src/components/`
   - Connect to API

4. **Test end-to-end**

## Next Steps

After completing Prototype 2 setup:

1. ✅ **Test all API endpoints** with smoke tests
2. ✅ **Create frontend pages** (see `TASK_LIST.md`)
3. ✅ **Implement authentication UI**
4. ✅ **Build event browsing interface**
5. ✅ **Create profile setup flow**
6. ✅ **Implement buddy matching UI**
7. ✅ **Add messaging interface**
8. ✅ **Test complete user flows**

See `docs/TASK_LIST.md` for full task breakdown.

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **API Documentation**: `api/README.md`
- **Project Requirements**: `docs/PRD.md`
- **Task List**: `docs/TASK_LIST.md`

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review API logs in terminal
3. Check Supabase dashboard logs
4. Verify all migrations ran successfully
5. Test with smoke tests to isolate issue

---

**Prototype 2 Status**: ✅ Setup Complete
**Next Prototype**: Prototype 3 - AWS Deployment (see `TASK_LIST.md`)
