# Bean Boutique - Modern Coffee Shop E-Commerce Platform

A full-featured, production-ready e-commerce web application for a boutique coffee shop, built with React, TypeScript, Tailwind CSS, and Supabase. This application provides a complete online shopping experience with product browsing, cart management, event registration, subscription services, and comprehensive admin tools.

![Bean Boutique](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=400&fit=crop)

---

## 👋 New Here?

### **→ Start with [START_HERE.md](START_HERE.md) ←**

This is your **10-minute quick start guide** that will get you up and running!

---

## 🚀 Quick Reference

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[START_HERE.md](START_HERE.md)** | Quick start guide | First time setup |
| **[RUN_THIS_FIRST.md](RUN_THIS_FIRST.md)** | Detailed setup steps | Setting up database |
| **[PROJECT_STATUS.md](PROJECT_STATUS.md)** | Current status | Anytime |
| **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** | Launch preparation | Before going live |
| **[HELPFUL_QUERIES.sql](HELPFUL_QUERIES.sql)** | SQL query reference | Daily management |
| **[README.md](README.md)** (this file) | Complete documentation | Reference |

**Quick Setup**: Run [MIGRATION.sql](MIGRATION.sql) + [SEED_DATA.sql](SEED_DATA.sql) in Supabase → Deploy backend → Make yourself admin → Done!

---

## 🌟 Features

### Customer Features
- **Product Browsing**: Browse coffee selections and brewing equipment with advanced filtering and search
- **Shopping Cart**: Real-time cart management with backend persistence for authenticated users
- **User Authentication**: Email/password and OAuth (Google, GitHub) authentication
- **Product Reviews**: Read and write product reviews with ratings
- **Event Registration**: Browse and register for coffee workshops and tasting events
- **Subscription Plans**: Subscribe to regular coffee deliveries with customizable frequencies
- **Special Offers**: Access exclusive deals and promotions
- **User Profile**: Manage personal information, order history, and preferences
- **Responsive Design**: Fully responsive with optimized mobile navigation
- **Blog**: Read coffee-related articles and brewing tips

### Admin Features
- **Product Management**: Add, edit, and delete coffee and equipment products
- **Order Management**: View and manage customer orders with status tracking
- **Event Management**: Create and manage workshops and events
- **User Management**: View and manage customer accounts
- **Analytics Dashboard**: Track sales, popular products, and customer insights
- **Content Management**: Manage blog posts, FAQs, and site content
- **Offer Management**: Create and manage special offers and promotions
- **Subscription Management**: Manage subscription plans and active subscriptions

### Technical Features
- **Supabase Backend**: Full backend integration with PostgreSQL database
- **Data Persistence**: Smart data management with automatic fallback to local data
- **Health Checking**: Backend health monitoring with automatic failover
- **OAuth Integration**: Complete OAuth setup with debugging tools
- **Real-time Updates**: Live cart synchronization across sessions
- **SEO Friendly**: Semantic HTML and proper meta tags
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🏗️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and context API
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework with custom theme
- **Lucide React**: Beautiful icon library
- **Recharts**: Data visualization for analytics
- **Sonner**: Toast notifications
- **React Hook Form**: Form validation and management
- **Shadcn/UI**: Reusable component library

### Backend
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Robust relational database
- **Supabase Edge Functions**: Serverless API with Deno runtime
- **Hono**: Fast web framework for edge functions
- **Supabase Auth**: Authentication and authorization
- **Supabase Storage**: File storage (ready for implementation)

## 📁 Project Structure

```
bean-boutique/
├── App.tsx                          # Main application component
├── components/                      # React components
│   ├── pages/                       # Page components
│   │   ├── HomePage.tsx
│   │   ├── CoffeeSelectionPage.tsx
│   │   ├── BrewingEquipmentPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── ShoppingCartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── UserProfilePage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   └── admin/                   # Admin sub-components
│   ├── ui/                          # Reusable UI components (Shadcn)
│   ├── Navigation.tsx               # Main navigation bar
│   ├── Footer.tsx                   # Site footer
│   ├── AuthModal.tsx                # Authentication modal
│   ├── DataSourceIndicator.tsx      # Backend status indicator
│   ├── OAuthSetupWizard.tsx         # OAuth configuration wizard
│   ├── OAuthDebugger.tsx            # OAuth debugging tool
│   └── OAuthTroubleshooter.tsx      # OAuth troubleshooting guide
├── hooks/                           # Custom React hooks
│   ├── useBackendCart.ts            # Cart management hook
│   └── useProducts.ts               # Product data hook
├── utils/                           # Utility functions
│   ├── api.ts                       # API client functions
│   ├── data-manager.ts              # Smart data management system
│   ├── oauth-handler.ts             # OAuth callback handler
│   └── supabase/                    # Supabase configuration
│       ├── client.ts                # Supabase client setup
│       └── info.tsx                 # Project credentials
├── supabase/functions/server/       # Backend API (Edge Functions)
│   ├── index.tsx                    # Main API routes
│   ├── kv_store.tsx                 # Key-value store utilities
│   └── initialize-data.tsx          # Data seeding utilities
├── styles/
│   └── globals.css                  # Global styles and theme
└── guidelines/
    └── Guidelines.md                # Development guidelines
```

## 🗄️ Database Architecture

### Overview
Bean Boutique uses **Supabase** as its backend, which provides:
- PostgreSQL database with full SQL capabilities
- RESTful API automatically generated from database schema
- Row Level Security (RLS) for data protection
- Real-time subscriptions (ready for implementation)
- Built-in authentication and user management

### Database Schema

The application uses a **relational database architecture** with proper tables, relationships, and Row Level Security (RLS) policies. All data is stored in PostgreSQL via Supabase.

#### Database Tables

**Core Tables:**
- `users` - User accounts and roles
- `profiles` - Extended user profile information
- `products` - Coffee and brewing equipment
- `reviews` - Product reviews and ratings
- `orders` - Customer orders
- `order_items` - Individual items within orders
- `events` - Workshops and tasting events
- `event_registrations` - Event signups
- `subscriptions` - Coffee subscription plans
- `promotions` - Promotional campaigns
- `offers` - Product-specific offers
- `blog_posts` - Blog articles
- `banners` - Homepage carousel banners
- `carts` - Shopping cart data

#### Schema Details

##### Users & Profiles

```sql
-- User accounts (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('user','admin')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extended profile information
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id),
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  addresses JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### Products & Reviews

```sql
-- Products (coffee and equipment)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT CHECK (category IN ('coffee','equipment')) NOT NULL,
  
  -- Coffee-specific fields
  origin TEXT,
  roast_level TEXT,
  flavor_notes TEXT[],
  processing_method TEXT,
  altitude TEXT,
  
  -- Equipment-specific fields
  brand TEXT,
  model TEXT,
  type TEXT,
  
  -- Common fields
  featured BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  helpful INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### Orders

```sql
-- Customer orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  status TEXT CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')) DEFAULT 'pending',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order line items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price NUMERIC(10,2) NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT
);
```

##### Events

```sql
-- Workshops and tasting events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  duration INT, -- in minutes
  capacity INT,
  enrolled INT DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  instructor TEXT,
  level TEXT,
  category TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event registrations
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  participants INT DEFAULT 1,
  status TEXT CHECK (status IN ('registered','cancelled','attended')) DEFAULT 'registered',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

##### Subscriptions

```sql
-- Coffee subscription plans
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('weekly','monthly','quarterly')) NOT NULL,
  quantity INT DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  next_delivery TIMESTAMPTZ,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('active','paused','cancelled','expired')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Database Access Patterns

The application uses **Supabase JavaScript client** for all database operations:

```typescript
// Example: Get all products
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'coffee')
  .order('created_at', { ascending: false });

// Example: Create order
const { data: order, error } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    total: 89.97,
    status: 'pending',
    shipping_address: {...},
    billing_address: {...}
  })
  .select()
  .single();

// Example: Get user orders with items
const { data: orders, error } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (*)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

All database operations are wrapped in utility functions in `/supabase/functions/server/db.tsx` for consistency and reusability.

### Supabase Auth Integration

User authentication is handled by **Supabase Auth**, which provides:

- **User Table**: Automatically created `auth.users` table
- **User Metadata**: Store additional user info in `user_metadata` field
- **Email/Password Auth**: Traditional authentication
- **OAuth Providers**: Google, GitHub, and other social logins
- **Session Management**: JWT-based sessions with automatic refresh
- **Row Level Security**: User-specific data access control

User information flow:
1. User signs up → Supabase creates entry in `auth.users`
2. Backend creates profile → Stored in `profile:{userId}` in KV store
3. User makes purchase → Order linked to `userId` from auth
4. User views profile → Frontend fetches `profile:{userId}` data

### Data Persistence Strategy

The application uses a **smart data management system** with the following features:

1. **Backend-First Approach**: Always attempts to fetch data from Supabase
2. **Automatic Fallback**: Falls back to local mock data if backend is unavailable
3. **Health Checking**: Monitors backend status and switches sources automatically
4. **Caching**: Caches successful API responses to reduce server load
5. **Visual Indicators**: Shows users which data source is active
6. **Graceful Degradation**: Application remains fully functional without backend

See `utils/data-manager.ts` for implementation details.

### Database Setup & Migrations

The application uses a **full relational database schema** with proper tables and relationships. Follow these steps to set up your database:

#### Step 1: Run the Migration

1. Open Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire contents of `/MIGRATION.sql`
5. Click **Run** to create all tables, indexes, and RLS policies

This will create:
- 13 database tables with proper relationships
- Row Level Security (RLS) policies for all tables
- Indexes for optimal query performance
- Triggers for automatic timestamp updates
- Functions for maintaining data integrity

#### Step 2: Seed Initial Data

1. In Supabase SQL Editor, create another new query
2. Copy the entire contents of `/SEED_DATA.sql`
3. Click **Run** to populate the database

This will add:
- 8 coffee products
- 8 brewing equipment items
- 6 upcoming events
- 4 blog posts
- 3 promotional offers
- 3 homepage banners

#### Step 3: Create Admin User

1. Sign up through the application normally
2. In Supabase SQL Editor, run:

```sql
-- Make yourself an admin (replace with your email)
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

3. Sign out and sign back in to apply admin privileges

#### Database Versioning

**Future Schema Changes**:
- Create numbered migration files: `001_add_field.sql`, `002_new_table.sql`
- Always include both `UP` and `DOWN` migrations
- Test migrations on a staging environment first
- Document breaking changes in migration comments

**Schema Modification Best Practices**:
- Use `ALTER TABLE` for non-breaking changes
- Create new tables instead of major restructures
- Maintain backward compatibility when possible
- Update RLS policies when adding tables

## 🔐 Authentication & Authorization

### Authentication Methods

#### 1. Email/Password Authentication

**Sign Up Flow**:
```typescript
// POST /make-server-4d0792a7/signup
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

The server:
1. Creates user in Supabase Auth using Service Role Key
2. Auto-confirms email (since email server not configured)
3. Creates user profile in KV store
4. Returns access token

**Sign In Flow**:
```typescript
// Frontend uses Supabase client directly
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
});
```

#### 2. OAuth (Social Login)

**Supported Providers**:
- Google OAuth 2.0
- GitHub OAuth

**OAuth Flow**:
1. User clicks "Sign in with Google/GitHub"
2. Frontend initiates OAuth with Supabase
3. User redirected to provider (Google/GitHub)
4. User authorizes application
5. Provider redirects back with auth code
6. Supabase exchanges code for session
7. Frontend receives session and user data
8. Backend creates profile if first login

**OAuth Configuration** (See [OAuth Setup Guide](#oauth-setup) below):
- Redirect URIs must be configured in provider console
- Providers must be enabled in Supabase Dashboard
- Client ID and Secret must be added to Supabase

### Authorization & Protected Routes

**Backend Route Protection**:
```typescript
// Protected endpoint example
const accessToken = request.headers.get('Authorization')?.split(' ')[1];
const { data: { user }, error } = await supabase.auth.getUser(accessToken);

if (!user) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Admin-Only Routes**:
```typescript
// Check if user has admin privileges
const profile = await kv.get(`profile:${user.id}`);
if (!profile?.isAdmin) {
  return new Response('Forbidden - Admin access required', { status: 403 });
}
```

**Frontend Route Protection**:
- Admin pages check `user.isAdmin` before rendering
- Cart operations require authenticated user
- Profile pages require active session

### Session Management

**Access Tokens**:
- JWT-based tokens issued by Supabase Auth
- Valid for 1 hour by default
- Automatically refreshed by Supabase client
- Sent in `Authorization: Bearer <token>` header

**Session Persistence**:
- Sessions stored in localStorage
- Automatically restored on page load
- `onAuthStateChange` listener detects changes
- Cart data synced when session changes

## 🚀 API Endpoints

All API endpoints are served from the Supabase Edge Function at:
```
https://{projectId}.supabase.co/functions/v1/make-server-4d0792a7
```

### Authentication Endpoints

#### POST `/signup`
Create new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "user": { "id": "...", "email": "..." },
  "accessToken": "eyJhbGc..."
}
```

### Product Endpoints

#### GET `/products`
Get all products (coffee and equipment)

**Query Parameters**:
- `category`: Filter by "coffee" or "equipment"
- `featured`: Filter featured products (true/false)

**Response**:
```json
{
  "products": [
    {
      "id": "ethiopian-yirgacheffe",
      "name": "Ethiopian Yirgacheffe",
      "price": 16.99,
      ...
    }
  ]
}
```

#### GET `/products/:id`
Get single product by ID

**Response**:
```json
{
  "product": {
    "id": "ethiopian-yirgacheffe",
    "name": "Ethiopian Yirgacheffe",
    ...
  }
}
```

#### POST `/products` (Admin only)
Create new product

**Headers**: `Authorization: Bearer <admin-access-token>`

**Request**:
```json
{
  "name": "New Coffee",
  "price": 18.99,
  "category": "coffee",
  ...
}
```

#### PUT `/products/:id` (Admin only)
Update existing product

#### DELETE `/products/:id` (Admin only)
Delete product

### Shopping Cart Endpoints

#### GET `/cart` (Protected)
Get user's shopping cart

**Headers**: `Authorization: Bearer <access-token>`

**Response**:
```json
{
  "cart": {
    "items": [
      {
        "productId": "ethiopian-yirgacheffe",
        "quantity": 2
      }
    ]
  }
}
```

#### POST `/cart/add` (Protected)
Add item to cart

**Request**:
```json
{
  "productId": "ethiopian-yirgacheffe",
  "quantity": 2
}
```

#### PUT `/cart/update` (Protected)
Update item quantity

**Request**:
```json
{
  "productId": "ethiopian-yirgacheffe",
  "quantity": 3
}
```

#### DELETE `/cart/remove/:productId` (Protected)
Remove item from cart

#### DELETE `/cart/clear` (Protected)
Clear entire cart

### Order Endpoints

#### POST `/orders` (Protected)
Create new order from cart

**Request**:
```json
{
  "shippingAddress": {
    "street": "123 Coffee St",
    "city": "Seattle",
    "state": "WA",
    "zip": "98101"
  },
  "billingAddress": { ... },
  "paymentMethod": "credit_card"
}
```

#### GET `/orders` (Protected)
Get user's order history

#### GET `/orders/:id` (Protected)
Get single order details

#### GET `/admin/orders` (Admin only)
Get all orders (admin dashboard)

#### PUT `/admin/orders/:id/status` (Admin only)
Update order status

### Event Endpoints

#### GET `/events`
Get all events

**Query Parameters**:
- `upcoming`: Filter upcoming events (true/false)
- `category`: Filter by category ("workshop", "tasting", "cupping")

#### GET `/events/:id`
Get single event details

#### POST `/events/:id/register` (Protected)
Register for an event

**Request**:
```json
{
  "participants": 2
}
```

#### GET `/registrations` (Protected)
Get user's event registrations

#### POST `/events` (Admin only)
Create new event

#### PUT `/events/:id` (Admin only)
Update event

#### DELETE `/events/:id` (Admin only)
Delete event

### Subscription Endpoints

#### GET `/subscriptions`
Get available subscription plans

#### POST `/subscriptions/subscribe` (Protected)
Create new subscription

**Request**:
```json
{
  "planId": "monthly-coffee-blend",
  "frequency": "monthly",
  "quantity": 2
}
```

#### GET `/subscriptions/active` (Protected)
Get user's active subscriptions

#### PUT `/subscriptions/:id` (Protected)
Update subscription

#### DELETE `/subscriptions/:id/cancel` (Protected)
Cancel subscription

### Review Endpoints

#### GET `/reviews/product/:productId`
Get reviews for a product

#### POST `/reviews` (Protected)
Submit product review

**Request**:
```json
{
  "productId": "ethiopian-yirgacheffe",
  "rating": 5,
  "title": "Excellent Coffee",
  "comment": "Best coffee I've ever had!"
}
```

### User Profile Endpoints

#### GET `/profile` (Protected)
Get user profile

#### PUT `/profile` (Protected)
Update user profile

**Request**:
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "addresses": [...]
}
```

### Admin Endpoints

#### GET `/admin/analytics` (Admin only)
Get dashboard analytics

**Response**:
```json
{
  "totalRevenue": 45230.50,
  "totalOrders": 342,
  "totalCustomers": 156,
  "popularProducts": [...],
  "recentOrders": [...]
}
```

#### GET `/admin/users` (Admin only)
Get all users

#### PUT `/admin/users/:id` (Admin only)
Update user (make admin, etc.)

### Health Check

#### GET `/health`
Check backend health

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-01T10:30:00Z"
}
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Google Cloud Console account (for Google OAuth)
- GitHub account (for GitHub OAuth)

### Step 1: Clone and Install

```bash
# This project runs in Figma Make environment
# No installation needed if running in Figma Make

# For local development, you would:
npm install
```

### Step 2: Supabase Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your Project URL and API Keys

2. **Update Environment Variables**:
   - Update `/utils/supabase/info.tsx` with your credentials:
   ```typescript
   export const projectId = "your-project-id";
   export const publicAnonKey = "your-anon-key";
   ```

3. **Run Database Migration**:
   - Open Supabase Dashboard > SQL Editor
   - Create new query
   - Copy entire contents of `/MIGRATION.sql`
   - Click "Run" to create all tables, indexes, and RLS policies

4. **Seed Initial Data**:
   - In SQL Editor, create another new query
   - Copy entire contents of `/SEED_DATA.sql`
   - Click "Run" to populate database

5. **Deploy Edge Function**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link your project
   supabase link --project-ref your-project-ref

   # Deploy edge function
   supabase functions deploy make-server-4d0792a7
   ```

### Step 3: Initialize Data

After running the seed script, your database will contain:
- 8 coffee products (Ethiopian, Colombian, Kenyan, etc.)
- 8 brewing equipment items (espresso machines, grinders, etc.)
- 6 upcoming events (workshops and tastings)
- 4 blog posts about coffee
- 3 promotional offers and codes
- 3 homepage carousel banners

For detailed setup instructions, see `/DATABASE_SETUP_GUIDE.md`

### Step 4: OAuth Setup

This is the most critical step for social authentication to work properly.

#### Google OAuth Configuration

1. **Go to Google Cloud Console**:
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing

2. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Save Client ID and Client Secret

4. **Configure Supabase**:
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable Google provider
   - Enter Client ID and Client Secret from step 3
   - Save changes

#### GitHub OAuth Configuration

1. **Go to GitHub Settings**:
   - Visit [github.com/settings/developers](https://github.com/settings/developers)
   - Click "New OAuth App"

2. **Register Application**:
   - Application name: "Bean Boutique"
   - Homepage URL: `https://your-app-url.com`
   - Authorization callback URL:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Save Client ID and Client Secret

3. **Configure Supabase**:
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable GitHub provider
   - Enter Client ID and Client Secret from step 2
   - Save changes

#### OAuth Troubleshooting

The application includes built-in OAuth debugging tools (development only):

- **OAuth Setup Wizard**: Step-by-step configuration guide
- **OAuth Debugger**: Real-time OAuth flow monitoring
- **OAuth Troubleshooter**: Common issues and solutions

Access these tools by clicking the floating help buttons in development mode.

**Common OAuth Issues**:

1. **"accounts.google.com refused to connect"**:
   - Redirect URI not configured correctly
   - Must match exactly: `https://{project-id}.supabase.co/auth/v1/callback`
   - Check OAuth Debugger for exact URI needed

2. **"Provider not enabled"**:
   - OAuth provider not enabled in Supabase Dashboard
   - Missing Client ID or Client Secret
   - Follow OAuth Setup Wizard instructions

3. **"Invalid redirect URI"**:
   - URI in provider console doesn't match Supabase callback
   - Check for typos, http vs https, trailing slashes

See [OAuth_Setup_Guide.md](OAuth_Setup_Guide.md) for detailed troubleshooting.

### Step 5: Create Admin User

```bash
# Sign up normally through the application
# Then manually set admin flag in database:

# In Supabase Dashboard SQL Editor:
# (Replace with actual user ID from auth.users table)

# Using KV store API:
curl -X PUT https://your-project.supabase.co/functions/v1/make-server-4d0792a7/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isAdmin": true}'
```

Or use the admin endpoint (if you have service role key):
```typescript
// In server code with service role access
await kv.set(`profile:${userId}`, { ...profile, isAdmin: true });
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# In Figma Make, the app runs automatically
# Local development:
npm run dev
```

The application will:
1. Check authentication state
2. Initialize data manager
3. Attempt to connect to Supabase backend
4. Fall back to local data if backend unavailable
5. Display data source indicator in bottom-right

### Production Deployment

The application is designed to run in the Figma Make environment, but can be deployed anywhere:

1. **Vercel/Netlify** (Frontend):
   ```bash
   # Build the application
   npm run build

   # Deploy to Vercel
   vercel --prod
   ```

2. **Supabase** (Backend):
   - Edge functions automatically deployed
   - Database hosted on Supabase infrastructure
   - No additional backend hosting needed

3. **Environment Variables**:
   - Set `SUPABASE_URL`
   - Set `SUPABASE_ANON_KEY`
   - Set `SUPABASE_SERVICE_ROLE_KEY` (backend only)

## 📱 Application Pages

### Public Pages
- **Home** (`/`): Hero carousel, featured products, special offers
- **Coffee Selection** (`/coffee`): Browse coffees with filtering
- **Brewing Equipment** (`/equipment`): Browse equipment
- **Events & Workshops** (`/events`): Upcoming events and registration
- **Special Offers** (`/offers`): Current promotions
- **Subscriptions** (`/subscription`): Subscription plans
- **About** (`/about`): Company information
- **Blog** (`/blog`): Coffee articles and tips
- **FAQ** (`/faq`): Frequently asked questions
- **Contact** (`/contact`): Contact form
- **Privacy Policy** (`/privacy`): Privacy information
- **Terms of Service** (`/terms`): Terms and conditions

### Protected Pages (Require Login)
- **Shopping Cart** (`/cart`): View and manage cart
- **Checkout** (`/checkout`): Complete purchase
- **User Profile** (`/profile`): Manage account and view orders
- **Product Details** (`/product/:id`): Detailed product view with reviews

### Admin Pages (Require Admin Access)
- **Admin Dashboard** (`/admin`): Overview and analytics
  - Product Management: Add/edit/delete products
  - Order Management: View and update orders
  - Event Management: Create and manage events
  - User Management: View and manage users
  - Analytics: Sales and customer insights
  - Content Management: Edit blog posts and FAQs
  - Offer Management: Create promotions
  - Subscription Management: Manage plans

## 🎨 Theming & Customization

### Color Palette

The application uses a coffee-inspired color scheme defined in `/styles/globals.css`:

```css
--coffee-dark: #3c2414     /* Dark roast brown */
--coffee-medium: #8b4513   /* Medium roast */
--coffee-light: #cd853f    /* Light roast */
--cream: #faf8f5           /* Cream background */
--earth: #deb887           /* Earthy tan */
--warm-brown: #a0522d      /* Warm brown accents */
```

### Typography

- Base font size: 14px
- Font weights: 400 (normal), 500 (medium)
- Responsive scaling via CSS variables
- Semantic heading hierarchy (h1-h4)

### Custom Tailwind Classes

```css
.coffee-gradient      /* Coffee color gradient background */
.text-coffee-dark     /* Dark brown text */
.text-coffee-medium   /* Medium brown text */
.text-coffee-light    /* Light brown text */
.bg-coffee-dark       /* Dark brown background */
.bg-cream             /* Cream background */
.animate-on-scroll    /* Scroll animation */
```

### Dark Mode

Full dark mode support with automatic theme switching:
- Dark color palette defined in CSS
- Tailwind dark mode classes
- Consistent across all components

## 🧪 Development Tools

### Data Source Indicator

Visual indicator (bottom-right corner) showing:
- 🟢 Green: Connected to Supabase backend
- 🟡 Yellow: Using cached data
- 🔴 Red: Using local fallback data

Click indicator to see detailed status.

### OAuth Debug Tools

Development-only tools for OAuth configuration:

1. **OAuth Setup Wizard** (floating "📋" button):
   - Step-by-step configuration guide
   - Copy-pasteable values
   - Links to provider consoles

2. **OAuth Debugger** (floating "🔍" button):
   - Real-time OAuth flow monitoring
   - URL validation
   - Error detection

3. **OAuth Troubleshooter** (floating "🛠️" button):
   - Common issue detection
   - Configuration validation
   - Actionable solutions

### Cart Debug Helper

Development tool for testing cart functionality:
- View current cart state
- Test add/remove operations
- Monitor backend sync

## 🐛 Troubleshooting

### Backend Connection Issues

**Symptom**: "Using local data" indicator

**Solutions**:
1. Check Supabase project status
2. Verify Edge Function is deployed
3. Check console for detailed errors
4. Ensure CORS headers are configured
5. Verify API keys in `/utils/supabase/info.tsx`

### Authentication Issues

**Symptom**: "Unauthorized" errors

**Solutions**:
1. Check if user is logged in
2. Verify access token is being sent
3. Check token expiration
4. Try signing out and back in

### OAuth Not Working

**Symptom**: "Provider not enabled" or redirect errors

**Solutions**:
1. Open OAuth Setup Wizard
2. Verify redirect URIs match exactly
3. Check provider is enabled in Supabase
4. Verify Client ID and Secret are configured
5. Use OAuth Debugger to diagnose

See detailed OAuth troubleshooting in [OAuth_Setup_Guide.md](OAuth_Setup_Guide.md).

### Cart Not Syncing

**Symptom**: Cart clears on page refresh

**Solutions**:
1. Ensure user is authenticated
2. Check backend connection (data source indicator)
3. Look for errors in browser console
4. Verify `/cart` API endpoint is responding

### Admin Access Issues

**Symptom**: Can't access admin dashboard

**Solutions**:
1. Verify `isAdmin` flag in user profile
2. Check profile exists: `profile:{userId}` in KV store
3. Manually set admin flag (see Setup Step 5)

## 📊 Data Management

### Data Manager System

The `data-manager.ts` module provides intelligent data handling:

**Features**:
- Automatic backend health checking
- Smart caching with TTL
- Graceful fallback to local data
- Data source tracking
- Error handling and retry logic

**Usage**:
```typescript
import { dataManager } from './utils/data-manager';

// Initialize (called automatically on app start)
await dataManager.initializeData();

// Get data (automatically uses best source)
const products = dataManager.getProducts();
const events = dataManager.getEvents();

// Check status
const status = dataManager.getStatus();
console.log(status.source); // 'backend', 'cache', or 'local'
```

### Data Persistence

**Backend Data**:
- Stored in Supabase PostgreSQL
- Accessed via KV store API
- Real-time updates supported
- Persistent across sessions

**Frontend Data**:
- Cart stored in localStorage for guests
- Cart synced to backend for authenticated users
- Session tokens in localStorage
- Cached data in memory (temporary)

### Sample Data

The application includes comprehensive sample data:
- 12 diverse coffee products (light, medium, dark roasts)
- 8 brewing equipment items (espresso machines, grinders, etc.)
- 6 upcoming events (workshops, tastings, cuppings)
- 3 subscription plans (weekly, monthly, quarterly)
- Blog posts about coffee
- FAQ entries
- Special offers and promotions

Sample data is automatically loaded on backend initialization.

## 🔒 Security Considerations

### API Security

- **Service Role Key**: Never exposed to frontend
- **Anon Key**: Safe for frontend use (public)
- **Access Tokens**: Short-lived JWTs
- **CORS**: Configured for specific origins
- **Input Validation**: All user inputs sanitized

### Data Security

- **Row Level Security**: Not implemented yet (using KV store)
- **User Isolation**: User-specific data keyed by userId
- **Admin-Only Routes**: Verified on backend
- **SQL Injection**: Not applicable (JSONB storage)

### Frontend Security

- **XSS Protection**: React automatically escapes
- **CSRF**: JWT tokens prevent CSRF
- **Secure Storage**: Tokens in localStorage
- **HTTPS**: Required for OAuth and production

## 📈 Performance Optimization

### Frontend Optimization

- **Code Splitting**: React lazy loading ready
- **Image Optimization**: Unsplash CDN images
- **Caching Strategy**: Data manager caching
- **Debouncing**: Search and filter inputs
- **Lazy Loading**: Product images with fallback

### Backend Optimization

- **Edge Functions**: Low latency worldwide
- **Database Indexing**: Key-based lookups are fast
- **Connection Pooling**: Automatic with Supabase
- **JSONB**: Efficient storage and queries

### Bundle Size

- Tree-shaking enabled
- Tailwind CSS purging
- Minimal dependencies
- No large libraries (except Recharts for charts)

## 🧩 Component Architecture

### Core Components

- **App.tsx**: Main application with routing and context
- **Navigation.tsx**: Responsive navigation bar
- **Footer.tsx**: Site footer with links
- **AuthModal.tsx**: Sign in/sign up modal

### Page Components

Each page is a self-contained component in `/components/pages/`:
- Handles own state
- Fetches own data
- Responsive layout
- Scroll animations

### UI Components

Reusable components from Shadcn/UI in `/components/ui/`:
- Buttons, inputs, modals
- Cards, tables, forms
- Customized with theme colors
- Accessible and responsive

### Hooks

Custom hooks in `/hooks/`:
- `useBackendCart`: Cart management
- `useProducts`: Product data fetching

### Context API

Two main contexts:
- **AuthContext**: User authentication state
- **CartContext**: Shopping cart state

## 📚 Additional Documentation

- **[Guidelines.md](guidelines/Guidelines.md)**: Development guidelines
- **[OAuth_Setup_Guide.md](OAuth_Setup_Guide.md)**: OAuth configuration
- **[FIXES_APPLIED.md](FIXES_APPLIED.md)**: Bug fixes and improvements
- **[Attributions.md](Attributions.md)**: Image and resource credits

## 🤝 Contributing

This project is part of the Figma Make platform. For improvements:

1. Test changes thoroughly
2. Maintain existing code style
3. Update documentation
4. Follow guidelines in `Guidelines.md`
5. Ensure backward compatibility

## 📄 License

This project is created for demonstration purposes in Figma Make.

## 🆘 Support

For issues with:
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **OAuth Setup**: See OAuth_Setup_Guide.md
- **Figma Make**: Contact Figma support

## 🎯 Roadmap

Future enhancements:
- [ ] Real payment processing (Stripe integration)
- [ ] Email notifications for orders
- [ ] Real-time order tracking
- [ ] Customer support chat
- [ ] Loyalty points program
- [ ] Product recommendations
- [ ] Advanced search with AI
- [ ] Mobile app (React Native)
- [ ] Inventory management
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Performance monitoring
- [ ] A/B testing framework

## 🙏 Acknowledgments

- **Unsplash**: Product and hero images
- **Lucide**: Beautiful icon library
- **Shadcn/UI**: Excellent component library
- **Supabase**: Amazing backend platform
- **Tailwind CSS**: Best utility-first CSS framework
- **Figma Make**: Platform that made this possible

---

**Built with ☕ and ❤️ by the Bean Boutique team**

For questions or feedback, visit our [Contact Page](#) or email hello@beanboutique.com