# Quick Setup & Fixes Applied

## ✅ Issues Fixed

### 1. ReferenceError: equipment is not defined
**Fixed in:** `/components/pages/BrewingEquipmentPage.tsx`

**Changes:**
- Replaced all instances of undefined `equipment` variable with `allProducts`
- Fixed type annotations to use `typeof allProducts[0]`
- Lines updated: 202, 217, 617, 630, 642

**Status:** ✅ FIXED - No more equipment undefined errors

---

## ⚠️ Issues Requiring User Action

### 2. Products Not Showing on Homepage

**Most Likely Cause:** Database has no products

**Required Action:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Open `/SEED_DATA.sql` file in your project
4. Copy the entire SQL content
5. Paste into Supabase SQL Editor
6. Click "Run"
7. Verify with: `SELECT COUNT(*) FROM products;`

**Expected Result:** Should see at least 10-15 products

**Why This Happens:**
The MIGRATION.sql creates the tables, but SEED_DATA.sql adds the actual products. Without seed data, the database is empty.

**Testing:**
After running SEED_DATA.sql:
- Refresh homepage
- Should see 3 featured products
- Browse to Coffee Selection page - should see products
- Browse to Equipment page - should see equipment

---

### 3. OAuth (Google & GitHub) Not Working

**Status:** Requires manual configuration in Supabase Dashboard

**This is NORMAL** - OAuth requires you to set up OAuth apps with Google/GitHub

#### Google OAuth Setup:

1. **Enable in Supabase:**
   - Dashboard → Authentication → Providers → Google
   - Toggle "Enable Google provider"

2. **Create Google OAuth App:**
   - Go to https://console.cloud.google.com/
   - Create new project or select existing
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Add to Supabase:**
   - Paste Client ID and Client Secret in Supabase Google provider settings
   - Save

4. **Test:**
   - Click "Sign in with Google" button
   - Should redirect to Google login
   - After login, redirects back to app

**Full Guide:** https://supabase.com/docs/guides/auth/social-login/auth-google

#### GitHub OAuth Setup:

1. **Enable in Supabase:**
   - Dashboard → Authentication → Providers → GitHub
   - Toggle "Enable GitHub provider"

2. **Create GitHub OAuth App:**
   - Go to GitHub Settings → Developer Settings → OAuth Apps
   - Click "New OAuth App"
   - Homepage URL: Your app URL
   - Authorization callback URL: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Add to Supabase:**
   - Paste Client ID and Client Secret in Supabase GitHub provider settings
   - Save

4. **Test:**
   - Click "Sign in with GitHub" button
   - Should redirect to GitHub authorization
   - After authorization, redirects back to app

**Full Guide:** https://supabase.com/docs/guides/auth/social-login/auth-github

**Note:** OAuth is optional. Email/password authentication works without any configuration.

---

### 4. Access Control / RLS Issues

**Status:** Should be working, but here's how to verify

**Verify RLS Policies:**

```sql
-- Check products table RLS
SELECT * FROM pg_policies WHERE tablename = 'products';
```

**Expected:** Should see policy `"Anyone can read products"` with `qual = true`

**If Products Still Won't Load:**

Option A - Verify Service Client (Recommended):
```sql
-- Make sure products exist
SELECT COUNT(*) FROM products;

-- If 0, run SEED_DATA.sql
```

Option B - Temporarily Disable RLS (Testing Only):
```sql
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
```

**After testing, re-enable:**
```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
```

**Important:** The server uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS, so products endpoint should work regardless of RLS policies.

---

## Improved Error Handling

### HomePage Error Messages

**New behavior:**
- ✅ Shows loading spinner while fetching
- ✅ Shows helpful error if backend unavailable
- ✅ Shows specific error if database is empty (needs SEED_DATA.sql)
- ✅ Toast notifications guide users to solutions
- ❌ No longer shows fallback mock data (confusing)

**Error Messages You Might See:**

| Error | Meaning | Solution |
|-------|---------|----------|
| "Database is empty" | No products in database | Run SEED_DATA.sql |
| "Cannot connect to backend" | Backend health check failed | Check backend is deployed |
| "Backend has no data" | Backend works but tables empty | Run MIGRATION.sql then SEED_DATA.sql |
| "No featured products available" | Products exist but none marked as featured | Check featured flag in products |

---

## Testing Checklist

After applying fixes and running SEED_DATA.sql:

### Basic Functionality
- ✅ Homepage loads without errors
- ✅ Featured products appear on homepage
- ✅ Coffee Selection page shows products
- ✅ Equipment page shows products
- ✅ Product detail pages load
- ✅ Can add items to cart
- ✅ Cart persists in localStorage

### Authentication
- ✅ Can sign up new user
- ✅ Can sign in with email/password
- ✅ Can sign out
- ⏭️ OAuth (optional - requires setup)

### Admin Features (requires admin user)
- ✅ Admin dashboard accessible
- ✅ Can view orders
- ✅ Can manage products
- ✅ Can view analytics

### Data Flow
- ✅ Backend health check passes
- ✅ Products API returns data
- ✅ Events API returns data  
- ✅ Cart operations work
- ✅ Orders can be created

---

## Common Issues After Setup

### "No products found"
- **Cause:** Didn't run SEED_DATA.sql
- **Fix:** Run SEED_DATA.sql in Supabase SQL Editor

### "Cannot add to cart"
- **Cause:** Product ID mismatch or cart localStorage issue
- **Fix:** Clear localStorage and refresh

### "OAuth provider not enabled"
- **Cause:** OAuth provider not configured in Supabase
- **Fix:** Follow OAuth setup guide above OR use email/password login

### "Unauthorized" errors
- **Cause:** RLS policies blocking access OR user not signed in
- **Fix:** Sign in first, then verify RLS policies

### Admin dashboard shows "Forbidden"
- **Cause:** User role is not 'admin'
- **Fix:** Update user role in database:
  ```sql
  UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
  ```

---

## Next Steps

1. **Run SEED_DATA.sql** if products aren't showing
2. **Test basic functionality** - browse products, add to cart
3. **Create an admin user** if needed:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
   ```
4. **Optional:** Set up OAuth providers if you want social login
5. **Review** `/TROUBLESHOOTING_GUIDE.md` for detailed debugging

---

## Files Updated

1. `/components/pages/BrewingEquipmentPage.tsx` - Fixed equipment undefined error
2. `/components/pages/HomePage.tsx` - Improved error handling and messages
3. `/TROUBLESHOOTING_GUIDE.md` - New comprehensive troubleshooting guide
4. `/QUICK_SETUP_FIXES.md` - This file

---

## Support Resources

- **Troubleshooting Guide:** `/TROUBLESHOOTING_GUIDE.md`
- **Database Setup:** `/DATABASE_SETUP_GUIDE.md`
- **Migration SQL:** `/MIGRATION.sql`
- **Seed Data:** `/SEED_DATA.sql`
- **Supabase Docs:** https://supabase.com/docs

---

## Summary

**What's Fixed:**
✅ equipment undefined error
✅ Better error messages
✅ Proper error handling
✅ Clear user guidance

**What You Need To Do:**
1. Run SEED_DATA.sql in Supabase (if products aren't showing)
2. Optional: Configure OAuth providers (if you want social login)
3. Optional: Set admin role for users who need admin access

**Everything else should work!** 🎉
