-- ========================================
-- FIX: Infinite Recursion in RLS Policies
-- ========================================
-- This fixes the "infinite recursion detected in policy for relation users" error
-- The problem: Admin check policy queries users table, which triggers RLS again

-- ========================================
-- STEP 1: DROP EXISTING PROBLEMATIC POLICIES
-- ========================================

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Drop similar policies on other tables
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- ========================================
-- STEP 2: CREATE HELPER FUNCTION (bypasses RLS)
-- ========================================

-- This function checks if the current user is an admin
-- SECURITY DEFINER means it runs with the privileges of the function owner (bypassing RLS)
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- ========================================
-- STEP 3: RECREATE POLICIES USING THE FUNCTION
-- ========================================

-- Users table policies
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all users"
ON public.users FOR UPDATE
USING (public.is_admin());

-- Profiles table policies
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- Products table policies
CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
USING (public.is_admin());

-- Orders table policies (admin access)
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE
USING (public.is_admin());

-- Events table policies (admin access)
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events"
ON public.events FOR INSERT
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
ON public.events FOR UPDATE
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
ON public.events FOR DELETE
USING (public.is_admin());

-- Reviews table policies (admin access)
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
USING (public.is_admin());

-- Offers table policies (admin access)
DROP POLICY IF EXISTS "Admins can manage offers" ON public.offers;
CREATE POLICY "Admins can manage offers"
ON public.offers FOR ALL
USING (public.is_admin());

-- Promotions table policies (admin access)
DROP POLICY IF EXISTS "Admins can manage promotions" ON public.promotions;
CREATE POLICY "Admins can manage promotions"
ON public.promotions FOR ALL
USING (public.is_admin());

-- Blog posts table policies (admin access)
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts FOR ALL
USING (public.is_admin());

-- Banners table policies (admin access)
DROP POLICY IF EXISTS "Admins can manage banners" ON public.banners;
CREATE POLICY "Admins can manage banners"
ON public.banners FOR ALL
USING (public.is_admin());

-- ========================================
-- STEP 4: SET ADMIN USER
-- ========================================
-- Replace with your actual email address

-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'admin@multistore.com';

-- Then insert/update the user record with admin role
-- (Replace YOUR-USER-ID with the ID from the query above)

INSERT INTO public.users (id, email, role)
VALUES (
  '8c1d0529-7bb4-4bc1-8232-ca76c8289481'::uuid,
  'admin@multistore.com',
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- Create profile if needed
INSERT INTO public.profiles (user_id, full_name)
VALUES (
  '8c1d0529-7bb4-4bc1-8232-ca76c8289481'::uuid,
  'Admin User'
)
ON CONFLICT (user_id) DO NOTHING;

-- ========================================
-- STEP 5: VERIFY EVERYTHING WORKS
-- ========================================

-- Check the function works
SELECT public.is_admin();  -- Should return true for admin users, false for others

-- Verify user is admin
SELECT id, email, role FROM public.users WHERE email = 'admin@multistore.com';
-- Should show: role = 'admin'

-- List all policies (optional - to verify they're created)
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- ========================================
-- EXPECTED RESULT
-- ========================================
-- ✅ No more "infinite recursion" errors
-- ✅ User can query their own record in users table
-- ✅ Admin users can query all records
-- ✅ is_admin() function returns true for admin users
-- ========================================

-- ========================================
-- TROUBLESHOOTING
-- ========================================

-- If you still get errors, try this:
-- 1. Make sure the user exists in BOTH auth.users AND public.users
-- 2. Make sure role is exactly 'admin' (lowercase)
-- 3. Sign out and sign back in
-- 4. Clear browser cache

-- To check if function exists:
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'is_admin';

-- To manually test the function as a specific user:
-- (This won't work from SQL editor, but helps understand the logic)
-- SELECT public.is_admin();
