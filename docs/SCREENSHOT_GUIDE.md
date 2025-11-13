# Screenshot Guide for Prototype 2

## Prerequisites
- Frontend runs on: http://localhost:5173 (Vite default)
- Backend runs on: http://localhost:3001
- Mock data is built into frontend, so pages work even without backend

## Taking Screenshots

### Option 1: With Mock Data (Recommended for consistent screenshots)
Just run the frontend, mock data will display automatically:
```bash
npm run dev
```

### Option 2: With Real Backend
```bash
# Terminal 1 - Backend
cd api
npm start

# Terminal 2 - Frontend
npm run dev
```

## Pages to Screenshot (in order)

### 1. Login Page
**URL**: http://localhost:5173/login
**What to show**:
- Login form with email/password fields
- Demo credentials displayed
- "Sign Up" link at bottom

**Tips**: 
- Make sure the gradient background is visible
- Show the EventBuddy logo/branding

---

### 2. Signup Page
**URL**: http://localhost:5173/signup
**What to show**:
- Signup form with email, password, confirm password
- University email requirement (.edu)
- "Already have an account?" link

**Tips**:
- You can fill out the form but don't submit (unless you want to test the flow)
- OR submit and capture the success screen with countdown

---

### 3. Profile Setup - Step 1
**URL**: http://localhost:5173/profile-setup
**What to show**:
- Progress bar (Step 1 of 3)
- Year selection cards (Freshman, Sophomore, Junior, Senior, Graduate)
- "Continue" button

**Tips**:
- Select one year to show the selected state
- Make sure progress indicator is visible

---

### 4. Profile Setup - Step 2
**URL**: Same page after clicking Continue
**What to show**:
- Progress bar (Step 2 of 3)
- Interest selection with multiple categories
- Selected interests as blue tags
- Custom interest input field
- "Back" and "Continue" buttons

**Tips**:
- Select 5-8 interests to show variety
- Maybe add 1 custom interest
- Show the visual feedback of selected interests

---

### 5. Profile Setup - Step 3
**URL**: Same page after clicking Continue
**What to show**:
- Progress bar (Step 3 of 3 - complete)
- Review section with selected year
- All selected interests displayed
- "Submit Profile" button

---

### 6. Home Page (Dashboard)
**URL**: http://localhost:5173/ or http://localhost:5173
**What to show**:
- Navigation bar at top (Home, Events, Profile, Share, Sign Out)
- Welcome message with user email
- "Upcoming Events" section with 3 event cards
- "Your Recent Attendance" section with rated events
- Quick action cards
- Feature highlights

**Tips**:
- This is the main landing page after login
- Make sure all sections are visible (may need to capture full page or scroll)
- Mock data will show 3 sample events and 2 attendance records

---

### 7. Events Browse Page
**URL**: http://localhost:5173/events
**What to show**:
- Navigation bar
- "Discover Events" heading
- Event type filter dropdown
- Event cards with:
  - Event type badge (Event/Club Meeting/Fair)
  - Title, description
  - Date, time, location
  - Attendance count
  - Host info

**Tips**:
- Shows 3 mock events: Study Group, Campus Fair, Photography Walk
- You can show filtering by selecting an event type
- Or show all events with the filter set to "All Types"

---

### 8. Event Detail Page
**URL**: http://localhost:5173/events/1 (or any number)
**What to show**:
- Navigation bar
- Event type badge and rating at top
- Complete event details in grid layout
- Green check-in section with button
- Student reviews section (if available)

**Tips**:
- Mock data will load a sample event
- Show the check-in section prominently
- If you've checked in, show the "Checked In" state
- Make sure ratings section is visible

---

### 9. Profile Page
**URL**: http://localhost:5173/profile
**What to show**:
- Navigation bar
- Basic information section (email, year)
- My interests section with tags and add/remove
- Attendance history with rated events

**Tips**:
- Shows mock interests: Photography, Hiking, Technology
- Shows 2 mock attendance records with ratings
- You can demonstrate adding a new interest
- Edit button functionality is visible

---

### 10. Share Experience Page
**URL**: http://localhost:5173/share
**What to show**:
- Navigation bar
- "Rate Your Event Experience" form
- Event selection dropdown
- 5-star rating system
- Written feedback textarea
- Rating tips section at bottom

**Tips**:
- Mock data shows 2 unrated events to select
- You can show selecting a rating (stars light up)
- Shows the helpful placeholder text
- Rating tips provide context

---

## Screenshot Best Practices

1. **Window Size**: Use a consistent browser window size (recommend 1920x1080 or 1440x900)

2. **Clean Browser**: 
   - Hide bookmarks bar
   - Close unnecessary tabs
   - Use incognito/private mode for clean UI

3. **Full Page**: 
   - For pages with scrolling content, consider:
     - Full-page screenshot tool
     - OR multiple screenshots showing different sections
     - OR scroll to show all content in one view

4. **Highlight Features**:
   - Make sure interactive elements are visible
   - Show form validation states if relevant
   - Demonstrate filters, buttons, and cards

5. **Data Visibility**:
   - Mock data ensures consistent screenshots
   - All key features should be visible
   - Use realistic-looking content

## Creating the PDF

### Suggested Page Order in PDF:
1. **Title Page**: "EventBuddy - Prototype 2 Frontend"
2. **Login Page**
3. **Signup Page**
4. **Profile Setup (3 steps)** - Can be 3 separate pages or combined
5. **Home Page**
6. **Events Browse Page**
7. **Event Detail Page**
8. **Profile Page**
9. **Share Experience Page**
10. **Summary/Notes Page** (optional)

### Tools for Creating PDF:
- **Mac**: Preview (File > Print > Save as PDF)
- **Windows**: Print to PDF feature
- **Online**: Smallpdf, Adobe Acrobat
- **Command line**: ImageMagick, wkhtmltopdf

### Adding Labels:
Each page in the PDF should have a caption like:
- "Figure 1: Login Page"
- "Figure 2: User Registration"
- "Figure 3: Profile Setup - Step 1: Year Selection"
- etc.

## Quick Test Flow

If you want to test the actual functionality:

1. Go to `/signup` - Create account with .edu email
2. Complete `/profile-setup` - Select year and interests
3. Land on `/` - See personalized home page
4. Go to `/events` - Browse events with filters
5. Click an event - View details and check in
6. Go to `/share` - Rate the event you checked in to
7. Go to `/profile` - See your attendance history

## Notes

- **Mock Data**: All pages work with mock data, so backend is optional for screenshots
- **Authentication**: For screenshots, you can use the demo login credentials shown on login page
- **Consistent Branding**: Blue and purple gradient theme throughout
- **Responsive**: Pages work on mobile too, but screenshots should be desktop view
- **Navigation**: Navigation bar is present on all authenticated pages

## Troubleshooting

**Issue**: Page shows loading forever
- **Fix**: Mock data should load automatically. Check browser console for errors.

**Issue**: Can't access protected pages
- **Fix**: Go to `/login` first, then navigate to other pages.

**Issue**: No data showing
- **Fix**: Mock data is hardcoded in each page. Make sure you're using the latest code.

**Issue**: Styling looks wrong
- **Fix**: Make sure Tailwind CSS is loaded. Run `npm run dev` to start Vite dev server.

## Final Checklist

Before submitting:
- ✅ All 8-10 pages captured
- ✅ Screenshots are clear and high resolution
- ✅ All key features are visible
- ✅ Consistent window size across screenshots
- ✅ Each screenshot is labeled in PDF
- ✅ PDF is organized in logical page flow
- ✅ File size is reasonable (compress if needed)
- ✅ PDF includes title page with your name and project info
