# Bean Boutique

> An e-commerce platform and community hub for specialty coffee bean subscriptions, artisanal brewing equipment, workshops, and coffee culture content.

[![Continuous Integration](https://github.com/bean-boutique/bean-boutique/actions/workflows/ci.yml/badge.svg)](https://github.com/bean-boutique/bean-boutique/actions/workflows/ci.yml)

## Table of Contents
- [Overview](#overview)
- [Screenshots \& Demo](#screenshots--demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Testing \& Quality Assurance](#testing--quality-assurance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Open Questions](#open-questions)

---

## Overview

Bean Boutique is an end-to-end e-commerce and community web application designed for coffee enthusiasts. It allows users to discover and purchase single-origin specialty coffees and brewing equipment, subscribe to recurring coffee deliveries, register for tasting workshops, and read community blog posts.

The application combines a React single-page application (SPA) built with Vite and Tailwind CSS on the frontend with a serverless Hono backend running on Deno / Supabase Edge Functions. The backend communicates with a Supabase PostgreSQL database protected with Row Level Security (RLS) policies. Built-in rate limiting, HTTP security headers, dynamic Cache-Control policies, and offline fallback mock mechanisms ensure reliability and data security.

---

## Screenshots & Demo

*(Screenshots can be added here)*

- **Homepage & Catalog:** `docs/screenshots/catalog.png`
- **Admin Dashboard:** `docs/screenshots/admin-dashboard.png`
- **Checkout & Subscriptions:** `docs/screenshots/checkout.png`

---

## Features

- **Product Catalog & Details:** Browse, filter, and search specialty coffees and brewing gear with real-time rating updates and customer reviews.
- **Shopping Cart & Checkout:** Persistent online cart with streamlined checkout and order creation.
- **Coffee Subscriptions:** Flexible recurring subscription plans (weekly box, monthly club, quarterly discovery) with pause, update, and cancellation capabilities.
- **Community Events & Workshops:** Event listing and participant registration for coffee brewing masterclasses and cupping sessions.
- **User Authentication & Profiles:** Email/password authentication and social OAuth (Google, GitHub) via Supabase Auth, with user profile management and order history tracking.
- **Admin Dashboard:** Management portal for administrative users to manage products, view analytics, process orders, manage users, and configure promotional offers.
- **Resilient Fallback Mode:** Automatic graceful degradation to local mock data if the backend API or network connection is unavailable.
- **Edge Security & Performance:** Hono serverless middleware delivering custom sliding-window rate limiting, HTTP security headers (CSP, HSTS, X-Frame-Options), and CDN cache-control headers.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript 5, Vite 6, Tailwind CSS, Radix UI primitives, Lucide React icons, Recharts |
| **Backend & Compute** | Hono, Deno Deploy / Supabase Edge Functions (`/functions/v1/make-server-4d0792a7`) |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth (JWT & Social OAuth), Row Level Security (RLS) |
| **Tooling & CI** | Node.js v20, npm, GitHub Actions CI workflow |

---

## Architecture

Bean Boutique follows a decoupled Client-Server architecture utilizing serverless edge compute for low latency.

```mermaid
graph TD
    Client[React 18 SPA / Vite] -->|HTTPS Requests / JWT Bearer| EdgeFunc[Deno / Supabase Edge Function]
    Client -->|Direct Auth Operations| SupaAuth[Supabase Auth Engine]

    subgraph Edge Compute Layer (Hono Engine)
        EdgeFunc --> RateLimit[Sliding-Window Rate Limiter]
        RateLimit --> SecHeaders[Security & Cache Headers]
        SecHeaders --> Router[Hono Route Controllers]
    end

    Router -->|Postgres / Service Role Client| SupaDB[(Supabase PostgreSQL)]
    Router -->|Auth Token Verification| SupaAuth

    subgraph Resiliency Mechanism
        Client -.->|Network Outage / Offline Fallback| LocalMockData[Client DataManager / Local Fallback]
    end
```

---

## Prerequisites

Before starting, ensure you have the following software installed:

- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Supabase CLI** *(optional, for running local Supabase or deploying edge functions)*: `v1.x`

---

## Installation

Follow these steps to set up the development environment locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bean-boutique/bean-boutique.git
   cd bean-boutique
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory (or set environment variables in your environment) using `.env.example` as a template:
   ```bash
   cp .env.example .env
   ```

4. **Database Setup (Supabase):**
   Execute the migration SQL script `src/guidelines/MIGRATION.sql` and seed data `src/guidelines/SEED_DATA.sql` inside your Supabase project SQL Editor.

5. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## Environment Variables

The application references the following environment variables:

| Variable | Description | Required | Default Value / Fallback |
| :--- | :--- | :---: | :--- |
| `VITE_SUPABASE_PROJECT_ID` | Supabase Project Reference Identifier | Optional | `exufontwxqjrnpmyisso` |
| `VITE_SUPABASE_ANON_KEY` | Public Anon JWT key for Supabase API access | Optional | Pre-configured anon key |
| `VITE_SUPABASE_URL` | Base URL of the Supabase instance | Optional | `https://<PROJECT_ID>.supabase.co` |
| `VITE_ENV` | Environment mode (`development` or `production`) | Optional | `development` |
| `SUPABASE_URL` | Supabase URL referenced by backend Edge Function | Required (Edge) | Injected by Supabase Edge runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin privileges in Edge Function | Required (Edge) | Injected by Supabase Edge runtime |
| `SUPABASE_ANON_KEY` | Anon key referenced by Edge Function | Required (Edge) | Injected by Supabase Edge runtime |

---

## Usage

### Development Commands

Run local Vite development server:
```bash
npm run dev
```

### Production Build

Compile and bundle the production single-page application:
```bash
npm run build
```

Preview the production build locally:
```bash
npx vite preview
```

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline configuration
├── src/
│   ├── App.tsx                  # Root application component and routing layout
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles and Tailwind CSS configurations
│   ├── components/              # UI components and page layouts
│   │   ├── ErrorBoundary.tsx    # React error boundary component
│   │   ├── Header.tsx           # Global header navigation component
│   │   ├── Navigation.tsx       # Primary menu and route navigation links
│   │   ├── Footer.tsx           # Application footer component
│   │   ├── AuthModal.tsx        # Login / Registration modal dialog
│   │   ├── pages/               # Page-level components (Home, Products, Admin, etc.)
│   │   └── ui/                  # Reusable UI component primitives (Radix UI / Tailwind)
│   ├── hooks/                   # Custom React hooks (useProducts, useEvents, useLocalCart)
│   ├── utils/                   # Client utilities and Supabase database handlers
│   │   ├── env.ts               # Centralized environment variable manager
│   │   ├── data-manager.ts      # Data access layer with offline fallback handling
│   │   ├── database-service.ts  # Direct Supabase client queries
│   │   └── admin-db.ts          # Admin role verification helper
│   └── supabase/
│       └── functions/
│           └── server/          # Deno/Hono serverless backend implementation
│               ├── index.tsx    # Hono API router, rate limiter, middleware, endpoints
│               ├── db.tsx       # Backend Supabase client bindings
│               └── kv_store.tsx # Backend key-value storage interface
├── AUDIT_REPORT.md              # 13-Layer architecture audit report
├── package.json                 # Project manifest and scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build tool configuration
└── README.md                    # Project documentation
```

---

## API Reference

The serverless API is exposed at `/make-server-4d0792a7` via the Deno/Hono Edge Function. Key routes include:

### System & Health
- `GET /make-server-4d0792a7/health` — Returns system status (`status: "ok"`).

### Authentication & Users
- `POST /make-server-4d0792a7/auth/signup` — Registers a new user account.
- `GET /make-server-4d0792a7/profile` — Fetches current user profile (Requires Auth).
- `PUT /make-server-4d0792a7/profile` — Updates user profile details (Requires Auth).

### Products & Reviews
- `GET /make-server-4d0792a7/products` — Fetches all products (Supports `category` & `featured` query parameters).
- `GET /make-server-4d0792a7/products/:id` — Fetches detailed product information.
- `POST /make-server-4d0792a7/products` — Creates a new product (Requires Admin).
- `PUT /make-server-4d0792a7/products/:id` — Updates product information (Requires Admin).
- `DELETE /make-server-4d0792a7/products/:id` — Deletes a product (Requires Admin).
- `GET /make-server-4d0792a7/reviews/product/:productId` — Fetches reviews for a product.
- `POST /make-server-4d0792a7/reviews` — Submits a customer product review (Requires Auth).

### Shopping Cart & Orders
- `GET /make-server-4d0792a7/cart` — Retrieves current user's shopping cart (Requires Auth).
- `POST /make-server-4d0792a7/cart` — Updates cart items (Requires Auth).
- `POST /make-server-4d0792a7/orders` — Places a new order and clears cart (Requires Auth).
- `GET /make-server-4d0792a7/orders` — Retrieves order history for current user (Requires Auth).
- `GET /make-server-4d0792a7/admin/orders` — Lists all platform orders (Requires Admin).
- `PUT /make-server-4d0792a7/admin/orders/:id/status` — Updates order fulfillment status (Requires Admin).

### Subscriptions & Events
- `GET /make-server-4d0792a7/subscriptions` — Lists available subscription plans.
- `GET /make-server-4d0792a7/subscriptions/active` — Lists user's active subscriptions (Requires Auth).
- `POST /make-server-4d0792a7/subscriptions/subscribe` — Subscribes user to a plan (Requires Auth).
- `DELETE /make-server-4d0792a7/subscriptions/:id/cancel` — Cancels an active subscription (Requires Auth).
- `GET /make-server-4d0792a7/events` — Lists upcoming coffee workshops and events.
- `POST /make-server-4d0792a7/events/:id/register` — Registers user for an event (Requires Auth).

### Admin & Analytics
- `GET /make-server-4d0792a7/admin/analytics` — Fetches total revenue, order count, and sales statistics (Requires Admin).
- `GET /make-server-4d0792a7/admin/users` — Fetches all user records (Requires Admin).

---

## Testing & Quality Assurance

### Type Checking
Run TypeScript type-checking to ensure no compilation errors exist across frontend components:
```bash
npx tsc --noEmit
```

### Continuous Integration Pipeline
The project includes an automated GitHub Actions CI workflow in `.github/workflows/ci.yml` that performs the following steps on pushes and pull requests:
1. Installs Node.js dependencies via `npm ci --legacy-peer-deps`.
2. Validates type safety using `npx tsc --noEmit`.
3. Verifies production build creation via `npm run build`.

---

## Deployment

### Frontend Deployment
The React application is built as a static site via Vite and can be hosted on platforms such as Cloudflare Pages, Vercel, Netlify, or AWS S3/CloudFront.

Build command for hosting services:
```bash
npm run build
```
Output directory: `dist/`

### Backend Function Deployment
The backend Edge Function runs on Deno Deploy / Supabase Edge Functions.

To deploy function updates using the Supabase CLI:
```bash
supabase functions deploy make-server-4d0792a7 --no-verify-jwt
```

---

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Run `npx tsc --noEmit` and `npm run build` to ensure all checks pass.
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request.

---

## License

No license specified.

---

## Open Questions

1. **Email Service Configuration:** User signup currently auto-confirms user emails because an SMTP service is not attached to the Supabase instance. Is an external email service integration (e.g., Resend or SendGrid) planned for production?
2. **Payment Gateway Integration:** Orders are processed through a simulated checkout payload. Should a payment gateway like Stripe or PayPal be integrated into the Hono API routes?
