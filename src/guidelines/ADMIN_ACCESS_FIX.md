# 🔧 Admin Access Fix Guide

## Problem
User gets "Access Denied" when trying to access the Admin Dashboard, even after manually setting admin role in the database.

## Root Causes

1. **User record doesn't exist in `public.users` table**
   - User exists in `auth.users` but not in `public.users`
   - The application checks the `role` column in `public.users`

2. **Role is set incorrectly**
   - Role must be exactly `'admin'` (lowercase)
   - Not `'Admin'`, `'ADMIN'`, or any other variation

3. **RLS policies blocking the query**
   - RLS policies allow users to read their own record
   - If the record doesn't exist, the query returns null

4. **Session cache issue**
   - Browser may be caching old session data
   - Need to sign out and sign back in

## Solution Steps

### Step 1: Verify User Email
1. Make sure you're signed in with: `edward.ass.nyame@gmail.com`
2. Check the top-right of the application to confirm the email

### Step 2: Run the SQL Script

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Bean Boutique project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste this SQL:**

```sql
-- Step 1: Find the user in auth.users
SELECT 
  id, 
  email, 
  created_at
FROM auth.users 
WHERE email = 'edward.ass.nyame@gmail.com';
```

4. **Copy the user ID from the results** (it will look like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

5. **Run this SQL** (replace YOUR-USER-ID with the ID from step 4):

```sql
-- Step 2: Check if user exists in public.users
SELECT id, email, role FROM public.users WHERE email = 'edward.ass.nyame@gmail.com';

-- If the query above returns nothing, run this INSERT:
INSERT INTO public.users (id, email, role)
VALUES (
  'YOUR-USER-ID-HERE'::uuid,
  'edward.ass.nyame@gmail.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- If the user already exists, just update the role:
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'edward.ass.nyame@gmail.com';

-- Step 3: Verify the change
SELECT id, email, role FROM public.users WHERE email = 'edward.ass.nyame@gmail.com';
```

6. **Verify** the last query shows `role: admin`

### Step 3: Create Profile (if needed)

```sql
-- Check if profile exists
SELECT * FROM public.profiles WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'edward.ass.nyame@gmail.com'
);

-- If no profile exists, create one:
INSERT INTO public.profiles (user_id, full_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'edward.ass.nyame@gmail.com'),
  'Edward Nyame'
)
ON CONFLICT (user_id) DO NOTHING;
```

### Step 4: Clear Session and Re-login

1. **In the application:**
   - Click "Sign Out" (top-right)
   - Close the browser tab completely
   - Open a new tab
   - Navigate to your application
   - Sign in with `edward.ass.nyame@gmail.com`

2. **Try accessing Admin Dashboard again**

### Step 5: Use the Debugger

If still getting access denied:

1. Go to Admin Dashboard (you'll see the access denied page)
2. Click "Show Debugger" button
3. Review all the diagnostic checks
4. Look for any failures or errors
5. Check your browser console (F12) for detailed logs

## Quick Fix Script

Use the `SET_ADMIN_USER.sql` file provided in the project root:

1. Open `SET_ADMIN_USER.sql`
2. Find all instances of `'edward.ass.nyame@gmail.com'`
3. Replace with your actual email if different
4. Copy the entire file
5. Paste into Supabase SQL Editor
6. Run it
7. Sign out and sign back in

## Verification

After following the steps above, you should see:

✅ Console log: `✅ ADMIN ACCESS GRANTED - User: edward.ass.nyame@gmail.com, Role: admin`
✅ Admin Dashboard loads successfully
✅ All admin tabs are accessible

## Common Issues

### Issue: "User not found in users table"
**Fix:** Run the INSERT query from Step 2

### Issue: "Role is 'user' not 'admin'"
**Fix:** Run the UPDATE query from Step 2

### Issue: "Permission denied for table users"
**Fix:** Make sure you're running the SQL in Supabase SQL Editor (not from the app)

### Issue: Still getting access denied after all steps
**Fix:** 
1. Check browser console for error messages
2. Use the Admin Access Debugger
3. Verify RLS policies are set correctly
4. Try a different browser
5. Clear all cookies and cache

## Alternative Method: Use Supabase Dashboard UI

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user `edward.ass.nyame@gmail.com`
3. Copy the User ID
4. Go to Table Editor → `users` table
5. Find or create a row with that User ID
6. Set `role` column to `admin`
7. Click Save
8. Sign out and sign back in

## Need More Help?

Check these files:
- `/TROUBLESHOOTING_GUIDE.md` - General troubleshooting
- `/DATABASE_QUICK_REFERENCE.md` - Database schema info
- Browser console (F12) for detailed error logs

The debugger component will show exactly which step is failing!
