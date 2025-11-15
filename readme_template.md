# EventBuddy

**A student networking platform for event discovery and buddy matching**

EventBuddy helps students overcome social barriers by facilitating event discovery and connections with like-minded peers. Designed with introverts in mind, it provides a safe, inclusive space for students to find events, make friends, and build meaningful campus connections.

## Current Status: **Prototype 2 - Backend & API Complete** ✅

### What's Working:
- ✅ Complete database schema (11 tables)
- ✅ Row Level Security policies
- ✅ Express API server with 40+ endpoints
- ✅ Supabase integration
- ✅ Smart buddy matching algorithm
- ✅ Event management CRUD operations
- ✅ Messaging system
- ✅ Safety features (block/report)
- ✅ API smoke tests
- ✅ Frontend service layer

### Next Steps:
- 🔨 Build frontend pages and components
- 🔨 Implement authentication UI
- 🔨 Create event browsing interface
- 🔨 Design buddy matching flow

## Key Features

### 🎯 For Students
- **Event Discovery**: Find study groups, social events, sports activities, and more
- **Buddy Matching**: AI-powered matching based on interests, personality, and events
- **Safe Connections**: Built-in blocking and reporting for user safety
- **Direct Messaging**: Chat with matched buddies
- **Event Reminders**: Save events and get notified

### 🎨 Design Philosophy
- **Introvert-Friendly**: Low-pressure connection requests
- **Smart Matching**: Interest, personality, and major-based algorithms
- **Safety First**: Block, report, and connection controls
- **Mobile-First**: Responsive design for on-the-go students

## Technology Stack

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for single-page application
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend & Database
- **Supabase**: PostgreSQL database with Row Level Security
  - User authentication with email/password
  - Real-time subscriptions for messages and notifications
  - Database schema with 11 tables
  - Auto-scaling and backups
- **Express.js**: Local development API server
  - RESTful endpoints for all features
  - JWT authentication middleware
  - CORS and rate limiting
  - Input validation and error handling

### Deployment (Prototype 3 - Upcoming)
- **AWS Amplify**: Frontend hosting with CI/CD
- **AWS Lambda**: Serverless API functions
- **API Gateway**: Managed API endpoints
- **GitHub Actions**: Automated testing and deployment
- **Serverless Framework**: Infrastructure as code

## Project Structure

```
EventBuddy/
├── api/                       # Backend API server
│   ├── server.js             # Express server
│   ├── config/               # Supabase configuration
│   ├── routes/               # API route definitions
│   ├── controllers/          # Business logic
│   └── package.json          # API dependencies
├── db/                       # Database migrations
│   ├── 01_schema.sql         # Table definitions
│   ├── 02_seed.sql           # Sample data
│   └── 03_policies.sql       # RLS policies
├── src/                      # Frontend source code
│   ├── components/           # Reusable React components
│   ├── pages/                # Page components
│   ├── services/             # API service layer
│   │   ├── supabase.js       # Supabase client & auth
│   │   ├── eventsApi.js      # Events API wrapper
│   │   ├── profilesApi.js    # Profiles API wrapper
│   │   ├── connectionsApi.js # Connections API wrapper
│   │   └── messagesApi.js    # Messages API wrapper
│   └── utils/                # Utility functions
├── tests/                    # Testing
│   └── smoke.sh             # API smoke tests
├── docs/                     # Documentation
│   ├── PRD.md               # Product requirements
│   ├── TASK_LIST.md         # Development roadmap
│   ├── P2_SETUP.md          # Prototype 2 setup guide
│   └── WORKSPACE_RULES.md   # Development guidelines
├── .env.example             # Environment template
└── package.json             # Frontend dependencies
```

## API Endpoints

### Events
- `GET /api/events` - Browse events with filters
- `POST /api/events` - Create event (auth required)
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/save` - Save event (auth required)
- `POST /api/events/:id/ratings` - Rate event (auth required)

### Profiles
- `GET /api/profiles` - Search profiles
- `POST /api/profiles` - Create profile (auth required)
- `PUT /api/profiles/me` - Update profile (auth required)
- `POST /api/profiles/:id/block` - Block user (auth required)

### Connections (Buddy Matching)
- `GET /api/connections/matches/suggestions` - Get match suggestions (auth required)
- `POST /api/connections` - Send connection request (auth required)
- `PUT /api/connections/:id` - Accept/reject request (auth required)

### Messages
- `GET /api/messages/conversations` - Get conversations (auth required)
- `POST /api/messages` - Send message (auth required)
- `GET /api/messages/unread/count` - Unread count (auth required)

**📖 Full API docs:** See `api/README.md`

## Database Schema

**11 Tables:**
- `profiles` - User profiles with bio, interests, personality
- `interests` - Interest categories (study, sports, hobbies)
- `profile_interests` - User interest associations
- `events` - Campus events (study groups, social, sports)
- `event_saves` - Saved events (reminders)
- `event_ratings` - Event feedback (1-5 stars)
- `connections` - Buddy matching relationships
- `messages` - Direct messaging between connected users
- `blocks` - User blocking for safety
- `reports` - Report abusive users/content

**Security:** Row Level Security (RLS) policies on all tables

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Setup (5 minutes)

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd "Event Buddy App"
   npm install
   cd api && npm install && cd ..
   ```

2. **Create Supabase project**
   - Go to https://supabase.com
   - Create new project
   - Run database migrations from `db/` folder

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start servers**
   ```bash
   # Terminal 1: API server
   cd api && npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

5. **Verify**
   - Frontend: http://localhost:5173
   - API: http://localhost:3001/health
   - Tests: `cd tests && ./smoke.sh`

**📖 Full setup guide:** See `docs/P2_SETUP.md` for detailed instructions

## Development Workflow

This project follows a structured development approach with:
- Feature-based branching strategy
- Conventional commit messages
- Automated testing and deployment
- Code review process

For detailed development guidelines, see `WORKSPACE_RULES.md`.

## Development Roadmap

### ✅ Prototype 1 - Foundation (Complete)
- React project structure
- Tailwind CSS setup
- Documentation suite
- GitHub repository

### ✅ Prototype 2 - Backend & API (Complete)
- Database schema with 11 tables
- Row Level Security policies
- Express API server (40+ endpoints)
- Supabase integration
- Smart matching algorithm
- API smoke tests
- Frontend service layer

### 🔨 Prototype 2 - Frontend (In Progress)
- Authentication pages (login, signup, profile setup)
- Event browsing and search
- Event creation flow
- Buddy matching interface
- Messaging UI
- Profile management

### 📋 Prototype 3 - AWS Deployment (Planned)
- AWS Amplify frontend hosting
- AWS Lambda API functions
- API Gateway setup
- CI/CD with GitHub Actions
- Production environment

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

- **`docs/PRD.md`** - Product requirements and architecture
- **`docs/P2_SETUP.md`** - Prototype 2 setup guide (start here!)
- **`docs/TASK_LIST.md`** - Development tasks by prototype
- **`docs/WORKSPACE_RULES.md`** - Coding standards
- **`api/README.md`** - API documentation

## Contributing

This is a school project following specific guidelines:
1. Read `docs/WORKSPACE_RULES.md` for standards
2. Follow conventional commit messages
3. Test with smoke tests before committing
4. Use functional React components
5. Follow Tailwind CSS for styling

## Technologies Used

**Frontend:** React 18, Vite, Tailwind CSS, React Router  
**Backend:** Node.js, Express.js, Supabase Client  
**Database:** PostgreSQL (via Supabase)  
**Auth:** Supabase Auth (JWT)  
**Security:** Helmet, CORS, Rate Limiting, RLS  
**Testing:** Bash smoke tests  
**Deployment:** AWS Amplify + Lambda (Prototype 3)

## License

This is a student project for educational purposes.