# Workspace Rules - EventBuddy

## Code Style
- Use **functional components** with hooks
- Use **Tailwind CSS** for styling
- Keep files under **150 lines**
- Use **camelCase** for variables, **PascalCase** for components

## File Naming
- Components: `EventCard.jsx`
- Pages: `HomePage.jsx`  
- Utilities: `dateUtils.js`
- Folders: `event-management/`

## Git Workflow
- **Main branch**: `main` (production ready)
- **Feature branches**: `feature/feature-name`
- **Commits**: Use clear, descriptive messages
  ```
  feat(auth): add user registration
  fix(events): resolve date validation error
  ```

## Pull Requests
- Create PR to `main` branch
- Add clear title and description
- Get at least one review before merging
- Delete branch after merge

## Testing
- Write tests for critical functionality
- Ensure all tests pass before committing
- Aim for 70% code coverage

## Security
- Never commit secrets or API keys
- Validate all user inputs
- Use environment variables for config

---
**Keep it simple, keep it clean, keep it working** ✨