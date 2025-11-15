# Prototype 2 - Completion Plan

**Current Date:** November 12, 2025  
**Status:** Database ✅ | Frontend 🔨 | Backend ✅ | Testing 🔨

---

## ✅ COMPLETED ITEMS

### Step 1 — Database (Supabase) ✅ DONE
- [x] Supabase project created ("Yadnyeya's Project")
- [x] Service role key and anon key stored in `.env`
- [x] `supabase/00_spec_schema.sql` created and executed (4 tables: student, interest, events, attend)
- [x] `supabase/00_spec_seed.sql` created and executed (4 students, 12 interests, 5 events, 3 attendance records)
- [x] `supabase/00_spec_policies.sql` created and executed (RLS policies + helper functions)
- [x] Tables verified in Supabase Table Editor

**Evidence:** Screenshot shows 4 students in the `student` table ✅

### Step 3 — Backend API (Partial) ✅ DONE
- [x] Express API server created (`api/server.js`)
- [x] Connected to Supabase with service role key
- [x] `api/openapi.yaml` - Complete OpenAPI 3.0 spec
- [x] `api/README.md` - Setup instructions
- [x] `tests/smoke.sh` - 7 tests (≥3 GET + ≥1 POST)
- [x] Smoke tests passing
- [x] Rate limiting and security headers configured

---

## 🔨 TODO - REMAINING WORK

### PRIORITY 1: Update API to Match New Schema (2-3 hours)

**Current Issue:** Our API uses the old schema (profiles, connections, messages tables) but Supabase now has the new schema (student, interest, events, attend tables).

#### Task 1.1: Update API Controllers
**File:** `api/controllers/eventsController.js`
- [ ] Update `getAllEvents()` to query `events` table instead of old schema
- [ ] Update `getEventById()` to use `event_id` field
- [ ] Update `createEvent()` to use new field names (date_and_time, student_id)
- [ ] Update `updateEvent()` to match new schema
- [ ] Update `deleteEvent()` to use event_id

**File:** `api/controllers/profilesController.js` → **RENAME to studentsController.js**
- [ ] Rename file to `studentsController.js`
- [ ] Update to query `student` table instead of `profiles`
- [ ] Update field names (student_id, is_verified, year)
- [ ] Update interests queries to use `interest` table

**Files to CREATE:**
- [ ] `api/controllers/attendController.js` - Handle attendance/check-ins
  - `createAttendance()` - Student checks into event
  - `getMyAttendance()` - Get my attendance history
  - `rateEvent()` - Submit rating and shared experience
  - `getEventAttendance()` - Get attendance for an event (host only)

**Files to DELETE:**
- [ ] `api/controllers/connectionsController.js` (not in new schema)
- [ ] `api/controllers/messagesController.js` (not in new schema)

#### Task 1.2: Update API Routes
**File:** `api/routes/events.js`
- [ ] Update route handlers to use new controller methods
- [ ] Update URL parameters (`:id` → `:event_id`)

**File:** `api/routes/profiles.js` → **RENAME to students.js**
- [ ] Rename to `students.js`
- [ ] Update paths (`/api/profiles` → `/api/students`)
- [ ] Update to use new studentsController

**File to CREATE:** `api/routes/attend.js`
- [ ] POST `/api/attend` - Check into event
- [ ] GET `/api/attend/my` - My attendance history
- [ ] PUT `/api/attend/:attend_id/rate` - Rate an event
- [ ] GET `/api/attend/event/:event_id` - Get event attendance

**Files to DELETE:**
- [ ] `api/routes/connections.js`
- [ ] `api/routes/messages.js`

#### Task 1.3: Update Server.js
**File:** `api/server.js`
- [ ] Remove old routes (connections, messages)
- [ ] Add new route: `app.use('/api/students', studentsRoutes)`
- [ ] Add new route: `app.use('/api/attend', attendRoutes)`
- [ ] Update CORS configuration if needed

**Estimated Time:** 2-3 hours

---

### PRIORITY 2: Step 2 — Client (Frontend) Screenshots (3-4 hours)

**Goal:** Create functional pages matching site map + take screenshots for PDF

#### Task 2.1: Complete Authentication Pages
- [ ] **LoginPage.jsx** - Email/password login form
  - Form with email and password inputs
  - Client-side validation (email format, password length)
  - "Login" button
  - "Forgot Password?" link
  - "Sign Up" link
  - Error message display area

- [ ] **SignupPage.jsx** - New user registration
  - Form with email, password, confirm password
  - Year selection dropdown (Freshman, Sophomore, Junior, Senior, Graduate)
  - Email validation
  - Password strength indicator
  - "Create Account" button
  - "Already have account?" link

- [ ] **ProfileSetupPage.jsx** - Post-signup profile completion
  - Interest selection (checkboxes or tags)
  - Bio textarea (character counter)
  - "Complete Setup" button
  - Progress indicator (Step 1 of 2, etc.)

**Estimated Time:** 1.5 hours

#### Task 2.2: Update Existing Pages with Mock Data
- [ ] **HomePage.jsx** - Update with proper navigation
  - Add "Welcome, [Name]" if logged in
  - Add "Login" button if not logged in
  - Update 4 cards to navigate correctly

- [ ] **EventsPage.jsx** - Add mock event data
  - Create array of 5-10 mock events
  - Display in grid with cards
  - Show filters (working with mock data)
  - Add "Create Event" button (navigates to form)

- [ ] **EventDetailPage.jsx** - Show mock event details
  - Display full event information
  - "Save Event" button
  - "Attend" button
  - "Check In" button (if attending)
  - "Rate Event" section (after check-in)

- [ ] **CreateEventPage.jsx** (NEW)
  - Form with all event fields:
    - Title (text input)
    - Description (textarea)
    - Event Type (dropdown: Event, Club Meeting, Fair)
    - Date and Time (datetime picker)
    - Location (text input)
  - Client-side validation
  - "Create Event" button
  - "Cancel" button

- [ ] **ProfilePage.jsx** - Update with mock data
  - Display student info (name, email, year)
  - Display interests as tags
  - Display bio
  - "Edit Profile" button
  - "My Events" section (events I created)
  - "My Attendance" section (events I attended)

- [ ] **ConnectPage.jsx** - Simplify (no messaging/matching in new schema)
  - Show "Find Students" section
  - Browse students by interest
  - Search students functionality

- [ ] **MatchesPage.jsx** - Rename to StudentsPage.jsx
  - List of students with similar interests
  - Filter by year, interests
  - Click to view profile

- [ ] **MessagesPage.jsx** - DELETE (not in new schema)

- [ ] **ShareExperiencePage.jsx** - Update to Attendance Rating
  - List of events I've attended
  - Click event to rate
  - Rating form with smiley faces
  - Shared experience textarea
  - "Submit Rating" button

**Estimated Time:** 2 hours

#### Task 2.3: Update App.jsx with Routing
**File:** `client/src/App.jsx`
- [ ] Import React Router components
- [ ] Set up routes for all pages:
  ```jsx
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/profile-setup" element={<ProfileSetupPage />} />
    <Route path="/events" element={<EventsPage />} />
    <Route path="/events/:id" element={<EventDetailPage />} />
    <Route path="/events/create" element={<CreateEventPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/students" element={<StudentsPage />} />
    <Route path="/attend" element={<AttendancePage />} />
  </Routes>
  ```
- [ ] Add navigation bar component
- [ ] Add protected route wrapper for authenticated pages

**Estimated Time:** 30 minutes

#### Task 2.4: Take Screenshots for PDF
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to each page and take screenshot
- [ ] Create PDF with screenshots in order:
  1. Home Page
  2. Login Page
  3. Signup Page
  4. Profile Setup Page
  5. Events List Page
  6. Event Detail Page
  7. Create Event Page
  8. Profile Page
  9. Students Page
  10. Attendance/Rating Page
- [ ] Label each screenshot with page name
- [ ] Save as `docs/P2_Screenshots.pdf`

**Estimated Time:** 30 minutes

---

### PRIORITY 3: Update Frontend Services (1 hour)

#### Task 3.1: Update API Service Files
**File:** `client/src/services/eventsApi.js`
- [ ] Update endpoints to match new API routes
- [ ] Update field names in requests/responses
- [ ] Update event creation to use `date_and_time` field

**File:** `client/src/services/profilesApi.js` → **RENAME to studentsApi.js**
- [ ] Rename to `studentsApi.js`
- [ ] Update endpoints (`/api/profiles` → `/api/students`)
- [ ] Update field names (profile_id → student_id)

**File to CREATE:** `client/src/services/attendApi.js`
- [ ] `checkInToEvent(eventId)` - Check into event
- [ ] `getMyAttendance()` - Get attendance history
- [ ] `rateEvent(attendId, rating, experience)` - Submit rating
- [ ] `getEventAttendance(eventId)` - Get event attendance list

**Files to DELETE:**
- [ ] `client/src/services/connectionsApi.js`
- [ ] `client/src/services/messagesApi.js`

**Estimated Time:** 1 hour

---

### PRIORITY 4: Wire Frontend to Backend API (1 hour)

#### Task 4.1: Update Pages to Use Real API
Once API is updated, replace mock data with API calls:

- [ ] **EventsPage.jsx**
  - Import `getAllEvents` from `eventsApi`
  - Call API in `useEffect`
  - Handle loading state
  - Handle error state

- [ ] **EventDetailPage.jsx**
  - Import `getEventById` from `eventsApi`
  - Load event data from API
  - Handle save/unsave with API

- [ ] **CreateEventPage.jsx**
  - Import `createEvent` from `eventsApi`
  - Submit form to API
  - Handle success/error
  - Redirect on success

- [ ] **ProfilePage.jsx**
  - Import `getMyProfile` from `studentsApi`
  - Load student data from API
  - Load attendance history

**Estimated Time:** 1 hour

---

### PRIORITY 5: Update Smoke Tests (30 minutes)

#### Task 5.1: Update smoke.sh
**File:** `tests/smoke.sh`
- [ ] Update test URLs to match new schema:
  - `GET /api/students` (instead of /api/profiles)
  - `GET /api/events`
  - `GET /api/events/:event_id`
  - `POST /api/events` (create event)
  - `GET /api/attend/my` (my attendance)
- [ ] Update expected response fields
- [ ] Update test assertions
- [ ] Run and verify all tests pass

**Estimated Time:** 30 minutes

---

### PRIORITY 6: Add Instructor as Supabase Admin (5 minutes)

#### Task 6.1: Invite Instructor
- [ ] Go to Supabase Dashboard
- [ ] Click on your project
- [ ] Go to "Settings" → "Team"
- [ ] Click "Invite Member"
- [ ] Enter instructor's email
- [ ] Set role to "Owner" or "Administrator"
- [ ] Send invite

**Estimated Time:** 5 minutes

---

### PRIORITY 7: Update OpenAPI Spec (30 minutes)

#### Task 7.1: Update openapi.yaml
**File:** `api/openapi.yaml`
- [ ] Update paths to match new routes
- [ ] Remove old routes (connections, messages)
- [ ] Add new routes (attend endpoints)
- [ ] Update schemas to match new database
- [ ] Update examples with correct field names
- [ ] Update student schema (was profiles)

**Estimated Time:** 30 minutes

---

### PRIORITY 8: Update Documentation (20 minutes)

#### Task 8.1: Update api/README.md
**File:** `api/README.md`
- [ ] Update endpoint documentation
- [ ] Update example requests/responses
- [ ] Update environment variables section
- [ ] Add troubleshooting section

#### Task 8.2: Create P2_SUBMISSION.md
**File:** `docs/P2_SUBMISSION.md`
- [ ] Checklist of completed items
- [ ] Links to key files
- [ ] Instructions to run locally
- [ ] Known limitations
- [ ] Screenshots location

**Estimated Time:** 20 minutes

---

## 📋 FINAL CHECKLIST (Before Submission)

### Step 1 — Database ✅
- [x] Instructor added as Supabase Admin
- [x] `supabase/00_spec_schema.sql` runs cleanly
- [x] `supabase/00_spec_seed.sql` runs cleanly
- [x] Tables verified in Supabase

### Step 2 — Client (Frontend)
- [ ] Every site-map page exists and has screenshot
- [ ] PDF created with all screenshots labeled
- [ ] Navigation works between all pages
- [ ] Forms have client-side validation
- [ ] Mock data displays properly (before wiring to API)

### Step 3 — Backend API
- [ ] API runs locally without errors
- [ ] Client uses API only (no direct Supabase calls)
- [ ] At least 3 GET endpoints working
- [ ] At least 1 POST endpoint working
- [ ] `api/openapi.yaml` accurate and complete
- [ ] `api/README.md` has clear instructions
- [ ] `tests/smoke.sh` runs successfully

### Final Steps
- [ ] All code pushed to GitHub
- [ ] Screenshots PDF attached to Trello card
- [ ] Move Trello card to "Review"
- [ ] Test that instructor can clone and run

---

## 🎯 EXECUTION ORDER (Recommended)

**Day 1 (3-4 hours):**
1. ✅ Add instructor as Supabase admin (5 min)
2. Update API controllers to match new schema (2 hours)
3. Update API routes (30 min)
4. Update server.js (15 min)
5. Test API with Postman/curl (30 min)

**Day 2 (3-4 hours):**
6. Create authentication pages (1.5 hours)
7. Update existing pages with mock data (2 hours)
8. Update App.jsx routing (30 min)

**Day 3 (2-3 hours):**
9. Take screenshots and create PDF (30 min)
10. Update frontend services (1 hour)
11. Wire pages to API (1 hour)
12. Update smoke tests (30 min)

**Day 4 (1 hour):**
13. Update OpenAPI spec (30 min)
14. Update documentation (20 min)
15. Final testing and verification (10 min)
16. Push to GitHub and submit (5 min)

---

## 📊 TOTAL TIME ESTIMATE

| Task | Time |
|------|------|
| Update API Backend | 2-3 hours |
| Create Frontend Pages | 3-4 hours |
| Take Screenshots + PDF | 30 min |
| Update Services | 1 hour |
| Wire to API | 1 hour |
| Update Tests | 30 min |
| Update Docs | 50 min |
| **TOTAL** | **8-10 hours** |

---

## 🚀 QUICK START (What to do RIGHT NOW)

**Option A - Start with Backend (Recommended):**
```bash
cd api
# Start updating controllers to match new schema
# Test each endpoint as you go
npm start
```

**Option B - Start with Frontend:**
```bash
cd ..
# Create authentication pages first
# Use mock data initially
npm run dev
```

**My Recommendation:** Start with Option A (Backend) because once the API matches the database, everything else will fall into place quickly.

---

**Questions? Need help with any specific task? Let me know and I'll dive in!**
