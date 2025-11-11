# 🔥 CRITICAL FIX: Infinite Recursion in RLS Policies

## The Problem

You're getting this error:
```
"infinite recursion detected in policy for relation \"users\""
```

### Why This Happens

The RLS (Row Level Security) policies have a **circular dependency**:

1. User tries to query the `users` table
2. RLS policy checks: "Is this user an admin?"
3. To check if admin, the policy queries the `users` table: `SELECT role FROM users WHERE id = auth.uid()`
4. This triggers RLS again → checks "Is this user an admin?"
5. Which queries `users` table again → **INFINITE LOOP** 💥

### The Original Problematic Policy

```sql
-- ❌ THIS CAUSES INFINITE RECURSION
create policy "Admins can view all users"
on public.users for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  -- ↑ This queries users table, which triggers RLS, which queries users table...
);
```

## The Solution

Create a **SECURITY DEFINER function** that bypasses RLS:

```sql
-- ✅ THIS WORKS - Bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER  -- This is the magic! Bypasses RLS
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;
```

Then use the function in policies:

```sql
-- ✅ THIS WORKS - Uses function that bypasses RLS
create policy "Admins can view all users"
on public.users for select
using (public.is_admin());
```

## Quick Fix Steps

### Step 1: Run the SQL Script

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire content of `/FIX_RLS_INFINITE_RECURSION.sql`
3. **IMPORTANT**: Replace the email and user ID with yours:
   - Change `'admin@multistore.com'` to your email
   - Change `'8c1d0529-7bb4-4bc1-8232-ca76c8289481'` to your user ID
4. Run the script

### Step 2: Verify It Worked

Run this query:

```sql
-- Should return true if you're an admin
SELECT public.is_admin();

-- Should show your user with role = 'admin'
SELECT id, email, role FROM public.users WHERE email = 'admin@multistore.com';
```

### Step 3: Test in the App

1. **Sign out** of the application
2. **Close the browser tab** completely
3. **Open a new tab**
4. **Sign in** again with `admin@multistore.com`
5. **Go to Admin Dashboard**
6. ✅ Should work now!

## What the Script Does

1. **Drops all problematic policies** that cause recursion
2. **Creates the `is_admin()` function** with `SECURITY DEFINER`
3. **Recreates all policies** using the safe function
4. **Sets your user as admin**
5. **Creates your profile**

## Verification Commands

After running the script, verify with these commands:

```sql
-- 1. Check function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'is_admin';
-- Should return: is_admin

-- 2. Check user is admin
SELECT email, role FROM public.users WHERE email = 'admin@multistore.com';
-- Should return: role = 'admin'

-- 3. Check policies are correct
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'users' 
AND policyname LIKE '%Admins%';
-- Should return policies without "infinite recursion" error

-- 4. Test querying users table (should work now)
SELECT id, email, role FROM public.users WHERE id = auth.uid();
-- Should return your user record
```

## Why SECURITY DEFINER Works

- **Normal function**: Runs with the permissions of the **calling user** → triggers RLS
- **SECURITY DEFINER**: Runs with the permissions of the **function owner** → **bypasses RLS**

This breaks the circular dependency because the function can query the users table without triggering RLS policies.

## If It Still Doesn't Work

### Check 1: User Exists in Both Tables

```sql
-- Check auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@multistore.com';

-- Check public.users  
SELECT id, email, role FROM public.users WHERE email = 'admin@multistore.com';
```

Both should return a result. If `public.users` is empty, run:

```sql
INSERT INTO public.users (id, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@multistore.com'),
  'admin@multistore.com',
  'admin'
);
```

### Check 2: Role is Lowercase

```sql
-- Must be 'admin' not 'Admin' or 'ADMIN'
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@multistore.com';
```

### Check 3: Function Has Correct Permissions

```sql
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
```

### Check 4: Clear Browser Cache

1. Sign out
2. Clear browser cache (Ctrl+Shift+Delete)
3. Close all tabs
4. Open new browser window
5. Sign in again

## Technical Details

### What is SECURITY DEFINER?

From PostgreSQL docs:
> SECURITY DEFINER specifies that the function is to be executed with the privileges of the user that owns it.

This means:
- Function owner = your Supabase database owner
- Database owner has full access (bypasses RLS)
- Function queries users table directly
- No RLS policies are triggered
- No infinite recursion!

### Security Considerations

The `is_admin()` function is safe because:
1. It only checks the current authenticated user (`auth.uid()`)
2. It only returns a boolean (true/false)
3. It doesn't expose sensitive data
4. It doesn't accept parameters that could be exploited

## Alternative Solutions

If you prefer not to use SECURITY DEFINER, you could:

### Option 1: Use a separate admin_users table

```sql
CREATE TABLE admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id)
);

-- No RLS needed on this table
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Policy becomes:
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
```

### Option 2: Use JWT claims (requires custom auth hook)

Store admin status in JWT claims and check with `auth.jwt() ->> 'role' = 'admin'`

But the SECURITY DEFINER function is the **simplest and most reliable solution**.

## Summary

✅ **Root cause**: RLS policies querying the same table they protect
✅ **Solution**: Create function with SECURITY DEFINER to bypass RLS
✅ **Script**: `/FIX_RLS_INFINITE_RECURSION.sql`
✅ **Result**: No more infinite recursion errors

After running the fix script and signing out/in, your admin access should work perfectly!
