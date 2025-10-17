# Workspace Rules - EventBuddy Development

## Overview
This document defines the coding workflow, standards, and best practices for the EventBuddy project. All team members and contributors must follow these guidelines to ensure consistency, maintainability, and quality.

---

## 1. Coding Standards

### 1.1 JavaScript/React Standards
- **Language**: Use modern JavaScript (ES6+) and JSX for React components
- **Component Style**: Use functional components with hooks (no class components)
- **Prop Validation**: Implement PropTypes or TypeScript interfaces for all components
- **Destructuring**: Use destructuring for props and state variables
- **Arrow Functions**: Use arrow functions for consistency
- **Template Literals**: Use template literals for string interpolation

**Example**:
```javascript
// Good
const EventCard = ({ event, onRegister }) => {
  const { title, date, location } = event;
  
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>{`Date: ${date} | Location: ${location}`}</p>
      <button onClick={() => onRegister(event.id)}>Register</button>
    </div>
  );
};

// Bad
function EventCard(props) {
  return (
    <div className="event-card">
      <h3>{props.event.title}</h3>
      <p>Date: {props.event.date} | Location: {props.event.location}</p>
      <button onClick={function() { props.onRegister(props.event.id); }}>Register</button>
    </div>
  );
}
```

### 1.2 CSS/Styling Standards
- **Framework**: Use Tailwind CSS for utility-first styling
- **Custom CSS**: Use CSS modules for component-specific styles
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Color Scheme**: Use consistent color variables and theme
- **Accessibility**: Ensure sufficient color contrast and focus states

### 1.3 Code Organization
- **File Structure**: Group related files in feature-based folders
- **Component Size**: Keep components under 150 lines; split larger components
- **Function Size**: Keep functions under 20 lines when possible
- **Imports**: Group imports (React, third-party, local) with blank lines between groups

---

## 2. Naming Conventions

### 2.1 Files and Folders
- **Components**: PascalCase (e.g., `EventCard.jsx`, `UserProfile.jsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `HomePage.jsx`, `EventsPage.jsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.js`, `useEvents.js`)
- **Services**: camelCase with "Service" suffix (e.g., `apiService.js`, `authService.js`)
- **Utils**: camelCase (e.g., `dateUtils.js`, `validators.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`, `USER_ROLES.js`)
- **Folders**: kebab-case (e.g., `event-management/`, `user-auth/`)

### 2.2 Variables and Functions
- **Variables**: camelCase (e.g., `userName`, `eventList`, `isLoading`)
- **Functions**: camelCase with descriptive verbs (e.g., `handleSubmit`, `fetchEvents`, `validateForm`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`)
- **Boolean variables**: Use "is", "has", "can", "should" prefixes (e.g., `isVisible`, `hasPermission`)

### 2.3 Components and Classes
- **React Components**: PascalCase (e.g., `EventCard`, `LoginForm`)
- **CSS Classes**: kebab-case (e.g., `event-card`, `login-form`)
- **CSS Modules**: camelCase (e.g., `styles.eventCard`, `styles.loginForm`)

---

## 3. Git Workflow

### 3.1 Branching Strategy
- **Main Branch**: `main` - Production-ready code only
- **Development Branch**: `develop` - Integration branch for features
- **Feature Branches**: `feature/feature-name` - Individual features
- **Bug Fix Branches**: `bugfix/bug-description` - Bug fixes
- **Hotfix Branches**: `hotfix/critical-fix` - Emergency production fixes

### 3.2 Branch Naming Conventions
```
feature/user-authentication
feature/event-creation
feature/search-and-filter
bugfix/login-validation-error
hotfix/security-vulnerability
```

### 3.3 Workflow Process
1. **Create Feature Branch**: From `develop` branch
2. **Develop Feature**: Make changes in feature branch
3. **Test Locally**: Ensure all tests pass
4. **Create Pull Request**: To `develop` branch
5. **Code Review**: At least one reviewer required
6. **Merge**: After approval and passing CI/CD
7. **Delete Branch**: Clean up after merge

---

## 4. Commit Message Guidelines

### 4.1 Commit Message Format
Use the conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

### 4.2 Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### 4.3 Examples
```bash
# Good commit messages
feat(auth): add user registration functionality
fix(events): resolve date validation error
docs(readme): update installation instructions
style(components): format EventCard component
refactor(hooks): optimize useEvents hook performance
test(auth): add unit tests for login component
chore(deps): update React to version 18.2.0

# Bad commit messages
update stuff
fix things
changes
WIP
quick fix
```

### 4.4 Commit Best Practices
- **Atomic Commits**: One logical change per commit
- **Descriptive Messages**: Clear and concise descriptions
- **Present Tense**: Use imperative mood ("add" not "added")
- **Line Length**: Keep first line under 50 characters
- **Body Details**: Use body for detailed explanation if needed

---

## 5. Pull Request Process

### 5.1 Pull Request Template
```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### 5.2 Review Guidelines
- **Required Reviewers**: At least one team member
- **Review Criteria**: Code quality, functionality, performance, security
- **Response Time**: Reviews within 24 hours
- **Approval Required**: All reviews must be approved before merge

### 5.3 Pull Request Standards
- **Title**: Clear and descriptive
- **Description**: Detailed explanation of changes
- **Linked Issues**: Reference related issues/tasks
- **Screenshots**: Include UI changes screenshots
- **Testing**: Evidence of testing completed

---

## 6. Code Review Standards

### 6.1 Review Checklist
- [ ] **Functionality**: Code works as intended
- [ ] **Readability**: Code is clean and well-documented
- [ ] **Performance**: No obvious performance issues
- [ ] **Security**: No security vulnerabilities
- [ ] **Standards**: Follows coding standards
- [ ] **Testing**: Adequate test coverage
- [ ] **Documentation**: Inline comments where needed

### 6.2 Review Feedback
- **Constructive**: Provide helpful and specific feedback
- **Respectful**: Maintain professional tone
- **Educational**: Explain reasoning behind suggestions
- **Actionable**: Provide clear guidance for improvements

---

## 7. Testing Standards

### 7.1 Testing Requirements
- **Unit Tests**: All utility functions and custom hooks
- **Component Tests**: Critical user interface components
- **Integration Tests**: API interactions and user flows
- **Coverage**: Minimum 70% code coverage target

### 7.2 Testing Tools
- **Unit Testing**: Vitest and React Testing Library
- **E2E Testing**: Cypress (future implementation)
- **Coverage**: Built-in Vitest coverage tools

### 7.3 Test Naming
```javascript
// Good test names
describe('EventCard component', () => {
  it('should display event title and date', () => {});
  it('should call onRegister when register button is clicked', () => {});
  it('should show loading state when data is loading', () => {});
});

// Bad test names
describe('EventCard', () => {
  it('works', () => {});
  it('test click', () => {});
});
```

---

## 8. Environment and Configuration

### 8.1 Environment Variables
- **Development**: `.env.local` file (not committed)
- **Production**: Environment-specific configurations
- **Security**: Never commit sensitive credentials
- **Naming**: Use `VITE_` prefix for client-side variables

### 8.2 Configuration Files
- **Package.json**: Consistent dependency versions
- **ESLint**: Standard configuration for code linting
- **Prettier**: Code formatting standards
- **Vite Config**: Build and development settings

---

## 9. Documentation Standards

### 9.1 Code Documentation
- **JSDoc**: Use JSDoc comments for complex functions
- **README**: Keep README.md updated with setup instructions
- **Inline Comments**: Explain complex logic or business rules
- **Component Documentation**: Document props and usage examples

### 9.2 Documentation Example
```javascript
/**
 * Validates an event registration form
 * @param {Object} formData - The form data to validate
 * @param {string} formData.eventId - Unique event identifier
 * @param {string} formData.userId - Unique user identifier
 * @returns {Object} Validation result with errors array
 */
const validateRegistration = (formData) => {
  // Implementation
};
```

---

## 10. Security Guidelines

### 10.1 Security Best Practices
- **Input Validation**: Validate all user inputs
- **Authentication**: Secure authentication implementation
- **Authorization**: Proper access control
- **Data Sanitization**: Sanitize data before database operations
- **HTTPS**: Use secure connections for all requests

### 10.2 Common Security Issues to Avoid
- **XSS**: Cross-site scripting vulnerabilities
- **SQL Injection**: Use parameterized queries
- **Credential Exposure**: Never commit credentials
- **Insecure Direct Object References**: Validate user permissions

---

## 11. Performance Guidelines

### 11.1 Performance Best Practices
- **Code Splitting**: Implement lazy loading for routes
- **Image Optimization**: Optimize and compress images
- **Bundle Size**: Monitor and minimize bundle size
- **Database Queries**: Optimize database queries
- **Caching**: Implement appropriate caching strategies

### 11.2 Performance Monitoring
- **Load Times**: Monitor page load performance
- **Bundle Analysis**: Regular bundle size analysis
- **Database Performance**: Monitor query performance
- **User Experience**: Monitor Core Web Vitals

---

## 12. Deployment Guidelines

### 12.1 Deployment Process
1. **Feature Complete**: All features implemented and tested
2. **Code Review**: All code reviewed and approved
3. **Testing**: All tests passing
4. **Documentation**: Documentation updated
5. **Deployment**: Deploy to staging then production

### 12.2 Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates valid
- [ ] Performance monitoring active
- [ ] Backup procedures in place

---

## 13. Quality Assurance

### 13.1 Definition of Done
A task is considered complete when:
- [ ] Code is written and follows standards
- [ ] Unit tests written and passing
- [ ] Code reviewed and approved
- [ ] Integration tested
- [ ] Documentation updated
- [ ] No critical bugs or security issues

### 13.2 Quality Gates
- **Code Quality**: ESLint and Prettier checks pass
- **Test Coverage**: Minimum coverage requirements met
- **Performance**: No performance regressions
- **Security**: Security scan completed
- **Accessibility**: Basic accessibility requirements met

---

## 14. Communication and Collaboration

### 14.1 Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code review discussions
- **README**: Project documentation and updates
- **Commit Messages**: Change documentation

### 14.2 Meeting Schedule
- **Daily Standups**: Progress updates and blockers
- **Weekly Reviews**: Sprint review and planning
- **Code Reviews**: Ongoing as needed
- **Retrospectives**: Process improvement discussions

---

## 15. Enforcement and Updates

### 15.1 Rule Enforcement
- **Automated Checks**: ESLint, Prettier, and CI/CD pipelines
- **Code Reviews**: Manual verification during reviews
- **Documentation**: Regular documentation audits
- **Team Agreement**: All team members must agree to follow rules

### 15.2 Rule Updates
- **Process**: Rules can be updated through team discussion
- **Documentation**: All changes must be documented
- **Communication**: Changes communicated to all team members
- **Version Control**: Rule changes tracked in git history

---

**Document Prepared By**: Builder Team Member  
**Last Updated**: October 17, 2025  
**Next Review Date**: Monthly or as needed  
**Approved By**: Development Team