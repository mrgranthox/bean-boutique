-- ===================================================================
-- BEAN BOUTIQUE DATABASE MIGRATION
-- From KV Store to Relational Schema
-- ===================================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Create a new query
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- 5. Verify all tables are created in Table Editor
--
-- ===================================================================

-- ==========
-- USERS & PROFILES
-- ==========
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text check (role in ('user','admin')) default 'user',
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  phone text,
  preferences jsonb default '{}'::jsonb,
  addresses jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ==========
-- PRODUCTS
-- ==========
drop table if exists public.reviews cascade;
drop table if exists public.products cascade;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  stock int not null default 0,
  image_url text,
  category text check (category in ('coffee','equipment')) not null,
  
  -- Coffee-specific fields
  origin text,
  roast_level text,
  flavor_notes text[],
  processing_method text,
  altitude text,
  
  -- Equipment-specific fields
  brand text,
  model text,
  type text,
  
  -- Common fields
  featured boolean default false,
  rating numeric(3,2) default 0,
  review_count int default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  comment text,
  verified boolean default false,
  helpful int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========
-- ORDERS
-- ==========
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text check (status in ('pending','paid','processing','shipped','delivered','cancelled')) default 'pending',
  total numeric(10,2) not null default 0,
  
  -- Address information
  shipping_address jsonb not null,
  billing_address jsonb not null,
  
  -- Payment information
  payment_method text,
  payment_status text default 'pending',
  
  -- Tracking
  tracking_number text,
  notes text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity int not null check (quantity > 0),
  price numeric(10,2) not null,
  product_name text not null,
  product_image text
);

-- ==========
-- PROMOTIONS & OFFERS
-- ==========
drop table if exists public.promotions cascade;
drop table if exists public.offers cascade;

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  code text unique,
  discount_type text check (discount_type in ('percentage','fixed')) default 'percentage',
  discount_value numeric(10,2) not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  active boolean default true,
  usage_limit int,
  usage_count int default 0,
  created_at timestamptz default now()
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  description text,
  discount_percent numeric(5,2),
  active boolean default true,
  start_date timestamptz default now(),
  end_date timestamptz,
  created_at timestamptz default now()
);

-- ==========
-- EVENTS
-- ==========
drop table if exists public.event_registrations cascade;
drop table if exists public.events cascade;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  event_date timestamptz not null,
  duration int, -- in minutes
  capacity int,
  enrolled int default 0,
  price numeric(10,2) default 0,
  instructor text,
  level text,
  category text,
  image_url text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  participants int default 1,
  status text check (status in ('registered','cancelled','attended')) default 'registered',
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- ==========
-- SUBSCRIPTIONS
-- ==========
drop table if exists public.subscriptions cascade;

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id text not null,
  plan_name text not null,
  frequency text check (frequency in ('weekly','monthly','quarterly')) not null,
  quantity int default 1,
  price numeric(10,2) not null,
  next_delivery timestamptz,
  start_date timestamptz not null default now(),
  end_date timestamptz,
  status text check (status in ('active','paused','cancelled','expired')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========
-- BLOG & BANNERS
-- ==========
drop table if exists public.blog_posts cascade;
drop table if exists public.banners cascade;

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  excerpt text,
  author_id uuid references public.users(id),
  author_name text,
  image_url text,
  category text,
  tags text[],
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  subtitle text,
  link text,
  active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ==========
-- SHOPPING CART (Session-based)
-- ==========
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  items jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- ==========
-- INDEXES
-- ==========
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(featured) where featured = true;
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_user on public.reviews(user_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_events_date on public.events(event_date);
create index if not exists idx_event_registrations_event on public.event_registrations(event_id);
create index if not exists idx_event_registrations_user on public.event_registrations(user_id);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_blog_posts_published on public.blog_posts(published_at) where published = true;

-- ==========
-- ENABLE RLS
-- ==========
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.promotions enable row level security;
alter table public.offers enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.blog_posts enable row level security;
alter table public.banners enable row level security;
alter table public.carts enable row level security;

-- ==========
-- HELPER FUNCTION - ADMIN CHECK
-- ==========
-- This function prevents infinite recursion in RLS policies
-- SECURITY DEFINER allows it to bypass RLS when checking admin status
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 
    from public.users 
    where id = auth.uid() 
    and role = 'admin'
  );
end;
$$;

-- Grant execute permissions
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to anon;

-- ==========
-- RLS POLICIES - USERS
-- ==========
create policy "Users can view their own profile"
on public.users for select using (auth.uid() = id);

create policy "Users can update their own profile"
on public.users for update using (auth.uid() = id);

create policy "Admins can view all users"
on public.users for select using (public.is_admin());

create policy "Admins can update all users"
on public.users for update using (public.is_admin());

-- ==========
-- RLS POLICIES - PROFILES
-- ==========
create policy "Users can view their own profile"
on public.profiles for select using (auth.uid() = user_id);

create policy "Users can update their own profile"
on public.profiles for update using (auth.uid() = user_id);

create policy "Users can insert their own profile"
on public.profiles for insert with check (auth.uid() = user_id);

create policy "Admins can view all profiles"
on public.profiles for select using (public.is_admin());

-- ==========
-- RLS POLICIES - PRODUCTS
-- ==========
create policy "Anyone can read products"
on public.products for select using (true);

create policy "Admins can insert products"
on public.products for insert with check (public.is_admin());

create policy "Admins can update products"
on public.products for update using (public.is_admin());

create policy "Admins can delete products"
on public.products for delete using (public.is_admin());

-- ==========
-- RLS POLICIES - REVIEWS
-- ==========
create policy "Anyone can read reviews"
on public.reviews for select using (true);

create policy "Authenticated users can insert reviews"
on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
on public.reviews for update using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
on public.reviews for delete using (auth.uid() = user_id);

create policy "Admins can manage all reviews"
on public.reviews for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ==========
-- RLS POLICIES - ORDERS
-- ==========
create policy "Users can view their own orders"
on public.orders for select using (auth.uid() = user_id);

create policy "Users can insert their own orders"
on public.orders for insert with check (auth.uid() = user_id);

create policy "Users can update their own orders"
on public.orders for update using (auth.uid() = user_id);

create policy "Admins can manage all orders"
on public.orders for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ==========
-- RLS POLICIES - ORDER ITEMS
-- ==========
create policy "Users can view their own order items"
on public.order_items for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
    and o.user_id = auth.uid()
  )
);

create policy "Users can insert into their own orders"
on public.order_items for insert with check (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
    and o.user_id = auth.uid()
  )
);

create policy "Admins can manage all order items"
on public.order_items for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ==========
-- RLS POLICIES - PROMOTIONS & OFFERS
-- ==========
create policy "Anyone can view promotions"
on public.promotions for select using (true);

create policy "Admins manage promotions"
on public.promotions for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

create policy "Anyone can view offers"
on public.offers for select using (true);

create policy "Admins manage offers"
on public.offers for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ==========
-- RLS POLICIES - EVENTS
-- ==========
create policy "Anyone can view events"
on public.events for select using (true);

create policy "Admins manage events"
on public.events for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

create policy "Users can view their own registrations"
on public.event_registrations for select using (auth.uid() = user_id);

create policy "Users can register for events"
on public.event_registrations for insert with check (auth.uid() = user_id);

create policy "Users can cancel their own registrations"
on public.event_registrations for update using (auth.uid() = user_id);

create policy "Admins can manage all registrations"
on public.event_registrations for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ==========
-- RLS POLICIES - SUBSCRIPTIONS
-- ==========
create policy "Users can view their own subscriptions"
on public.subscriptions for select using (auth.uid() = user_id);

create policy "Users can create their own subscriptions"
on public.subscriptions for insert with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
on public.subscriptions for update using (auth.uid() = user_id);

create policy "Admins can manage all subscriptions"
on public.subscriptions for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ==========
-- RLS POLICIES - BLOG & BANNERS
-- ==========
create policy "Anyone can view published blog posts"
on public.blog_posts for select using (published = true or auth.uid() = author_id);

create policy "Admins can manage blog posts"
on public.blog_posts for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

create policy "Anyone can view active banners"
on public.banners for select using (active = true);

create policy "Admins manage banners"
on public.banners for all using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- ==========
-- RLS POLICIES - CARTS
-- ==========
create policy "Users can view their own cart"
on public.carts for select using (auth.uid() = user_id);

create policy "Users can manage their own cart"
on public.carts for all using (auth.uid() = user_id);

-- ==========
-- FUNCTIONS & TRIGGERS
-- ==========

-- Update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_products_updated_at before update on public.products
  for each row execute function update_updated_at_column();

create trigger update_reviews_updated_at before update on public.reviews
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at before update on public.orders
  for each row execute function update_updated_at_column();

create trigger update_events_updated_at before update on public.events
  for each row execute function update_updated_at_column();

create trigger update_subscriptions_updated_at before update on public.subscriptions
  for each row execute function update_updated_at_column();

create trigger update_blog_posts_updated_at before update on public.blog_posts
  for each row execute function update_updated_at_column();

create trigger update_carts_updated_at before update on public.carts
  for each row execute function update_updated_at_column();

-- Function to update product rating
create or replace function update_product_rating()
returns trigger as $$
begin
  update public.products
  set 
    rating = (select avg(rating)::numeric(3,2) from public.reviews where product_id = new.product_id),
    review_count = (select count(*) from public.reviews where product_id = new.product_id)
  where id = new.product_id;
  return new;
end;
$$ language plpgsql;

create trigger update_product_rating_on_review
after insert or update or delete on public.reviews
for each row execute function update_product_rating();

-- ===================================================================
-- MIGRATION COMPLETE
-- ===================================================================
-- 
-- Next steps:
-- 1. Verify all tables exist in Supabase Dashboard
-- 2. Deploy updated Edge Function code
-- 3. Seed initial data (products, events, blog posts)
-- 4. Create first admin user
--
-- ===================================================================