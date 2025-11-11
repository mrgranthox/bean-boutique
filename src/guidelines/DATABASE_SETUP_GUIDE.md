# Bean Boutique - Database Setup Guide

This guide will walk you through setting up the complete database for Bean Boutique from scratch.

## 📋 Prerequisites

- Supabase account (free tier works fine)
- Supabase project created
- Project URL and API keys configured in `/utils/supabase/info.tsx`

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Database Schema

1. Open your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `/MIGRATION.sql` file
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for "Success" message

**What this does:**
- Creates 13 tables with proper relationships
- Sets up Row Level Security (RLS) policies
- Creates indexes for performance
- Adds triggers for automatic timestamps
- Creates functions for data integrity

### Step 2: Seed Initial Data

1. In SQL Editor, click **New Query** again
2. Copy the entire contents of `/SEED_DATA.sql` file
3. Paste into the SQL editor
4. Click **Run**
5. Wait for "Success" message

**What this adds:**
- 8 coffee products (Ethiopian, Colombian, Kenyan, etc.)
- 8 brewing equipment items (espresso machines, grinders, etc.)
- 6 upcoming events (workshops and tastings)
- 4 blog posts about coffee
- 3 active promotional offers
- 3 homepage carousel banners

### Step 3: Create Your Admin Account

1. Go to your Bean Boutique application
2. Click **Sign Up** and create an account with your email
3. Go back to Supabase SQL Editor
4. Run this query (replace with your email):

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

5. Sign out and sign back in to apply admin privileges
6. You should now see the **Admin Dashboard** option

### Step 4: Deploy Edge Function

1. Install Supabase CLI if you haven't:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy the server function:
```bash
supabase functions deploy make-server-4d0792a7
```

### Step 5: Verify Everything Works

1. Open your application
2. Browse coffee products - you should see 8 products
3. Check events - you should see 6 upcoming events
4. Try adding items to cart
5. Create a test order
6. As admin, check the Admin Dashboard

## 📊 Database Tables Overview

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, email, role |
| `profiles` | User profiles | user_id, full_name, addresses |
| `products` | Coffee & equipment | name, price, category, stock |
| `orders` | Customer orders | user_id, total, status |
| `order_items` | Order line items | order_id, product_id, quantity |
| `reviews` | Product reviews | product_id, user_id, rating |
| `events` | Workshops | title, event_date, capacity |
| `event_registrations` | Event signups | event_id, user_id |
| `subscriptions` | Coffee subscriptions | user_id, plan_id, status |
| `carts` | Shopping carts | user_id, items (jsonb) |
| `promotions` | Promo codes | code, discount_value |
| `offers` | Product offers | product_id, discount_percent |
| `blog_posts` | Blog articles | title, content, published |
| `banners` | Homepage carousel | image_url, title, active |

### Table Relationships

```
users (1) ──< profiles (1)
users (1) ──< orders (many)
users (1) ──< reviews (many)
users (1) ──< event_registrations (many)
users (1) ──< subscriptions (many)
users (1) ──< carts (1)

products (1) ──< order_items (many)
products (1) ──< reviews (many)
products (1) ──< offers (many)

orders (1) ──< order_items (many)

events (1) ──< event_registrations (many)
```

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### Public Read Access
- Products (all users can view)
- Events (all users can view)
- Blog posts (published only)
- Offers & Promotions (active only)
- Reviews (all users can view)

### User Access
- Users can view/update their own profile
- Users can view/create their own orders
- Users can manage their own cart
- Users can create reviews for products
- Users can register for events
- Users can manage their own subscriptions

### Admin Access
- Admins can view all users
- Admins can create/edit/delete products
- Admins can manage all orders
- Admins can create/edit/delete events
- Admins can manage blog posts, offers, banners

## 🛠️ Troubleshooting

### Migration Fails

**Error: "relation already exists"**
- Tables might already exist from a previous setup
- Solution: Drop all tables first:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
- Then run MIGRATION.sql again

**Error: "permission denied"**
- You might not have proper permissions
- Solution: Ensure you're the project owner or have admin access

### Seed Data Fails

**Error: "duplicate key value"**
- Seed data might have been inserted already
- Solution: Check if products exist:
```sql
SELECT COUNT(*) FROM public.products;
```
- If data exists, skip seeding or delete first:
```sql
DELETE FROM public.products;
DELETE FROM public.events;
DELETE FROM public.blog_posts;
DELETE FROM public.offers;
DELETE FROM public.promotions;
DELETE FROM public.banners;
```

### Admin Access Not Working

**Can't see Admin Dashboard**
- Verify admin role:
```sql
SELECT email, role FROM public.users WHERE email = 'your-email@example.com';
```
- If role is 'user', update it:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```
- Sign out and sign back in

### Products Not Showing

**Application shows "No products found"**

1. Check if products exist in database:
```sql
SELECT COUNT(*) FROM public.products;
```

2. Check RLS policies:
```sql
-- Test if you can read products
SELECT * FROM public.products LIMIT 1;
```

3. Check backend connection:
- Look for backend status indicator in bottom-right corner
- Should show green "Backend Connected"
- If red, check Edge Function deployment

### Edge Function Deployment Issues

**Error: "Function not found"**
- Deploy the function:
```bash
supabase functions deploy make-server-4d0792a7
```

**Error: "Environment variables not set"**
- Ensure Supabase sets these automatically:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## 📝 Database Maintenance

### Regular Tasks

**Weekly:**
- Check for abandoned carts
- Review order statuses
- Monitor event registrations

**Monthly:**
- Archive old orders
- Clean up expired promotions
- Review product stock levels

### Useful Queries

**Active orders:**
```sql
SELECT COUNT(*), status 
FROM public.orders 
GROUP BY status;
```

**Popular products:**
```sql
SELECT p.name, COUNT(oi.id) as times_ordered
FROM public.products p
LEFT JOIN public.order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY times_ordered DESC
LIMIT 10;
```

**Revenue summary:**
```sql
SELECT 
  SUM(total) as total_revenue,
  COUNT(*) as total_orders,
  AVG(total) as average_order_value
FROM public.orders
WHERE status != 'cancelled';
```

**Event attendance:**
```sql
SELECT 
  e.title,
  e.capacity,
  e.enrolled,
  (e.enrolled::float / e.capacity * 100) as fill_rate
FROM public.events e
WHERE e.active = true
ORDER BY e.event_date;
```

## 🔄 Schema Updates

If you need to modify the schema later:

### Adding a New Field

```sql
-- Add field to table
ALTER TABLE public.products 
ADD COLUMN new_field TEXT;

-- Update RLS policies if needed
-- (usually not required for new fields)
```

### Adding a New Table

```sql
-- Create table
CREATE TABLE public.new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own data"
ON public.new_table FOR SELECT
USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_new_table_user ON public.new_table(user_id);
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🆘 Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase logs in Dashboard > Logs
3. Review Edge Function logs
4. Check RLS policies are set correctly
5. Verify environment variables are set

For specific errors, check the troubleshooting section above or consult the main README.md file.

---

**Setup Complete!** 🎉

Your Bean Boutique database is now fully configured and ready to use. Start browsing products, managing orders, and enjoying your coffee e-commerce platform!