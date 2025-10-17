<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# EventBuddy Project Instructions

## Project Overview
EventBuddy is a React-based event management application with Supabase backend and AWS deployment. This project focuses on event discovery, creation, and user management.

## Development Guidelines
- Use React 18+ with modern hooks and functional components
- Implement Supabase for authentication, database, and real-time features
- Follow component-based architecture with reusable UI components
- Use Tailwind CSS for styling and responsive design
- Implement proper error handling and loading states
- Follow accessibility best practices (WCAG guidelines)

## Code Standards
- Use TypeScript for type safety where possible
- Implement proper PropTypes or TypeScript interfaces
- Follow React best practices (hooks rules, component composition)
- Use semantic HTML and proper ARIA attributes
- Implement proper form validation and user feedback

## Project Structure
- Components in /src/components/ organized by feature
- Pages in /src/pages/ for main route components
- Services in /src/services/ for API and external integrations
- Hooks in /src/hooks/ for reusable logic
- Utils in /src/utils/ for helper functions

## Specific Requirements
- Integrate Supabase for user authentication and data management
- Implement event CRUD operations with proper authorization
- Create responsive design for mobile and desktop
- Set up GitHub Actions for CI/CD to AWS
- Follow the specifications provided in the project documentation