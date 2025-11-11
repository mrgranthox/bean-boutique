-- ========================================
-- SET ADMIN USER - Bean Boutique
-- ========================================
-- This script makes a specific user an admin
-- Replace 'edward.ass.nyame@gmail.com' with your email
-- ========================================

-- ========================================
-- STEP 1: VERIFY USER EXISTS IN AUTH
-- ========================================
-- This should return 1 row with the user's ID
SELECT 
  id, 
  email, 
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'edward.ass.nyame@gmail.com';

-- If no results: User doesn't exist in auth - sign up first!
-- If results: Copy the 'id' value for the next step


-- ========================================
-- STEP 2: CHECK PUBLIC.USERS TABLE
-- ========================================
-- This checks if the user record exists in the users table
SELECT 
  id, 
  email, 
  role, 
  created_at
FROM public.users 
WHERE email = 'edward.ass.nyame@gmail.com';

-- If no results: User record doesn't exist - proceed to Step 3
-- If results but role != 'admin': Proceed to Step 4


-- ========================================
-- STEP 3: CREATE USER RECORD (if missing)
-- ========================================
-- ⚠️ IMPORTANT: Replace 'PASTE-USER-ID-HERE' with the ID from Step 1
-- Uncomment the lines below and run:

-- INSERT INTO public.users (id, email, role)
-- VALUES (
--   'PASTE-USER-ID-HERE'::uuid,
--   'edward.ass.nyame@gmail.com',
--   'admin'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';


-- ========================================
-- STEP 4: UPDATE ROLE TO ADMIN
-- ========================================
-- This will set the role to 'admin' for existing users
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'edward.ass.nyame@gmail.com';

-- You should see: "UPDATE 1" in the results


-- ========================================
-- STEP 5: VERIFY THE CHANGE
-- ========================================
-- This should show role = 'admin'
SELECT 
  id, 
  email, 
  role, 
  created_at,
  updated_at
FROM public.users 
WHERE email = 'edward.ass.nyame@gmail.com';

-- ✅ Expected Result: role = 'admin' (lowercase)


-- ========================================
-- STEP 6: CHECK/CREATE PROFILE
-- ========================================
-- Check if profile exists
SELECT 
  user_id,
  full_name,
  phone,
  address
FROM public.profiles 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'edward.ass.nyame@gmail.com'
);

-- If no profile exists, create one:
INSERT INTO public.profiles (user_id, full_name)
SELECT 
  id,
  'Edward Nyame'  -- Change this to actual name
FROM auth.users 
WHERE email = 'edward.ass.nyame@gmail.com'
ON CONFLICT (user_id) DO NOTHING;


-- ========================================
-- STEP 7: VERIFY EVERYTHING
-- ========================================
-- This comprehensive query shows all related data
SELECT 
  u.id,
  u.email,
  u.role,
  p.full_name,
  u.created_at as user_created,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM public.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
LEFT JOIN auth.users au ON au.id = u.id
WHERE u.email = 'edward.ass.nyame@gmail.com';

-- ✅ You should see:
--    - role = 'admin'
--    - full_name populated
--    - email_confirmed_at not null


-- ========================================
-- QUICK FIX - ALL IN ONE
-- ========================================
-- If you want to do everything at once, run this:
-- (Still need to replace USER-ID-HERE with actual ID from Step 1)

-- WITH user_info AS (
--   SELECT id FROM auth.users WHERE email = 'edward.ass.nyame@gmail.com'
-- )
-- INSERT INTO public.users (id, email, role)
-- SELECT id, 'edward.ass.nyame@gmail.com', 'admin'
-- FROM user_info
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
-- 
-- INSERT INTO public.profiles (user_id, full_name)
-- SELECT id, 'Edward Nyame'
-- FROM (SELECT id FROM auth.users WHERE email = 'edward.ass.nyame@gmail.com') u
-- ON CONFLICT (user_id) DO NOTHING;


-- ========================================
-- ALTERNATIVE METHODS
-- ========================================

-- Set admin by user ID directly (if you know the UUID):
-- UPDATE public.users SET role = 'admin' WHERE id = 'your-user-id-here'::uuid;

-- Set multiple admins at once:
-- UPDATE public.users SET role = 'admin' 
-- WHERE email IN (
--   'admin1@example.com', 
--   'admin2@example.com',
--   'edward.ass.nyame@gmail.com'
-- );

-- List all admin users:
-- SELECT id, email, role, created_at FROM public.users WHERE role = 'admin';

-- List all users with their roles:
-- SELECT 
--   u.id, 
--   u.email, 
--   u.role,
--   p.full_name,
--   au.last_sign_in_at
-- FROM public.users u
-- LEFT JOIN public.profiles p ON p.user_id = u.id
-- LEFT JOIN auth.users au ON au.id = u.id
-- ORDER BY u.created_at DESC;


-- ========================================
-- AFTER RUNNING THIS SCRIPT
-- ========================================
-- 1. Verify the output shows role = 'admin'
-- 2. Sign out of the application
-- 3. Close the browser tab completely
-- 4. Open a new tab and navigate to the app
-- 5. Sign in with edward.ass.nyame@gmail.com
-- 6. Navigate to Admin Dashboard
-- 7. Access should be granted!
-- ========================================
