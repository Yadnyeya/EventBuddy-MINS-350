# Prototype 3 - Deployment Plan

## 📋 Overview
Deploy EventBuddy to AWS with a public URL, live backend API, and connected Supabase database.

**Target Date**: December 2025  
**Current Status**: Prototype 2 Complete - Ready for Deployment

---

## 🎯 Requirements Checklist

### 1. Deploy Application ✅
- [ ] Frontend hosted on AWS Amplify (public URL)
- [ ] Backend API deployed to AWS Lambda via Serverless Framework
- [ ] Environment variables configured for production
- [ ] CORS properly configured for cross-origin requests

### 2. Functional Navigation ✅
- [x] 12 pages already implemented
- [ ] Test all navigation flows
- [ ] Verify protected routes work
- [ ] Ensure no broken links

### 3. Live Data Integration ✅
- [x] Supabase already connected
- [ ] Test 3+ feature pages with live data:
  - EventsPage (browse events)
  - EventDetailPage (view event details)
  - ProfilePage (student profiles)
  - NetworkPage (student search)
- [ ] Verify API endpoints work in production

### 4. Final README.md Update ✅
- [ ] Add deployed app URL
- [ ] Document setup instructions
- [ ] List known issues
- [ ] Add demo user credentials

---

## 📐 Architecture Plan

### Current (Prototype 2)
```
Client (Vite:3000) → API (Express:3001) → Supabase (PostgreSQL)
```

### Target (Prototype 3)
```
Client (AWS Amplify) → API (AWS Lambda) → Supabase (PostgreSQL)
         ↓
    CloudFront CDN
```

---

## 🚀 Deployment Steps

### Phase 1: Backend API Deployment (AWS Lambda)

#### 1.1 Install Serverless Framework
```bash
npm install -g serverless
npm install --save-dev serverless-offline
```

#### 1.2 Create `serverless.yml` in `api/` folder
```yaml
service: eventbuddy-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: ${opt:stage, 'prod'}
  environment:
    VITE_SUPABASE_URL: ${env:VITE_SUPABASE_URL}
    VITE_SUPABASE_PUBLISHABLE_KEY: ${env:VITE_SUPABASE_PUBLISHABLE_KEY}
    SUPABASE_SECRET_KEY: ${env:SUPABASE_SECRET_KEY}

functions:
  api:
    handler: handler.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-offline
```

#### 1.3 Create Lambda Handler (`api/handler.js`)
```javascript
const serverless = require('serverless-http');
const app = require('./server');

module.exports.handler = serverless(app);
```

#### 1.4 Modify `api/server.js` for Lambda
- Export the Express app instead of listening
- Update CORS to allow Amplify domain

#### 1.5 Deploy API to AWS Lambda
```bash
cd api
serverless deploy --stage prod
# Note the API Gateway URL (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod)
```

---

### Phase 2: Frontend Deployment (AWS Amplify)

#### 2.1 Prepare `client/` for Production

**Create `client/amplify.yml`**:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Update `client/.env.production`**:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod
```

#### 2.2 Update API Calls to Use Production URL

**Modify `client/src/services/supabase.js`**:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

#### 2.3 Deploy to AWS Amplify

**Option A: Via AWS Console (Recommended)**
1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect GitHub repository: `Yadnyeya/EventBuddy-MINS-350`
4. Select branch: `main`
5. Set build settings:
   - Build command: `npm run build`
   - Base directory: `client`
   - Publish directory: `client/dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_API_URL`
7. Deploy

**Option B: Via Amplify CLI**
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

---

### Phase 3: Testing & Verification

#### 3.1 Test API Endpoints
```bash
# Health check
curl https://your-api-url.amazonaws.com/prod/health

# Get events
curl https://your-api-url.amazonaws.com/prod/api/events

# Get students
curl https://your-api-url.amazonaws.com/prod/api/students
```

#### 3.2 Test Frontend Navigation
- [ ] Home page loads
- [ ] Login/Signup flow works
- [ ] Protected routes redirect correctly
- [ ] Events page displays live data
- [ ] Event detail page loads
- [ ] Profile pages work
- [ ] Network search functions

#### 3.3 Test Live Data Integration
- [ ] Events fetch from Supabase
- [ ] Students search by interest
- [ ] Event creation works (auth required)
- [ ] Profile updates persist
- [ ] Check-in/attendance tracking

#### 3.4 Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile (iOS/Android)

---

### Phase 4: Documentation Update

#### 4.1 Update README.md

Add deployment section:
```markdown
## 🌐 Deployed Application

**Live URL**: https://main.d1234abcd.amplifyapp.com

### Demo User
- Email: john.doe@example.com
- Password: demo123

### What to Test:
1. Browse events on the Events page
2. Search for students by interest on Network page
3. View event details and check-in functionality
4. Create a profile (requires signup)

### Known Issues:
- Some features require authentication
- Placeholder content on Connect page
```

#### 4.2 Document API Endpoints

Update `api/README.md` with production URLs:
```markdown
## Production API
Base URL: https://your-api.execute-api.us-east-1.amazonaws.com/prod
```

---

## 📊 Project Status

### ✅ Already Complete (Prototype 2)
- 12 functional pages implemented
- Supabase database with live data
- Express API with all endpoints
- Authentication system
- Protected routes
- Responsive design
- API smoke tests passing

### 🔧 Need to Implement (Prototype 3)
1. **Backend Deployment** (2-3 hours)
   - Configure Serverless Framework
   - Create Lambda handler
   - Deploy to AWS
   - Test API endpoints

2. **Frontend Deployment** (1-2 hours)
   - Configure Amplify build settings
   - Add environment variables
   - Deploy to AWS Amplify
   - Test public URL

3. **Integration Testing** (1 hour)
   - Verify navigation flows
   - Test live data connections
   - Check authentication
   - Test on multiple devices

4. **Documentation** (30 minutes)
   - Update README with deployment URL
   - Add demo credentials
   - Document known issues

**Total Estimated Time**: 5-7 hours

---

## 🛠️ Prerequisites

### AWS Account Setup
- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] IAM user with permissions:
  - AWSLambdaFullAccess
  - AmazonAPIGatewayAdministrator
  - AWSAmplifyFullAccess
  - CloudFormationFullAccess

### Required Tools
- [ ] Node.js 18+ installed
- [ ] Serverless Framework installed globally
- [ ] AWS CLI configured
- [ ] Git configured

### Environment Variables Ready
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_PUBLISHABLE_KEY
- [ ] SUPABASE_SECRET_KEY

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Update Lambda CORS configuration in `serverless.yml`:
```yaml
cors:
  origin: '*'
  headers:
    - Content-Type
    - Authorization
  allowCredentials: false
```

### Issue 2: Environment Variables Not Loading
**Solution**: Add to Amplify console under "Environment variables"

### Issue 3: Build Fails on Amplify
**Solution**: Check `amplify.yml` paths and ensure `npm ci` runs in correct directory

### Issue 4: API Gateway Timeout
**Solution**: Increase Lambda timeout in `serverless.yml`:
```yaml
timeout: 30
```

---

## 📝 Submission Checklist

Before submitting Prototype 3:
- [ ] Public AWS Amplify URL working
- [ ] API deployed and accessible
- [ ] README.md updated with:
  - [ ] Deployed app link
  - [ ] Demo user credentials
  - [ ] Setup instructions
  - [ ] Known issues
- [ ] All navigation flows tested
- [ ] 3+ pages connected to live data
- [ ] No broken links or console errors
- [ ] Tested on mobile and desktop
- [ ] GitHub repository up to date

---

## 🎯 Success Criteria

### Must Have:
✅ Public URL accessible without authentication  
✅ Users can navigate all pages  
✅ At least 3 pages show live Supabase data  
✅ API runs independently (Lambda)  
✅ README documents deployment  

### Nice to Have:
⭐ Custom domain name  
⭐ SSL certificate  
⭐ Performance optimizations  
⭐ Error monitoring (Sentry)  
⭐ Analytics (Google Analytics)  

---

## 🔗 Useful Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Serverless Framework Guide](https://www.serverless.com/framework/docs/)
- [Supabase + AWS Lambda](https://supabase.com/docs/guides/functions/deploy/aws-lambda)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

**Last Updated**: December 3, 2025  
**Status**: Ready to Deploy 🚀
