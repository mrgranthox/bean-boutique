# 🚨 IMPORTANT: Run This First!

## You're not seeing database changes because you need to manually execute the SQL files in Supabase.

### Step 1: Run Database Migration (5 minutes)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Bean Boutique project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Migration**
   - Open the file `/MIGRATION.sql` in this project
   - Copy the ENTIRE file contents (all 750+ lines)
   - Paste into the Supabase SQL Editor
   - Click "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for "Success. No rows returned" message
   - ✅ This creates all 13 tables, indexes, and RLS policies

4. **Run Seed Data**
   - Click "New Query" again in SQL Editor
   - Open the file `/SEED_DATA.sql` in this project
   - Copy the ENTIRE file contents (all 500+ lines)
   - Paste into the Supabase SQL Editor
   - Click "Run" button
   - Wait for "Success" message
   - ✅ This adds 16 products, 6 events, blog posts, etc.

5. **Verify Tables Created**
   - Click "Table Editor" in left sidebar
   - You should see 13 new tables:
     - users
     - profiles
     - products
     - reviews
     - orders
     - order_items
     - events
     - event_registrations
     - subscriptions
     - carts
     - promotions
     - offers
     - blog_posts
     - banners

6. **Create Your Admin Account**
   - Sign up in your app with your email
   - Go back to Supabase SQL Editor
   - Run this query (replace with YOUR email):
   ```sql
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```
   - ✅ You now have admin access!

### Step 2: Deploy Backend (if needed)

If you haven't deployed the updated Edge Function:

```bash
supabase functions deploy make-server-4d0792a7
```

### Step 3: Test Everything

1. Refresh your Bean Boutique app
2. You should see 16 products (8 coffee + 8 equipment)
3. You should see 6 events
4. Sign in with your admin account
5. Navigate to Admin Dashboard
6. ✅ Everything should now work with real data!

---

## 🆘 Troubleshooting

**"Relation already exists" error:**
- Tables might exist from a previous setup
- Solution: Drop and recreate (see DATABASE_SETUP_GUIDE.md)

**"No products showing":**
- Make sure you ran SEED_DATA.sql
- Check: `SELECT COUNT(*) FROM products;` (should return 16)

**"Can't access admin dashboard":**
- Make sure you updated your user role to 'admin'
- Sign out and sign back in after changing role

---

## 📚 More Help

- Detailed setup: `/DATABASE_SETUP_GUIDE.md`
- SQL queries: `/DATABASE_QUICK_REFERENCE.md`
- Full guide: `/README.md`

**Do these steps NOW before the admin dashboard will work with real data!**