# Bean Boutique - Database Quick Reference

Quick reference for common database operations and queries.

## 🗂️ Table Reference

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User accounts | id, email, role |
| `profiles` | User profiles | user_id, full_name, phone, addresses |
| `products` | Inventory | id, name, price, category, stock |
| `orders` | Purchases | id, user_id, total, status |
| `order_items` | Order details | order_id, product_id, quantity, price |
| `reviews` | Product reviews | product_id, user_id, rating, comment |
| `events` | Workshops | id, title, event_date, capacity, enrolled |
| `event_registrations` | Event signups | event_id, user_id, participants |
| `subscriptions` | Coffee plans | user_id, plan_id, frequency, status |
| `carts` | Shopping carts | user_id, items (jsonb) |
| `promotions` | Promo codes | code, discount_value, start_date, end_date |
| `offers` | Product deals | product_id, discount_percent, active |
| `blog_posts` | Articles | title, content, published, published_at |
| `banners` | Carousel | image_url, title, active |

## 📝 Common Queries

### Products

```sql
-- Get all coffee products
SELECT * FROM products WHERE category = 'coffee';

-- Get featured products
SELECT * FROM products WHERE featured = true;

-- Get products by price range
SELECT * FROM products WHERE price BETWEEN 15.00 AND 20.00;

-- Search products
SELECT * FROM products 
WHERE name ILIKE '%ethiopian%' 
   OR description ILIKE '%ethiopian%';

-- Get products with reviews
SELECT p.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id;
```

### Orders

```sql
-- Get user's orders
SELECT * FROM orders WHERE user_id = 'user-uuid';

-- Get order with items
SELECT o.*, oi.*, p.name as product_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.id = 'order-uuid';

-- Get pending orders
SELECT * FROM orders WHERE status = 'pending';

-- Calculate total revenue
SELECT SUM(total) as revenue 
FROM orders 
WHERE status != 'cancelled';

-- Get orders by date range
SELECT * FROM orders 
WHERE created_at BETWEEN '2025-01-01' AND '2025-12-31';
```

### Events

```sql
-- Get upcoming events
SELECT * FROM events 
WHERE event_date > NOW() 
  AND active = true
ORDER BY event_date ASC;

-- Get event with registrations
SELECT e.*, COUNT(er.id) as registered_count
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
GROUP BY e.id;

-- Get user's registered events
SELECT e.*, er.created_at as registered_at
FROM events e
JOIN event_registrations er ON e.id = er.event_id
WHERE er.user_id = 'user-uuid';

-- Check if event is full
SELECT 
  e.title,
  e.capacity,
  e.enrolled,
  (e.capacity - e.enrolled) as spots_available
FROM events e
WHERE e.id = 'event-uuid';
```

### Reviews

```sql
-- Get product reviews
SELECT r.*, u.email as user_email
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.product_id = 'product-uuid'
ORDER BY r.created_at DESC;

-- Get average rating for product
SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
FROM reviews
WHERE product_id = 'product-uuid';

-- Get user's reviews
SELECT r.*, p.name as product_name
FROM reviews r
JOIN products p ON r.product_id = p.id
WHERE r.user_id = 'user-uuid';
```

### Users & Profiles

```sql
-- Get user with profile
SELECT u.*, p.*
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.id = 'user-uuid';

-- Get all admin users
SELECT * FROM users WHERE role = 'admin';

-- Count users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;
```

## 🔧 Admin Queries

### Make User Admin

```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### View Order Analytics

```sql
SELECT 
  DATE_TRUNC('day', created_at) as order_date,
  COUNT(*) as total_orders,
  SUM(total) as revenue
FROM orders
WHERE status != 'cancelled'
GROUP BY order_date
ORDER BY order_date DESC;
```

### Popular Products

```sql
SELECT 
  p.name,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity) as total_units
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY times_ordered DESC
LIMIT 10;
```

### Low Stock Alert

```sql
SELECT name, stock, category
FROM products
WHERE stock < 50
ORDER BY stock ASC;
```

### Event Fill Rate

```sql
SELECT 
  title,
  capacity,
  enrolled,
  ROUND((enrolled::float / capacity * 100), 2) as fill_rate_percent
FROM events
WHERE active = true
ORDER BY event_date;
```

## 🔍 Useful Filters

### Products

```sql
-- By category
WHERE category = 'coffee'

-- By origin (coffee)
WHERE origin = 'Ethiopia'

-- By roast level (coffee)
WHERE roast_level = 'light'

-- By brand (equipment)
WHERE brand = 'Breville'

-- In stock only
WHERE stock > 0

-- Featured only
WHERE featured = true

-- Price range
WHERE price BETWEEN 10.00 AND 30.00
```

### Orders

```sql
-- By status
WHERE status = 'pending'
WHERE status IN ('pending', 'paid')

-- By date
WHERE created_at > NOW() - INTERVAL '30 days'
WHERE DATE(created_at) = '2025-10-01'

-- By price
WHERE total > 100.00
```

### Events

```sql
-- Upcoming only
WHERE event_date > NOW()

-- Past events
WHERE event_date < NOW()

-- By category
WHERE category = 'workshop'

-- Available spots
WHERE enrolled < capacity
```

## 🔒 RLS Quick Reference

### Check Current User

```sql
SELECT auth.uid(); -- Returns current user's UUID
```

### Test RLS Policy

```sql
-- As regular user (returns only their data)
SELECT * FROM orders;

-- As admin (returns all data)
SELECT * FROM orders;
```

### Common RLS Patterns

```sql
-- User owns the record
auth.uid() = user_id

-- User is admin
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')

-- Public access
true

-- User owns related record
EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
```

## 📊 Analytics Queries

### Sales Dashboard

```sql
-- Today's sales
SELECT COUNT(*), SUM(total) 
FROM orders 
WHERE DATE(created_at) = CURRENT_DATE;

-- This month's revenue
SELECT SUM(total) 
FROM orders 
WHERE created_at >= DATE_TRUNC('month', NOW())
  AND status != 'cancelled';

-- Best selling products this month
SELECT p.name, SUM(oi.quantity) as units_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= DATE_TRUNC('month', NOW())
GROUP BY p.id, p.name
ORDER BY units_sold DESC
LIMIT 5;
```

### Customer Insights

```sql
-- Total customers
SELECT COUNT(*) FROM users WHERE role = 'user';

-- Active customers (ordered in last 30 days)
SELECT COUNT(DISTINCT user_id) 
FROM orders 
WHERE created_at > NOW() - INTERVAL '30 days';

-- Average order value
SELECT AVG(total) 
FROM orders 
WHERE status != 'cancelled';

-- Customer lifetime value
SELECT 
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.total) as lifetime_value
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status != 'cancelled'
GROUP BY u.id, u.email
ORDER BY lifetime_value DESC;
```

## 🔨 Maintenance Queries

### Clean Up Old Carts

```sql
-- Delete carts not updated in 30 days
DELETE FROM carts 
WHERE updated_at < NOW() - INTERVAL '30 days';
```

### Archive Old Orders

```sql
-- Create archive table first
CREATE TABLE orders_archive AS SELECT * FROM orders WHERE false;

-- Move old orders
INSERT INTO orders_archive 
SELECT * FROM orders 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Then delete from main table
DELETE FROM orders 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Update Product Ratings

```sql
-- Recalculate all product ratings
UPDATE products p
SET 
  rating = (SELECT AVG(rating) FROM reviews WHERE product_id = p.id),
  review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = p.id);
```

### Expire Old Promotions

```sql
UPDATE promotions 
SET active = false 
WHERE end_date < NOW() AND active = true;
```

## 🚨 Troubleshooting Queries

### Check Table Sizes

```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Find Slow Queries

```sql
-- Enable in postgresql.conf: shared_preload_libraries = 'pg_stat_statements'
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Check Constraints

```sql
-- List all constraints
SELECT 
  conname as constraint_name,
  conrelid::regclass as table_name,
  contype as constraint_type
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace;
```

### Verify RLS Enabled

```sql
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public';
```

## 📚 Helpful Functions

### Date/Time

```sql
NOW()                          -- Current timestamp
CURRENT_DATE                   -- Current date
DATE_TRUNC('day', created_at)  -- Truncate to day
age(created_at)                -- Time since date
created_at + INTERVAL '7 days' -- Add 7 days
```

### Aggregation

```sql
COUNT(*)           -- Count rows
SUM(total)         -- Sum values
AVG(rating)        -- Average
MAX(price)         -- Maximum
MIN(price)         -- Minimum
```

### String

```sql
ILIKE '%search%'                -- Case-insensitive search
CONCAT(first_name, ' ', last_name) -- Concatenate
UPPER(name)                     -- Uppercase
LOWER(email)                    -- Lowercase
```

### JSON

```sql
items->0              -- Get first array element
items->>'quantity'    -- Get JSON field as text
items @> '[{"id": 1}]' -- Contains
```

## 💡 Pro Tips

1. **Always use prepared statements** to prevent SQL injection
2. **Index foreign keys** for better JOIN performance
3. **Use EXPLAIN ANALYZE** to understand query performance
4. **Batch operations** when updating multiple records
5. **Use transactions** for operations that must succeed or fail together
6. **Regularly vacuum** tables to reclaim space
7. **Monitor slow queries** and add indexes as needed
8. **Test RLS policies** before deploying to production

## 🔗 Quick Links

- Full Schema: `/MIGRATION.sql`
- Seed Data: `/SEED_DATA.sql`
- Setup Guide: `/DATABASE_SETUP_GUIDE.md`
- API Docs: `/README.md`
- Database Utils: `/supabase/functions/server/db.tsx`

---

**Need more help?** Check the full documentation in `/README.md` or `/DATABASE_SETUP_GUIDE.md`