# EventBuddy

## Project Description

EventBuddy is a comprehensive event management application designed to simplify event discovery, creation, and management. Built with modern web technologies, it provides an intuitive platform for event organizers and attendees to connect and manage events seamlessly.

## Features

- **Event Discovery**: Browse and search for events based on location, category, and date
- **Event Creation**: Easy-to-use interface for creating and managing events
- **User Authentication**: Secure login and registration system
- **Profile Management**: User profiles with event history and preferences
- **Real-time Updates**: Live notifications and updates for event changes
- **Responsive Design**: Mobile-first design that works on all devices

## Technology Stack

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for single-page application
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend & Database
- **Supabase**: Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - File storage
  - Auto-generated APIs

### Deployment & DevOps
- **GitHub**: Version control and collaboration
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment
- **AWS**: Cloud hosting and production environment
  - S3: Static website hosting
  - CloudFront: Content delivery network
  - Lambda: Serverless functions (if needed)

## Project Structure

```
EventBuddy/
├── .github/                    # GitHub configuration and workflows
├── public/                     # Static assets
├── src/                        # Source code
│   ├── components/            # Reusable React components
│   ├── pages/                 # Page components
│   ├── services/              # API and external services
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   └── styles/                # CSS and styling files
├── docs/                      # Project documentation
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## Files Included

### Core Application Files
- `package.json` - Project dependencies and build scripts
- `vite.config.js` - Vite build configuration
- `src/main.jsx` - Application entry point
- `src/App.jsx` - Main application component
- `src/App.css` - Application styling
- `src/index.css` - Global styles

### Documentation Files
- `README.md` - Project overview and setup instructions
- `PRD.md` - Product Requirements Document
- `TASK_LIST.md` - Development task breakdown
- `WORKSPACE_RULES.md` - Development workflow guidelines

### Configuration Files
- `.github/copilot-instructions.md` - GitHub Copilot workspace instructions
- `public/index.html` - HTML template

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to `http://localhost:3000`

## Development Workflow

This project follows a structured development approach with:
- Feature-based branching strategy
- Conventional commit messages
- Automated testing and deployment
- Code review process

For detailed development guidelines, see `WORKSPACE_RULES.md`.

## Project Status

This project is currently in the **scaffolding phase** (Prototype 1), establishing the foundation for iterative development based on the provided specifications.

## Team

- **Builder**: Responsible for technical implementation and architecture
- **Analyst**: Provides specifications and requirements
- **Designer**: Creates user interface and experience design

## License

This is a student project for educational purposes.