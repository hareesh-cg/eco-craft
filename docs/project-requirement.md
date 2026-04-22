# EcoCraft — Project Requirements

## Overview

**Project Name:** EcoCraft  
**Type:** College Demo Project  
**Purpose:** A platform focused on upcycled plastic decor products, waste selling, job creation, and engineering innovation.  
**Audience:** Buyers, Sellers, Job Seekers, Admins  
**Demo:** 1–2 times only. Not production. Not security-critical.  
**Goal:** Bare minimum functionality, maximum visual impact.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Hosting | Vercel (free tier) |

---

## Design System

- **Theme:** Eco-friendly, modern, clean
- **Primary Color:** Green (`#16a34a` / `green-600`)
- **Accent Color:** Amber/Earthy tones (`#d97706`)
- **Background:** Off-white / light gray (`#f9fafb`)
- **Font:** Inter (sans-serif)
- **Style:** Card-based layouts, subtle shadows, rounded corners, smooth transitions
- **Responsive:** Mobile-first, works on all screen sizes

---

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing / Home | Public |
| `/about` | About Us | Public |
| `/contact` | Contact Us | Public |
| `/auth/login` | Login | Public |
| `/auth/signup` | Sign Up | Public |
| `/shop` | Product Listing | Public |
| `/shop/[id]` | Product Detail | Public |
| `/cart` | Cart & Checkout | Buyer |
| `/waste` | Waste Listings | Public |
| `/waste/sell` | Upload Waste | Seller |
| `/jobs` | Job Listings | Public |
| `/jobs/[id]` | Job Detail + Apply | Job Seeker |
| `/innovation` | Innovation Showcase | Public |
| `/innovation/submit` | Submit Idea | Authenticated |
| `/dashboard` | Role-based Dashboard | Authenticated |
| `/admin` | Admin Panel | Admin |

---

## Feature Specifications

### 1. User Authentication

**Provider:** Supabase Auth (email + password)

**Roles:**
- `buyer` — can browse products, add to cart, contact waste sellers
- `seller` — can list products and upload waste items
- `job_seeker` — can browse and apply for jobs
- `admin` — full access to admin panel

**Pages:**
- `/auth/signup` — Name, Email, Password, Role selection (dropdown)
- `/auth/login` — Email, Password
- After login → redirect to `/dashboard` based on role
- Logout button in navbar (when logged in)

**Supabase Table: `profiles`**
```sql
id uuid references auth.users primary key
full_name text
email text
role text check (role in ('buyer', 'seller', 'job_seeker', 'admin'))
avatar_url text
created_at timestamptz default now()
```

---

### 2. E-commerce Section

**Purpose:** Display and sell upcycled plastic decor products.

**Categories:**
- Home Decor
- Jewelry
- Accessories

**Product Listing Page (`/shop`):**
- Grid of product cards (image, name, price, category badge)
- Filter by category (tabs or sidebar)
- Search bar (filter by name)
- "Add to Cart" button on each card

**Product Detail Page (`/shop/[id]`):**
- Large product image
- Name, description, price, category
- Seller info (name only)
- Quantity selector
- Add to Cart button

**Cart (`/cart`):**
- List of cart items (image, name, price, quantity)
- Update quantity / remove item
- Order total
- "Checkout" button (mock — shows success message, no real payment)

**Supabase Tables:**

`products`
```sql
id uuid primary key default gen_random_uuid()
seller_id uuid references profiles(id)
name text
description text
price numeric
category text check (category in ('home_decor', 'jewelry', 'accessories'))
image_url text
stock integer default 10
status text default 'active' check (status in ('active', 'pending', 'rejected'))
created_at timestamptz default now()
```

`cart_items` (client-side state or localStorage — no DB needed for demo)

`orders` (optional, simple table for demo)
```sql
id uuid primary key default gen_random_uuid()
buyer_id uuid references profiles(id)
items jsonb
total numeric
status text default 'placed'
created_at timestamptz default now()
```

---

### 3. Waste Selling Section

**Purpose:** Allow users to upload plastic waste items for buyers or recyclers to contact them.

**Waste Upload Form (`/waste/sell`):**
- Item name / description
- Waste type (Plastic Bottles, Wrappers, Hard Plastic, Mixed)
- Quantity (kg or units)
- Location (city/area text field)
- Price per kg (optional)
- Image upload (Supabase Storage)

**Waste Listings Page (`/waste`):**
- Card grid showing waste items
- Filter by waste type
- Each card shows: image, type, quantity, location, price, seller name
- "Contact Seller" button → shows seller email/phone (mock)

**Supabase Table: `waste_listings`**
```sql
id uuid primary key default gen_random_uuid()
seller_id uuid references profiles(id)
title text
description text
waste_type text check (waste_type in ('plastic_bottles', 'wrappers', 'hard_plastic', 'mixed'))
quantity numeric
unit text default 'kg'
location text
price_per_unit numeric
image_url text
status text default 'active' check (status in ('active', 'pending', 'rejected', 'sold'))
created_at timestamptz default now()
```

---

### 4. Job Portal

**Purpose:** Connect youth and adults (40–55) with eco-industry jobs.

**Job Categories:**
- Crafting
- Collection
- Design
- Delivery

**Job Listings Page (`/jobs`):**
- List/grid of job cards
- Filter by category
- Each card: title, company, location, type (full-time/part-time), salary range

**Job Detail Page (`/jobs/[id]`):**
- Full job description
- Requirements
- "Apply Now" button → opens modal form

**Apply Modal Form:**
- Name (pre-filled if logged in)
- Email (pre-filled if logged in)
- Phone number
- Brief cover letter (textarea)
- Submit → shows "Application Submitted!" toast

**Supabase Tables:**

`job_listings`
```sql
id uuid primary key default gen_random_uuid()
title text
company text
location text
category text check (category in ('crafting', 'collection', 'design', 'delivery'))
job_type text check (job_type in ('full_time', 'part_time', 'contract'))
salary_range text
description text
requirements text
age_preference text
status text default 'active'
created_at timestamptz default now()
```

`job_applications`
```sql
id uuid primary key default gen_random_uuid()
job_id uuid references job_listings(id)
applicant_id uuid references profiles(id)
name text
email text
phone text
cover_letter text
created_at timestamptz default now()
```

---

### 5. Engineering Innovation Section

**Purpose:** Showcase creative recycled product ideas and articles.

**Innovation Page (`/innovation`):**
- Masonry/grid of innovation cards
- Each card: image, title, author, short description, tags
- Click → full detail view

**Submit Idea (`/innovation/submit`) — authenticated only:**
- Title
- Description (rich textarea)
- Tags (e.g., "Plastic", "Furniture", "Lighting")
- Image upload
- Submit for review

**Blog/Articles:**
- Seeded with 3–5 demo articles about recycling and sustainability

**Supabase Table: `innovations`**
```sql
id uuid primary key default gen_random_uuid()
author_id uuid references profiles(id)
title text
description text
tags text[]
image_url text
status text default 'pending' check (status in ('pending', 'approved', 'rejected'))
created_at timestamptz default now()
```

---

### 6. Admin Panel

**Route:** `/admin` — accessible only to users with `role = 'admin'`

**Sections:**

**Dashboard Overview:**
- Stats cards: Total Users, Total Products, Waste Listings, Job Applications, Innovations
- Recent activity feed

**User Management:**
- Table of all users (name, email, role, joined date)
- Change role button

**Product Management:**
- Table of all products
- Approve / Reject pending products
- Delete product

**Waste Listings Management:**
- Table of all waste listings
- Mark as sold / reject

**Job Management:**
- Add new job listing (form)
- View applications per job
- Delete job

**Innovation Management:**
- Approve / Reject submitted ideas

---

### 7. Landing Page (`/`)

**Sections (top to bottom):**

1. **Hero Section**
   - Full-width banner with tagline: *"Turning Plastic Waste into Beautiful Futures"*
   - Two CTA buttons: "Shop Now" and "Sell Your Waste"
   - Background: gradient green or hero image of eco products

2. **Stats Bar**
   - Animated counters: Products Listed, Waste Collected (kg), Jobs Created, Innovations Shared

3. **Featured Products**
   - 4–6 product cards (latest or featured)

4. **How It Works**
   - 3-step flow: Upload Waste → Get Paid → Products Created

5. **Job Opportunities Teaser**
   - Brief section with job categories and "Explore Jobs" CTA

6. **Innovation Spotlight**
   - 2–3 featured innovation cards

7. **Testimonials**
   - 3 mock testimonial cards

8. **CTA Banner**
   - "Join EcoCraft Today" with Sign Up button

9. **Footer**
   - Links, social icons, tagline

---

### 8. About Us Page (`/about`)

**Sections:**
- Mission statement
- Vision
- How EcoCraft works (timeline)
- Team section (3–4 mock members with avatar)
- Impact numbers

---

### 9. Contact Us Page (`/contact`)

**Sections:**
- Contact form (Name, Email, Subject, Message) → mock submit (no email sending)
- Address, phone, email info cards
- Embedded Google Map placeholder (static image)

---

## Shared UI Components

| Component | Description |
|---|---|
| `Navbar` | Logo, links, auth buttons, mobile hamburger |
| `Footer` | Links, social, copyright |
| `ProductCard` | Image, name, price, category, add-to-cart |
| `WasteCard` | Image, type, quantity, location, contact |
| `JobCard` | Title, company, location, category badge |
| `InnovationCard` | Image, title, tags, author |
| `ApplyModal` | Job application form modal |
| `AuthGuard` | Redirect unauthenticated users |
| `AdminGuard` | Redirect non-admin users |
| `StatusBadge` | Colored badge (active, pending, rejected) |
| `SearchFilter` | Reusable search + filter bar |

---

## Demo Data (Seed)

To be seeded in Supabase for demo day:

- **Users:** 1 admin, 2 buyers, 2 sellers, 1 job seeker
- **Products:** 10–12 eco products across all categories (with Unsplash images)
- **Waste Listings:** 4–5 listings
- **Jobs:** 6–8 job listings across all categories
- **Innovations:** 4–5 approved innovation ideas
- **Profiles:** All with avatars and realistic names

---

## Folder Structure (Next.js App Router)

```
eco-craft/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Landing
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── shop/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── cart/page.tsx
│   ├── waste/
│   │   ├── page.tsx
│   │   └── sell/page.tsx
│   ├── jobs/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── innovation/
│   │   ├── page.tsx
│   │   └── submit/page.tsx
│   ├── dashboard/page.tsx
│   └── admin/page.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── shop/
│   ├── waste/
│   ├── jobs/
│   ├── innovation/
│   └── admin/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
└── supabase/
    ├── schema.sql
    └── seed.sql
```

---

## Development Phases

### Phase 1 — Setup & Foundation
- Initialize Next.js project
- Configure Tailwind CSS + shadcn/ui
- Set up Supabase project (auth, tables, storage)
- Build Navbar, Footer, layout
- Landing page (all sections)

### Phase 2 — Auth & Dashboard
- Sign up / Login pages
- Role-based dashboard
- Auth guards

### Phase 3 — E-commerce
- Product listing page
- Product detail page
- Cart (localStorage)
- Mock checkout

### Phase 4 — Waste & Jobs
- Waste listing page
- Waste upload form
- Job listing page
- Job detail + apply modal

### Phase 5 — Innovation & Static Pages
- Innovation showcase
- Submit idea form
- About Us page
- Contact Us page

### Phase 6 — Admin Panel
- Admin dashboard
- User, product, waste, job, innovation management tables

### Phase 7 — Polish & Seed Data
- Add demo data (seed.sql)
- Animations and transitions
- Mobile responsiveness pass
- Final review

---

## Out of Scope (for demo)

- Real payment gateway
- Email notifications
- Real-time chat
- PWA / offline support
- SEO optimization
- Security hardening
- Unit / integration tests
