# EventBuddy

**A student networking platform for event discovery and connections**

EventBuddy helps students overcome social barriers by facilitating event discovery and connections with like-minded peers. Designed with introverts in mind, it provides a safe, inclusive space for students to find events, make friends, and build meaningful campus connections.

## Current Status: **Prototype 2 - Full Stack Complete** ✅

### What's Working:
- ✅ Full React frontend with authentication and event browsing
- ✅ Express API server with REST endpoints
- ✅ Supabase database with RLS policies
- ✅ Student profiles and event management
- ✅ Check-in/attendance tracking system
- ✅ Search and filter functionality
- ✅ Responsive design with Tailwind CSS
- ✅ API smoke tests passing

## Key Features

- **Event Discovery**: Browse campus events, club meetings, and fairs
- **Event Check-In**: Track attendance and share experiences
- **Student Search**: Find students by interests and year
- **Profile Management**: Create and customize student profiles  
- **Interest Matching**: Connect based on shared interests
- **Responsive Design**: Works on desktop and mobile

## Technology Stack

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for single-page application
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend & Database
- **Supabase**: PostgreSQL database with Row Level Security
  - User authentication with email/password
  - Database schema (student, events, interests, attend tables)
  - Real-time subscriptions
- **Express.js**: RESTful API server
  - JWT authentication middleware
  - CORS and security headers
  - Input validation and error handling
  - Smoke tests for endpoint verification

### Deployment
- **Local Development**: Vite dev server + Express API
- **Future (Prototype 3)**: AWS Amplify + Lambda

## Project Structure

```
EventBuddy/
├── api/                       # Backend API server
│   ├── server.js             # Express server
│   ├── config/               # Supabase configuration
│   ├── routes/               # API route definitions
│   ├── controllers/          # Business logic
│   └── package.json          # API dependencies
├── client/                   # Frontend React application
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   ├── index.html            # HTML entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
├── supabase/                 # Database migrations
│   ├── 00_spec_schema.sql    # Specification 2 schema
│   ├── 00_spec_seed.sql      # Specification 2 seed data
│   ├── 00_spec_policies.sql  # Specification 2 RLS policies
│   ├── 01_schema.sql         # Extended schema
│   ├── 02_seed.sql           # Extended seed data
│   └── 03_policies.sql       # Extended RLS policies
├── tests/                    # Testing
│   └── smoke.sh             # API smoke tests
├── docs/                     # Documentation
│   ├── PRD.md               # Product requirements
│   ├── TASK_LIST.md         # Development roadmap
│   └── WORKSPACE_RULES.md   # Development guidelines
├── .env                      # Environment variables (root)
├── .env.example             # Environment template
└── readme_template.md       # README template
```

## API Endpoints

### Students
- `GET /api/students` - Get all verified students
- `GET /api/students/search?interest={name}` - Search by interest

### Events
- `GET /api/events` - Browse all events
- `GET /api/events?event_type={type}` - Filter by type (Event, Club Meeting, Fair)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (auth required)

### Attendance
- `POST /api/attend` - Check in to event (auth required)

**📖 Full API docs:** See `api/README.md` and `api/openapi.yaml`

## Database Schema

**4 Core Tables (Specification 2):**
- `student` - Student accounts with email, year, verification status
- `interest` - Student interests for matching
- `events` - Campus events with type, location, date/time
- `attend` - Event attendance tracking with check-in/out, ratings, experiences

**Security:** Row Level Security (RLS) policies on all tables

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd "Event Buddy App"
   cd api && npm install && cd ..
   cd client && npm install && cd ..
   ```

2. **Create Supabase project**
   - Go to https://supabase.com/dashboard
   - Create new project
   - In SQL Editor, run these files in order:
     - `supabase/00_spec_schema.sql`
     - `supabase/00_spec_seed.sql`
     - `supabase/00_spec_policies.sql`

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials:
   # - VITE_SUPABASE_URL
   # - VITE_SUPABASE_PUBLISHABLE_KEY
   # - SUPABASE_SECRET_KEY
   
   # Copy .env to client folder
   cp .env client/.env
   ```

4. **Start servers (use 2 terminals)**
   ```bash
   # Terminal 1: API server
   cd api && npm run dev
   
   # Terminal 2: Frontend
   cd client && npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001/health
   - Tests: `./tests/smoke.sh`

## Development Workflow

This project follows a structured development approach with:
- Feature-based branching strategy
- Conventional commit messages
- Automated testing and deployment
- Code review process

For detailed development guidelines, see `WORKSPACE_RULES.md`.

## Development Roadmap

### ✅ Prototype 2 - Complete
- Database schema (student, interest, events, attend)
- Express API server with smoke tests
- React frontend with all pages
- Authentication (login, signup, profile setup)
- Event browsing, creation, and check-in
- Student search by interest
- Responsive design with Tailwind CSS

### 📋 Prototype 3 - Planned
- AWS Amplify deployment
- CI/CD pipeline
- Production environment setup

**📖 Full roadmap:** See `docs/TASK_LIST.md`

## Testing

### Smoke Tests
```bash
cd tests
chmod +x smoke.sh
./smoke.sh
```

Tests verify:
- ✅ API health check
- ✅ Public endpoints (events, profiles)
- ✅ Authentication middleware
- ✅ Error handling
- ✅ CORS headers

## Documentation

- **`docs/PRD.md`** - Product requirements document
- **`docs/TASK_LIST.md`** - Development tasks and roadmap
- **`docs/WORKSPACE_RULES.md`** - Coding standards and guidelines
- **`api/README.md`** - API documentation
- **`api/openapi.yaml`** - OpenAPI specification

## Contributing

This is a student project. Development guidelines:
1. Read `docs/WORKSPACE_RULES.md` for standards
2. Follow conventional commit messages
3. Test with `./tests/smoke.sh` before committing
4. Use functional React components with hooks
5. Follow Tailwind CSS for styling
6. Keep API and frontend in sync

## Technologies

**Frontend:** React 18, Vite, Tailwind CSS, React Router  
**Backend:** Node.js, Express.js, Supabase Client  
**Database:** PostgreSQL (Supabase)  
**Auth:** Supabase Auth with JWT  
**Security:** Helmet, CORS, Rate Limiting, RLS Policies  
**Testing:** Bash smoke tests  

## License

Educational project for BSIS 350 - Fall 2025# Deployed Fri Dec  5 20:31:52 PST 2025
