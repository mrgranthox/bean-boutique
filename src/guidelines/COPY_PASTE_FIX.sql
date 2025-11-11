-- ========================================
-- COPY/PASTE FIX - Run this entire script
-- ========================================
-- This will fix ALL admin access issues

-- Step 1: Create the safe is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- Step 2: Fix all the policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

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

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE
USING (public.is_admin());

-- Step 3: Set your user as admin
-- Make sure your user exists and has admin role
INSERT INTO public.users (id, email, role)
VALUES (
  '8c1d0529-7bb4-4bc1-8232-ca76c8289481'::uuid,
  'admin@multistore.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Create profile if needed
INSERT INTO public.profiles (user_id, full_name)
VALUES (
  '8c1d0529-7bb4-4bc1-8232-ca76c8289481'::uuid,
  'Admin User'
)
ON CONFLICT (user_id) DO NOTHING;

-- Step 4: Verify everything
SELECT 
  'Function exists:' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'is_admin'
  ) as result;

SELECT 
  'User is admin:' as check_type,
  email,
  role
FROM public.users
WHERE email = 'admin@multistore.com';

SELECT 
  'Can query users table:' as check_type,
  COUNT(*) as user_count
FROM public.users;

-- If this script runs without errors, you're done!
-- Now:
-- 1. Sign out of the application
-- 2. Clear browser cache
-- 3. Sign in again
-- 4. Admin access should work!
