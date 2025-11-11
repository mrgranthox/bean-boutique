# ⚡ RUN THIS NOW - Fix Infinite Recursion Error

## Your Error
```
"infinite recursion detected in policy for relation users"
```

## Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" → "New query"

### Step 2: Copy and Run This SQL

```sql
-- Fix the infinite recursion by creating a helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- Drop and recreate the problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Recreate policies using the safe function
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all users"
ON public.users FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
USING (public.is_admin());

-- Set your user as admin
-- ⚠️ CHANGE THE EMAIL BELOW TO YOUR ACTUAL EMAIL ⚠️
INSERT INTO public.users (id, email, role)
VALUES (
  '8c1d0529-7bb4-4bc1-8232-ca76c8289481'::uuid,
  'admin@multistore.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Create profile
INSERT INTO public.profiles (user_id, full_name)
VALUES (
  '8c1d0529-7bb4-4bc1-8232-ca76c8289481'::uuid,
  'Admin User'
)
ON CONFLICT (user_id) DO NOTHING;
```

### Step 3: Verify

Run this to confirm:

```sql
-- Should return true for admin users
SELECT public.is_admin();

-- Should show role = 'admin'
SELECT email, role FROM public.users WHERE email = 'admin@multistore.com';
```

### Step 4: Test in App

1. **Sign out** of Bean Boutique
2. **Close the browser tab**
3. **Open a new tab**
4. **Sign in** with admin@multistore.com
5. **Go to Admin Dashboard**
6. ✅ **Should work!**

## What This Does

- Creates a special function that bypasses RLS (prevents infinite loop)
- Updates all admin policies to use this safe function
- Sets your user as admin
- Creates your profile

## If You Get Any Errors

The script is safe to run multiple times. Just run it again.

## More Details

See `/🔥_CRITICAL_FIX_RLS_RECURSION_🔥.md` for full explanation.

## That's It!

After running this SQL and signing out/in, admin access will work perfectly.
