# Database Setup Instructions

## How to Create Tables in Supabase

Since we cannot run SQL commands directly from the terminal to Supabase, follow these steps:

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Login to your account
3. Select your project: "Yadnyeya's Project"
4. Click on **SQL Editor** in the left sidebar (or the **Database** icon)

### Step 2: Run Schema File

1. In the SQL Editor, click **"New query"**
2. Open the file: `supabase/00_spec_schema.sql`
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **"Run"** (or press Cmd+Enter)
6. You should see: "Success. No rows returned"

This creates 4 tables:
- ✅ student
- ✅ interest
- ✅ events
- ✅ attend

### Step 3: Run Seed Data (Optional)

1. Click **"New query"** again
2. Open the file: `supabase/00_spec_seed.sql`
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **"Run"**
6. You should see a table showing:
   - Students: 4
   - Interests: 12
   - Events: 5
   - Attendance Records: 3

This adds sample data for testing.

### Step 4: Run Security Policies

1. Click **"New query"** again
2. Open the file: `supabase/00_spec_policies.sql`
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **"Run"**
6. You should see: "Success. No rows returned"

This sets up Row Level Security policies.

### Step 5: Verify Tables Were Created

Run this query in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- attend
- events
- interest
- student

### Step 6: Test with Sample Query

```sql
SELECT s.email, s.year, COUNT(i.interest_id) as interest_count
FROM student s
LEFT JOIN interest i ON s.student_id = i.student_id
GROUP BY s.student_id, s.email, s.year;
```

This should return 4 students with their interest counts.

## Alternative: Use Supabase API (Advanced)

If you want to automate this, you could use the Supabase Management API, but it requires:
- Personal access token
- Additional API calls
- More complex setup

The SQL Editor method above is simpler and more reliable.

## Troubleshooting

**Error: "permission denied for schema public"**
- Make sure you're logged in as the project owner
- Try running in SQL Editor, not in the Table Editor

**Error: "relation already exists"**
- Tables already exist! You can skip schema creation
- Or drop tables first: `DROP TABLE IF EXISTS attend, events, interest, student CASCADE;`

**Error: "syntax error"**
- Make sure you copied the ENTIRE file
- Check for any copy/paste formatting issues

## Next Steps After Setup

Once tables are created:

1. **Test API Endpoints:**
   ```bash
   cd api && npm start
   ```

2. **Run Smoke Tests:**
   ```bash
   ./tests/smoke.sh
   ```

3. **Build Frontend Pages** - The API will now work with real data!
