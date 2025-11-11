# Troubleshooting Guide

## Issues Resolved ✅

### 1. ReferenceError: equipment is not defined
**Status:** FIXED ✅

**Problem:** BrewingEquipmentPage.tsx was referencing an undefined variable `equipment` on lines 617, 630, and 642.

**Solution:** Replaced all instances of `equipment` with the correct variable `allProducts`.

---

## Current Issues & Solutions

### 2. Products Not Showing on Homepage

**Possible Causes:**

#### A. Database Not Seeded
The database tables exist but contain no data.

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Open the file `/SEED_DATA.sql`
3. Copy the entire contents
4. Paste into SQL Editor
5. Click "Run"
6. Verify data by running:
   ```sql
   SELECT COUNT(*) FROM products;
   ```
   You should see at least 10 products.

#### B. RLS Policies Blocking Access
Even though the migration sets `"Anyone can read products"`, there might be an issue.

**Solution - Verify RLS Policies:**
```sql
-- Check if products table has RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'products';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'products';
```

**Solution - Temporarily Disable RLS (for testing only):**
```sql
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
```

**Note:** Re-enable RLS after testing:
```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
```

#### C. Service Client Configuration
The server uses a service client which bypasses RLS, so this should work.

**Solution - Verify Environment Variables:**
In Supabase Dashboard → Settings → Edge Functions:
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY  
- ✅ SUPABASE_SERVICE_ROLE_KEY

#### D. Products API Not Returning Data

**Solution - Test the API:**
Open browser console and run:
```javascript
fetch('https://[YOUR-PROJECT-ID].supabase.co/functions/v1/make-server-4d0792a7/products', {
  headers: {
    'Authorization': 'Bearer [YOUR-ANON-KEY]'
  }
})
.then(r => r.json())
.then(console.log)
```

Expected response:
```json
{
  "products": [...],
  "pagination": {...}
}
```

---

### 3. OAuth (Google & GitHub) Not Working

**Status:** Requires User Configuration

**Problem:** OAuth providers must be manually configured in Supabase Dashboard.

**Solution for Google OAuth:**

1. Go to Supabase Dashboard → Authentication → Providers
2. Click on "Google"
3. Enable the provider
4. Follow the setup guide: https://supabase.com/docs/guides/auth/social-login/auth-google
   - Create Google OAuth credentials
   - Set authorized redirect URI: `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
5. Save configuration
6. Test by clicking "Sign in with Google" button

**Solution for GitHub OAuth:**

1. Go to Supabase Dashboard → Authentication → Providers
2. Click on "GitHub"  
3. Enable the provider
4. Follow the setup guide: https://supabase.com/docs/guides/auth/social-login/auth-github
   - Go to GitHub Settings → Developer Settings → OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL: `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
5. Save configuration
6. Test by clicking "Sign in with GitHub" button

**Common OAuth Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Provider not enabled" | OAuth provider not configured | Follow setup guide above |
| "redirect_uri mismatch" | Wrong callback URL | Update callback URL in provider settings |
| "Invalid client" | Wrong Client ID/Secret | Re-check credentials in Supabase |
| "Popup blocked" | Browser blocked popup | Allow popups for your site |

---

### 4. Access Control Issues

**Problem:** Users cannot access data they should be able to access.

**Diagnosis:**

Check what user role is set:
```sql
SELECT id, email, role FROM public.users WHERE email = 'user@example.com';
```

Check if user record exists:
```sql
-- This query should return the user
SELECT * FROM public.users WHERE id = auth.uid();
```

**Solution - Create Missing User Records:**

If a user signed up but doesn't have a record in `public.users`:

```sql
-- Insert user record (replace with actual user ID and email)
INSERT INTO public.users (id, email, role)
VALUES ('user-uuid-here', 'user@example.com', 'user')
ON CONFLICT (id) DO NOTHING;

-- Create profile
INSERT INTO public.profiles (user_id, full_name)
VALUES ('user-uuid-here', 'User Name')
ON CONFLICT (user_id) DO NOTHING;
```

**Solution - Grant Admin Access:**

To make a user an admin:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

**Solution - Fix RLS Policies:**

If policies are blocking legitimate access, review:
```sql
-- View all RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## Common Debugging Steps

### Step 1: Check Backend Health

Open browser console:
```javascript
fetch('https://[YOUR-PROJECT-ID].supabase.co/functions/v1/make-server-4d0792a7/health', {
  headers: { 'Authorization': 'Bearer [YOUR-ANON-KEY]' }
})
.then(r => r.json())
.then(console.log)
```

Expected: `{ "status": "ok", "timestamp": "..." }`

### Step 2: Check Database Connection

In Supabase Dashboard → SQL Editor:
```sql
SELECT version();
```

Should return PostgreSQL version.

### Step 3: Check Product Count

```sql
SELECT COUNT(*) as total_products FROM public.products;
```

If 0, you need to run SEED_DATA.sql.

### Step 4: Check User Authentication

In browser console:
```javascript
import { supabase } from './utils/supabase/client';
const { data } = await supabase.auth.getSession();
console.log('Current user:', data.session?.user);
```

### Step 5: Enable Detailed Logging

In the application, check browser console for:
- ✅ Backend health check results
- ✅ API call logs
- ✅ Data manager initialization
- ✅ Product fetch results

Look for errors marked with ⚠️ or ❌

---

## Quick Fixes

### Clear Cache
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Reset Data Manager
```javascript
// In browser console  
import { dataManager } from './utils/data-manager';
dataManager.clearCache();
location.reload();
```

### Force Backend Re-check
```javascript
// In browser console
import { dataManager } from './utils/data-manager';
await dataManager.checkBackendHealth(true);
```

---

## Getting Help

If issues persist:

1. **Check Browser Console** - Look for error messages
2. **Check Supabase Logs** - Dashboard → Logs → Edge Functions
3. **Verify SQL Files** - Make sure MIGRATION.sql and SEED_DATA.sql were run
4. **Check Environment** - Verify all environment variables are set
5. **Test Endpoints** - Use the API testing commands above

For OAuth issues, always start by verifying the provider is:
1. ✅ Enabled in Supabase Dashboard
2. ✅ Properly configured with Client ID and Secret
3. ✅ Has correct redirect URI

---

## Success Checklist

Before considering the app "working", verify:

- ✅ Health check returns OK
- ✅ Products appear on homepage
- ✅ Product pages load correctly
- ✅ Equipment pages load correctly
- ✅ Can add items to cart
- ✅ Can sign up new user
- ✅ Can sign in existing user
- ✅ Can sign out
- ✅ OAuth providers work (if configured)
- ✅ Admin dashboard accessible (for admin users)
- ✅ Orders can be placed
- ✅ Events can be viewed
- ✅ Subscriptions can be created

---

## Migration & Seed Data Execution Order

Always run in this order:

1. **MIGRATION.sql** - Creates tables and RLS policies
2. **SEED_DATA.sql** - Populates tables with initial data
3. Verify data with: `SELECT COUNT(*) FROM products;`

**Never run migrations multiple times** unless you drop tables first, as this will cause constraint errors.
