# ⚡ QUICK FIX: Admin Access for edward.ass.nyame@gmail.com

## TL;DR - Fast Solution

Run this SQL in your Supabase SQL Editor:

```sql
-- Step 1: Get user ID
SELECT id FROM auth.users WHERE email = 'edward.ass.nyame@gmail.com';

-- Step 2: Copy the ID, replace YOUR-USER-ID below, and run:

INSERT INTO public.users (id, email, role)
VALUES (
  'YOUR-USER-ID'::uuid,
  'edward.ass.nyame@gmail.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

INSERT INTO public.profiles (user_id, full_name)
VALUES (
  'YOUR-USER-ID'::uuid,
  'Edward Nyame'
)
ON CONFLICT (user_id) DO NOTHING;

-- Step 3: Verify
SELECT u.email, u.role, p.full_name 
FROM public.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE u.email = 'edward.ass.nyame@gmail.com';
```

**Then:**
1. Sign out of the app
2. Sign back in
3. Go to Admin Dashboard
4. ✅ Access granted!

---

## Still Not Working?

### Check These:

1. **Role is lowercase 'admin' not 'Admin' or 'ADMIN'**
   ```sql
   UPDATE public.users SET role = 'admin' 
   WHERE email = 'edward.ass.nyame@gmail.com';
   ```

2. **User exists in both tables**
   ```sql
   -- Check auth.users
   SELECT id, email FROM auth.users 
   WHERE email = 'edward.ass.nyame@gmail.com';
   
   -- Check public.users
   SELECT id, email, role FROM public.users 
   WHERE email = 'edward.ass.nyame@gmail.com';
   ```

3. **Clear browser cache and sign out/in**

4. **Check browser console** (F12) for error messages

---

## Use the Debugger

Go to Admin Dashboard → Click "Show Debugger"

It will tell you exactly what's wrong!

---

## More Help

- `/ADMIN_ACCESS_FIX.md` - Complete guide
- `/SET_ADMIN_USER.sql` - Step-by-step SQL script
- `/🔧_ADMIN_ACCESS_FIXED_🔧.md` - Full documentation
