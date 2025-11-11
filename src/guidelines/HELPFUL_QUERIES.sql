-- ===================================================================
-- BEAN BOUTIQUE - HELPFUL SQL QUERIES
-- Common queries for managing and debugging your application
-- ===================================================================

-- ==========================================
-- USER MANAGEMENT
-- ==========================================

-- Make a user an admin (IMPORTANT: Use your actual email)
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Make a user a regular user
UPDATE public.users 
SET role = 'user' 
WHERE email = 'user-email@example.com';

-- View all users and their roles
SELECT 
  u.id,
  u.email,
  u.role,
  p.full_name,
  u.created_at
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC;

-- Find user by email
SELECT * FROM public.users WHERE email = 'user@example.com';

-- Count total users
SELECT COUNT(*) as total_users FROM public.users;

-- Count admins
SELECT COUNT(*) as total_admins FROM public.users WHERE role = 'admin';

-- ==========================================
-- PRODUCT MANAGEMENT
-- ==========================================

-- View all products
SELECT 
  id,
  name,
  category,
  price,
  stock,
  featured,
  rating,
  review_count
FROM public.products
ORDER BY category, name;

-- View only coffee products
SELECT * FROM public.products 
WHERE category = 'coffee'
ORDER BY name;

-- View only equipment
SELECT * FROM public.products 
WHERE category = 'equipment'
ORDER BY name;

-- Count products by category
SELECT 
  category,
  COUNT(*) as count,
  SUM(stock) as total_stock,
  AVG(price) as avg_price
FROM public.products
GROUP BY category;

-- Find out-of-stock products
SELECT name, category, stock 
FROM public.products 
WHERE stock = 0
ORDER BY category, name;

-- Find low-stock products (less than 10)
SELECT name, category, stock 
FROM public.products 
WHERE stock < 10
ORDER BY stock ASC;

-- View featured products
SELECT name, category, price, rating 
FROM public.products 
WHERE featured = true
ORDER BY rating DESC;

-- Update product stock
UPDATE public.products 
SET stock = 100 
WHERE name = 'Ethiopian Yirgacheffe';

-- Update product price
UPDATE public.products 
SET price = 19.99 
WHERE name = 'Ethiopian Yirgacheffe';

-- Mark product as featured
UPDATE public.products 
SET featured = true 
WHERE name = 'Ethiopian Yirgacheffe';

-- ==========================================
-- ORDER MANAGEMENT
-- ==========================================

-- View all orders with customer info
SELECT 
  o.id,
  o.user_id,
  u.email,
  p.full_name,
  o.status,
  o.total_amount,
  o.created_at
FROM public.orders o
JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY o.created_at DESC;

-- View order details with items
SELECT 
  o.id as order_id,
  o.status,
  o.total_amount,
  oi.product_id,
  pr.name as product_name,
  oi.quantity,
  oi.price_at_purchase,
  (oi.quantity * oi.price_at_purchase) as item_total
FROM public.orders o
JOIN public.order_items oi ON o.id = oi.order_id
JOIN public.products pr ON oi.product_id = pr.id
WHERE o.id = 'order-id-here'
ORDER BY oi.created_at;

-- Count orders by status
SELECT 
  status,
  COUNT(*) as count,
  SUM(total_amount) as total_revenue
FROM public.orders
GROUP BY status
ORDER BY count DESC;

-- Total revenue
SELECT SUM(total_amount) as total_revenue 
FROM public.orders 
WHERE status = 'completed';

-- Revenue by month
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as order_count,
  SUM(total_amount) as revenue
FROM public.orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC;

-- Update order status
UPDATE public.orders 
SET status = 'shipped' 
WHERE id = 'order-id-here';

-- ==========================================
-- EVENT MANAGEMENT
-- ==========================================

-- View all events
SELECT 
  id,
  title,
  event_date,
  capacity,
  enrolled,
  (capacity - enrolled) as spots_available,
  price,
  instructor,
  active
FROM public.events
ORDER BY event_date;

-- View upcoming events
SELECT 
  title,
  event_date,
  capacity,
  enrolled,
  (capacity - enrolled) as spots_available,
  price
FROM public.events
WHERE event_date > now() AND active = true
ORDER BY event_date;

-- View event registrations
SELECT 
  e.title,
  u.email,
  p.full_name,
  er.registered_at,
  er.status
FROM public.event_registrations er
JOIN public.events e ON er.event_id = e.id
JOIN public.users u ON er.user_id = u.id
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY e.event_date, er.registered_at;

-- Count registrations by event
SELECT 
  e.title,
  e.event_date,
  COUNT(er.id) as registrations,
  e.capacity,
  (e.capacity - COUNT(er.id)) as spots_left
FROM public.events e
LEFT JOIN public.event_registrations er ON e.id = er.event_id
GROUP BY e.id, e.title, e.event_date, e.capacity
ORDER BY e.event_date;

-- Deactivate past events
UPDATE public.events 
SET active = false 
WHERE event_date < now();

-- ==========================================
-- REVIEW MANAGEMENT
-- ==========================================

-- View all reviews with product info
SELECT 
  r.id,
  p.name as product,
  u.email,
  r.rating,
  r.comment,
  r.created_at
FROM public.reviews r
JOIN public.products p ON r.product_id = p.id
JOIN public.users u ON r.user_id = u.id
ORDER BY r.created_at DESC;

-- Average rating by product
SELECT 
  p.name,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating), 2) as avg_rating
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
ORDER BY avg_rating DESC;

-- Update product rating and review count
UPDATE public.products p
SET 
  rating = (SELECT AVG(rating) FROM public.reviews WHERE product_id = p.id),
  review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = p.id)
WHERE id = 'product-id-here';

-- Update all product ratings
UPDATE public.products p
SET 
  rating = COALESCE((SELECT AVG(rating) FROM public.reviews WHERE product_id = p.id), 0),
  review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = p.id);

-- ==========================================
-- SHOPPING CART
-- ==========================================

-- View user's cart
SELECT 
  c.id,
  c.user_id,
  u.email,
  c.items,
  c.updated_at
FROM public.carts c
JOIN public.users u ON c.user_id = u.id
WHERE u.email = 'user@example.com';

-- Clear a user's cart
DELETE FROM public.carts WHERE user_id = 'user-id-here';

-- Count active carts
SELECT COUNT(*) as active_carts 
FROM public.carts 
WHERE updated_at > now() - interval '7 days';

-- ==========================================
-- SUBSCRIPTIONS
-- ==========================================

-- View all subscriptions
SELECT 
  s.id,
  u.email,
  p.full_name,
  s.frequency,
  s.status,
  s.next_delivery,
  s.created_at
FROM public.subscriptions s
JOIN public.users u ON s.user_id = u.id
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY s.created_at DESC;

-- Count subscriptions by status
SELECT 
  status,
  COUNT(*) as count
FROM public.subscriptions
GROUP BY status;

-- Cancel a subscription
UPDATE public.subscriptions 
SET status = 'cancelled', updated_at = now()
WHERE id = 'subscription-id-here';

-- ==========================================
-- ANALYTICS & REPORTING
-- ==========================================

-- Dashboard summary
SELECT 
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as admin_users,
  (SELECT COUNT(*) FROM public.products) as total_products,
  (SELECT COUNT(*) FROM public.products WHERE stock < 10) as low_stock_products,
  (SELECT COUNT(*) FROM public.orders) as total_orders,
  (SELECT COUNT(*) FROM public.orders WHERE status = 'pending') as pending_orders,
  (SELECT COUNT(*) FROM public.events WHERE active = true AND event_date > now()) as upcoming_events,
  (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active') as active_subscriptions,
  (SELECT SUM(total_amount) FROM public.orders WHERE status = 'completed') as total_revenue;

-- Top selling products
SELECT 
  p.name,
  p.category,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.quantity * oi.price_at_purchase) as total_revenue
FROM public.products p
JOIN public.order_items oi ON p.id = oi.product_id
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.id, p.name, p.category
ORDER BY total_quantity_sold DESC
LIMIT 10;

-- Revenue by product category
SELECT 
  p.category,
  COUNT(DISTINCT o.id) as order_count,
  SUM(oi.quantity) as items_sold,
  SUM(oi.quantity * oi.price_at_purchase) as revenue
FROM public.products p
JOIN public.order_items oi ON p.id = oi.product_id
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.category
ORDER BY revenue DESC;

-- Most active customers
SELECT 
  u.email,
  p.full_name,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as total_spent
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
JOIN public.orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.email, p.full_name
ORDER BY total_spent DESC
LIMIT 10;

-- ==========================================
-- BLOG & CONTENT
-- ==========================================

-- View published blog posts
SELECT 
  id,
  title,
  author_name,
  category,
  published_at,
  tags
FROM public.blog_posts
WHERE published = true
ORDER BY published_at DESC;

-- Count blog posts by category
SELECT 
  category,
  COUNT(*) as post_count
FROM public.blog_posts
WHERE published = true
GROUP BY category;

-- Publish a blog post
UPDATE public.blog_posts 
SET published = true, published_at = now()
WHERE id = 'post-id-here';

-- ==========================================
-- PROMOTIONS & OFFERS
-- ==========================================

-- View active promotions
SELECT * FROM public.promotions
WHERE active = true
  AND (valid_from IS NULL OR valid_from <= now())
  AND (valid_until IS NULL OR valid_until >= now())
ORDER BY created_at DESC;

-- View active offers
SELECT 
  o.id,
  p.name as product,
  o.discount_percent,
  o.valid_from,
  o.valid_until,
  o.active
FROM public.offers o
JOIN public.products p ON o.product_id = p.id
WHERE o.active = true
ORDER BY o.discount_percent DESC;

-- Deactivate expired promotions
UPDATE public.promotions 
SET active = false 
WHERE valid_until < now();

-- ==========================================
-- DATABASE MAINTENANCE
-- ==========================================

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Count rows in all tables
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'products', COUNT(*) FROM public.products
UNION ALL
SELECT 'orders', COUNT(*) FROM public.orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM public.order_items
UNION ALL
SELECT 'events', COUNT(*) FROM public.events
UNION ALL
SELECT 'event_registrations', COUNT(*) FROM public.event_registrations
UNION ALL
SELECT 'reviews', COUNT(*) FROM public.reviews
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM public.subscriptions
UNION ALL
SELECT 'carts', COUNT(*) FROM public.carts
UNION ALL
SELECT 'promotions', COUNT(*) FROM public.promotions
UNION ALL
SELECT 'offers', COUNT(*) FROM public.offers
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM public.blog_posts
UNION ALL
SELECT 'banners', COUNT(*) FROM public.banners;

-- Vacuum and analyze (run periodically for performance)
VACUUM ANALYZE;

-- ==========================================
-- BACKUP & RESTORE
-- ==========================================

-- Export products to CSV (run in psql)
-- \copy (SELECT * FROM public.products) TO '/tmp/products_backup.csv' CSV HEADER;

-- Export orders to CSV (run in psql)
-- \copy (SELECT * FROM public.orders) TO '/tmp/orders_backup.csv' CSV HEADER;

-- Export users to CSV (run in psql)
-- \copy (SELECT id, email, role, created_at FROM public.users) TO '/tmp/users_backup.csv' CSV HEADER;

-- ==========================================
-- TROUBLESHOOTING
-- ==========================================

-- Check RLS policies on a table
SELECT * FROM pg_policies WHERE tablename = 'products';

-- Verify a user exists
SELECT id, email, role FROM public.users WHERE email = 'your-email@example.com';

-- Check if profile exists for user
SELECT 
  u.email,
  CASE 
    WHEN p.user_id IS NULL THEN 'NO PROFILE'
    ELSE 'PROFILE EXISTS'
  END as profile_status
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.user_id;

-- Create missing profiles
INSERT INTO public.profiles (user_id, full_name)
SELECT u.id, COALESCE(u.email, 'User')
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL;

-- ==========================================
-- RESET DATA (USE WITH CAUTION!)
-- ==========================================

-- Delete all orders (CAUTION!)
-- DELETE FROM public.order_items;
-- DELETE FROM public.orders;

-- Delete all reviews (CAUTION!)
-- DELETE FROM public.reviews;

-- Delete all carts (CAUTION!)
-- DELETE FROM public.carts;

-- Reset product stock to 100 for all products
-- UPDATE public.products SET stock = 100;

-- ==========================================
-- NOTES
-- ==========================================

-- 1. Always backup before running DELETE or UPDATE queries
-- 2. Replace 'your-email@example.com' with actual email addresses
-- 3. Replace 'order-id-here', 'product-id-here', etc. with actual IDs
-- 4. Use these queries in Supabase SQL Editor
-- 5. Some queries require admin/service role to execute

-- ===================================================================
-- END OF HELPFUL QUERIES
-- ===================================================================