# EventBuddy

**A student networking platform for event discovery and connections**

EventBuddy helps students overcome social barriers by facilitating event discovery and connections with like-minded peers. Designed with introverts in mind, it provides a safe, inclusive space for students to find events, make friends, and build meaningful campus connections.

## 🚀 Live Application

**Frontend**: [https://main.d29j968x1tbi08.amplifyapp.com/](https://main.d29j968x1tbi08.amplifyapp.com/)  
**Backend API**: [https://xxvhcqflyg.execute-api.us-east-1.amazonaws.com/prod](https://xxvhcqflyg.execute-api.us-east-1.amazonaws.com/prod)  
**Health Check**: [API Health](https://xxvhcqflyg.execute-api.us-east-1.amazonaws.com/prod/health)

## Current Status: **Prototype 3 - Production Deployed** ✅

### What's Working:
- ✅ Full React frontend with authentication and event browsing
- ✅ Express API server with REST endpoints
- ✅ Supabase database with RLS policies
- ✅ Student profiles and event management
- ✅ Check-in/attendance tracking system
- ✅ Search and filter functionality
- ✅ Responsive design with Tailwind CSS
- ✅ **AWS Amplify frontend hosting**
- ✅ **AWS Lambda + API Gateway backend**
- ✅ **CloudWatch monitoring and error alarms**
- ✅ **Production-ready security and secrets management**

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
- **Production**: AWS Amplify (frontend) + AWS Lambda (backend)
  - Frontend auto-deploys on git push to main
  - Backend uses Serverless Framework
  - Secrets managed in AWS Secrets Manager
  - CloudWatch monitoring with error alarms
- **Local Development**: Vite dev server + Express API

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

### ✅ Prototype 3 - Complete
- ✅ AWS Amplify frontend hosting with auto-deploy
- ✅ AWS Lambda + API Gateway backend
- ✅ Serverless Framework deployment automation
- ✅ AWS Secrets Manager integration
- ✅ CloudWatch monitoring and error alarms
- ✅ Production security hardening
- ✅ Complete deployment documentation

### 📋 Future Enhancements
- Push notifications for new events
- In-app messaging between students
- Event recommendations based on interests
- Analytics dashboard for event organizers

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
- **`docs/DEPLOYMENT.md`** - Production deployment guide
- **`api/README.md`** - API documentation
- **`api/openapi.yaml`** - OpenAPI specification

## Troubleshooting

### Common Issues

**Frontend shows "Failed to fetch"**
- Check API Gateway is responding: visit the health check URL
- Verify CORS is configured for your domain in `api/handler-simple.cjs`
- Check CloudWatch logs: `aws logs tail /aws/lambda/eventbuddy-api-prod-api --follow`

**"Internal server error" on API calls**
- Check CloudWatch logs for Lambda errors
- Verify Supabase credentials in AWS Secrets Manager
- Test direct Supabase connection from Supabase dashboard

**Authentication not working**
- Verify Supabase Site URL includes your Amplify domain
- Check Redirect URLs are configured in Supabase dashboard
- Clear browser cache and local storage

**Lambda cold starts taking long**
- First request after idle may take 5-10 seconds
- Consider provisioned concurrency for production
- Check function memory allocation (current: 512MB)

### Getting Help

1. Check `docs/DEPLOYMENT.md` for detailed deployment procedures
2. Review CloudWatch logs for error details
3. Test endpoints with curl to isolate frontend vs backend issues
4. Verify Supabase RLS policies aren't blocking requests

**Support**: For project-specific questions, contact the development team

## Contributing

This is a student project. Development guidelines:
1. Read `docs/WORKSPACE_RULES.md` for standards
2. Follow conventional commit messages
3. Test with `./tests/smoke.sh` before committing
4. Use functional React components with hooks
5. Follow Tailwind CSS for styling
6. Keep API and frontend in sync

### Deployment Process

**Frontend (Auto-deploy)**
- Push to main branch triggers Amplify build
- Build takes ~2-3 minutes
- Check Amplify console for build status

**Backend (Manual deploy)**
```bash
cd api
npm run deploy  # Deploy to AWS Lambda
```

See `docs/DEPLOYMENT.md` for complete deployment procedures and rollback instructions.

## Technologies

**Frontend:** React 18, Vite, Tailwind CSS, React Router  
**Backend:** Node.js, Express.js, Supabase Client  
**Database:** PostgreSQL (Supabase)  
**Auth:** Supabase Auth with JWT  
**Hosting:** AWS Amplify (Frontend), AWS Lambda + API Gateway (Backend)  
**Monitoring:** AWS CloudWatch with error alarms  
**Security:** Helmet, CORS, Rate Limiting, RLS Policies, AWS Secrets Manager  
**Testing:** Bash smoke tests  

## Known Limitations

- Email confirmation disabled (requires SMTP setup for production)
- Cold starts on Lambda may cause 5-10 second delays on first request
- Profile picture uploads not yet implemented
- Direct messaging between students planned for future release
- Event capacity limits not enforced

## License

Educational project for BSIS 350 - Fall 2025

---

**Last Updated:** December 2025  
**Version:** Prototype 3 (Production Deployed)
