# Frontend Deployment - Step by Step Guide

## 📋 Overview
This guide splits tasks between what **YOU** do in AWS Console and what **I (Windsurf)** do in the code.

---

## 🔵 PART 1: Code Preparation (I'LL DO THIS)

### Step 1.1: Fix API Base URL ✅
**What's wrong**: Currently uses `VITE_APP_URL` and does string replacement  
**What we need**: Use `VITE_API_BASE_URL` environment variable

**I'll update**: `client/src/services/supabase.js`
```javascript
// Current (line 130):
const apiUrl = import.meta.env.VITE_APP_URL?.replace('5173', '3001') || 'http://localhost:3001';

// Will change to:
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

### Step 1.2: Add Amplify Build Configuration ✅
**I'll create**: `client/amplify.yml`
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

### Step 1.3: Add PWA Icons (Optional - Skip for now) ⏭️
**Note**: PWA manifest is optional for this prototype. We'll skip this step.

### Step 1.4: Test Local Build ✅
**I'll run**: 
```bash
cd client
npm run build
```
This ensures the production build works before deploying.

---

## 🟢 PART 2: AWS Amplify Setup (YOU'LL DO THIS)

### Step 2.1: Create AWS Account (if needed)
**YOU DO:**
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow sign-up process
4. **Important**: You may need a credit card, but AWS Free Tier covers this deployment

### Step 2.2: Open AWS Amplify Console
**YOU DO:**
1. Log in to AWS Console: https://console.aws.amazon.com
2. In the search bar, type "Amplify"
3. Click "AWS Amplify"
4. Click "Get Started" or "New app"

### Step 2.3: Connect GitHub Repository
**YOU DO:**
1. Click "Host web app"
2. Select "GitHub" as the repository service
3. Click "Continue"
4. Authorize AWS Amplify to access your GitHub account
5. Select repository: `EventBuddy-MINS-350`
6. Select branch: `main`
7. Click "Next"

### Step 2.4: Configure Build Settings
**YOU DO:**

**IMPORTANT**: Since we have a monorepo structure (api/ and client/ folders), configure these settings:

1. **App name**: `eventbuddy` (or your choice)

2. **Monorepo settings**:
   - Toggle "My app is a monorepo" = **ON**
   - Root directory = `client`

3. **Build settings** (should auto-detect from `amplify.yml`):
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
   ```

4. Click "Advanced settings" at the bottom

5. **Add Environment Variables**:
   - Click "Add environment variable"
   - Add these THREE variables:

   | Key | Value | Example |
   |-----|-------|---------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefgh.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGc...` (long string) |
   | `VITE_API_BASE_URL` | Temporary placeholder | `https://PLACEHOLDER` |

   **Where to find Supabase keys**:
   - Go to https://app.supabase.com
   - Open your project
   - Settings → API
   - Copy "Project URL" and "anon public" key

6. Click "Next"

### Step 2.5: Review and Deploy
**YOU DO:**
1. Review all settings
2. Click "Save and deploy"
3. **Wait 5-10 minutes** while Amplify builds and deploys

**What happens**:
- Amplify clones your GitHub repo
- Runs `npm ci` to install dependencies
- Runs `npm run build` to create production build
- Deploys to AWS infrastructure
- Generates a public URL

### Step 2.6: Get Your Deployed URL
**YOU DO:**
1. Once status shows "✅ Deployed"
2. Copy the URL (looks like: `https://main.d1234abcd5678.amplifyapp.com`)
3. **SAVE THIS URL** - you'll need it for README

---

## 🔴 PART 3: Verification (WE'LL DO TOGETHER)

### Step 3.1: Test the Deployed Frontend
**YOU DO:**
1. Open the Amplify URL in your browser
2. You should see the EventBuddy homepage
3. **Expected**: Page loads, but API calls will fail (404 errors) - THIS IS NORMAL

### Step 3.2: Check Console for Errors
**YOU DO:**
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to Console tab
3. Look for errors

**Expected errors**:
- ❌ `Failed to fetch` or `404` for API calls - **NORMAL** (API not deployed yet)
- ❌ Network errors to `https://PLACEHOLDER` - **NORMAL**

**Unexpected errors** (tell me if you see these):
- ❌ `VITE_SUPABASE_URL is not defined`
- ❌ `Cannot read properties of undefined`
- ❌ White screen / blank page

### Step 3.3: Test Navigation
**YOU DO:**
Try clicking these:
- [ ] Home page loads
- [ ] Click "Login" - login page loads
- [ ] Click "Sign Up" - signup page loads
- [ ] Click "Events" - events page loads (will show empty or errors - normal)

---

## 📝 Summary Checklist

### Before AWS Deployment:
- [ ] I've updated `client/src/services/supabase.js` to use `VITE_API_BASE_URL`
- [ ] I've created `client/amplify.yml` configuration
- [ ] I've run `npm run build` successfully

### During AWS Deployment:
- [ ] You've created/logged into AWS account
- [ ] You've connected GitHub repo to Amplify
- [ ] You've configured monorepo with `client` as root directory
- [ ] You've added 3 environment variables
- [ ] You've deployed successfully

### After Deployment:
- [ ] You have the public Amplify URL
- [ ] Frontend loads in browser
- [ ] Navigation works between pages
- [ ] API errors are expected (we haven't deployed API yet)

---

## 🚨 Troubleshooting

### Issue: Build fails with "npm: command not found"
**Solution**: In build settings, ensure Node.js version is set to 18 or higher

### Issue: Build fails with "Cannot find module"
**Solution**: Check that monorepo root directory is set to `client`

### Issue: Blank white screen
**Solution**: 
1. Check Amplify logs for build errors
2. Verify environment variables are set correctly
3. Check browser console for JavaScript errors

### Issue: "VITE_SUPABASE_URL is undefined"
**Solution**: 
1. Go to Amplify → App settings → Environment variables
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Redeploy the app

---

## ✅ Next Steps

Once frontend is deployed:
1. **Save the Amplify URL** - you'll need it for the README
2. **We'll deploy the backend API** (AWS Lambda)
3. **Update `VITE_API_BASE_URL`** to point to the Lambda API
4. **Redeploy frontend** to connect to live API
5. **Test full application** end-to-end

---

**Ready to start? Let me know and I'll begin with Part 1 (Code Preparation)!**
