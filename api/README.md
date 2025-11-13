# EventBuddy API Server

Express.js backend API for the EventBuddy student networking platform. This API connects to Supabase and provides RESTful endpoints for events, profiles, connections, and messaging.

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Valid Supabase credentials (URL and API keys)

## 🔧 Environment Variables

Create a `.env` file in the **project root directory** (not in `/api`):

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Supabase account and project
- Environment variables configured

### Installation

```bash
# Navigate to api directory
cd api

# Install dependencies
npm install

# Copy environment variables (from project root)
# Make sure .env is configured in the project root
```

### Environment Variables

Create a `.env` file in the **project root** with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
API_PORT=3001
VITE_APP_URL=http://localhost:5173
```

### Database Setup

Before running the API, execute the SQL migrations in Supabase:

1. Go to Supabase SQL Editor
2. Run `db/01_schema.sql` - Creates tables
3. Run `db/02_seed.sql` - Seeds data (optional)
4. Run `db/03_policies.sql` - Sets up Row Level Security

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### Events

```
GET    /api/events              # Get all events (with filters)
GET    /api/events/:id          # Get event by ID
POST   /api/events              # Create event (auth required)
PUT    /api/events/:id          # Update event (auth required, host only)
DELETE /api/events/:id          # Delete event (auth required, host only)
POST   /api/events/:id/save     # Save event (auth required)
DELETE /api/events/:id/save     # Unsave event (auth required)
GET    /api/events/saved/me     # Get saved events (auth required)
POST   /api/events/:id/ratings  # Rate event (auth required)
GET    /api/events/:id/ratings  # Get event ratings
```

### Profiles

```
GET    /api/profiles           # Search profiles
GET    /api/profiles/:id       # Get profile by ID
GET    /api/profiles/me/profile # Get own profile (auth required)
POST   /api/profiles           # Create profile (auth required)
PUT    /api/profiles/me        # Update profile (auth required)
DELETE /api/profiles/me        # Delete profile (auth required)
GET    /api/profiles/:id/interests # Get user interests
PUT    /api/profiles/me/interests # Update own interests (auth required)
POST   /api/profiles/:id/block    # Block user (auth required)
DELETE /api/profiles/:id/block    # Unblock user (auth required)
POST   /api/profiles/:id/report   # Report user (auth required)
```

### Connections

```
GET    /api/connections                    # Get connections (auth required)
POST   /api/connections                    # Send request (auth required)
PUT    /api/connections/:id                # Accept/reject (auth required)
DELETE /api/connections/:id                # Delete connection (auth required)
GET    /api/connections/pending/received   # Pending received (auth required)
GET    /api/connections/pending/sent       # Pending sent (auth required)
GET    /api/connections/matches/suggestions # Match suggestions (auth required)
```

### Messages

```
GET    /api/messages                       # Get messages (auth required)
GET    /api/messages/conversations         # Get conversations (auth required)
GET    /api/messages/conversation/:userId  # Get conversation with user (auth required)
POST   /api/messages                       # Send message (auth required)
PUT    /api/messages/:id/read              # Mark as read (auth required)
DELETE /api/messages/:id                   # Delete message (auth required)
GET    /api/messages/unread/count          # Unread count (auth required)
```

## Authentication

Protected endpoints require a JWT token from Supabase Auth in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get the token from Supabase Auth on the frontend and pass it with requests.

## Testing

Run smoke tests to verify API functionality:

```bash
# Make sure API server is running first
cd tests
chmod +x smoke.sh
./smoke.sh
```

## Error Handling

All errors return JSON with:

```json
{
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (success with no data)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Applies to all `/api/*` endpoints

## Security Features

- ✅ Helmet (security headers)
- ✅ CORS (frontend access only)
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Row Level Security (Supabase)
- ✅ Input validation
- ✅ SQL injection prevention (Supabase client)

## Project Structure

```
api/
├── server.js                 # Main Express server
├── package.json              # Dependencies
├── config/
│   └── supabase.js          # Supabase client setup
├── routes/
│   ├── events.js            # Event routes
│   ├── profiles.js          # Profile routes
│   ├── connections.js       # Connection routes
│   └── messages.js          # Message routes
└── controllers/
    ├── eventsController.js      # Event logic
    ├── profilesController.js    # Profile logic
    ├── connectionsController.js # Connection logic
    └── messagesController.js    # Message logic
```

## Development Tips

1. **Hot Reload**: Use `npm run dev` for automatic server restart on file changes
2. **Logging**: All requests are logged with timestamp and method
3. **Error Logging**: Check console for detailed error messages
4. **Database Issues**: Verify RLS policies are set up correctly in Supabase
5. **CORS Issues**: Make sure `VITE_APP_URL` in .env matches your frontend URL

## Troubleshooting

### "Missing Supabase credentials"
- Check that `.env` file exists in project root
- Verify all Supabase variables are set

### "Cannot connect to database"
- Verify Supabase project is active
- Check network connection
- Verify API keys are correct

### "401 Unauthorized"
- Token may be expired (regenerate on frontend)
- Token not in Authorization header
- Wrong token format (should be `Bearer <token>`)

### "403 Forbidden"
- Check Row Level Security policies in Supabase
- Verify user has permission for the resource
- Check if users are connected (for messaging)

## Next Steps (Prototype 3)

This Express server is for **local development only**. For production:

1. Migrate to AWS Lambda with Serverless Framework
2. Set up API Gateway
3. Configure AWS credentials
4. Deploy with `serverless deploy`

See Prototype 3 tasks in `TASK_LIST.md` for deployment guide.

## Support

For issues or questions:
1. Check error logs in console
2. Verify database schema matches `db/01_schema.sql`
3. Test with smoke tests: `tests/smoke.sh`
4. Check Supabase dashboard for database issues
