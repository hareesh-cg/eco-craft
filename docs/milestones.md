# EcoCraft — Milestones

> Living document. Check off each task as it is completed.

---

## Phase 1 — Setup & Foundation

### 1.1 Project Initialization
- [x] Initialize Next.js 14 project with App Router (`create-next-app`)
- [x] Configure TypeScript
- [x] Install and configure Tailwind CSS
- [x] Install and configure shadcn/ui
- [x] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `clsx`, `tailwind-merge`
- [x] Set up `.env.local` with Supabase URL and anon key
- [x] Verify dev server runs on `localhost:3000`

### 1.2 Supabase Setup
- [x] Create Supabase project
- [x] Create `profiles` table
- [x] Create `products` table
- [x] Create `waste_listings` table
- [x] Create `job_listings` table
- [x] Create `job_applications` table
- [x] Create `innovations` table
- [x] Create `orders` table
- [x] Enable Row Level Security (RLS) on all tables
- [x] Create Supabase Storage bucket for product images
- [x] Create Supabase Storage bucket for waste images
- [x] Create Supabase Storage bucket for innovation images
- [x] Test Supabase connection from Next.js

### 1.3 Project Structure
- [x] Create `lib/supabase/client.ts` (browser client)
- [x] Create `lib/supabase/server.ts` (server client)
- [x] Create `lib/utils.ts` (cn helper and shared utilities)
- [x] Create `types/index.ts` (TypeScript types for all tables)
- [x] Set up `app/layout.tsx` with global font and metadata

### 1.4 Layout Components
- [x] Build `Navbar` component (logo, links, auth buttons, mobile menu)
- [x] Build `Footer` component (links, social icons, tagline, copyright)
- [x] Wrap app layout with Navbar and Footer
- [x] Verify Navbar is responsive on mobile

### 1.5 Landing Page (`/`)
- [x] Hero section (tagline, two CTA buttons, background gradient)
- [x] Stats bar (Products Listed, Waste Collected, Jobs Created, Innovations)
- [x] Featured Products section (static placeholder cards)
- [x] How It Works section (3-step flow)
- [x] Job Opportunities teaser section
- [x] Innovation Spotlight section
- [x] Testimonials section (3 mock cards)
- [x] CTA Banner ("Join EcoCraft Today")
- [x] Verify landing page is fully responsive

---

## Phase 2 — Authentication & Dashboard

### 2.1 Auth Pages
- [x] Build `/auth/signup` page (Name, Email, Password, Role dropdown)
- [x] Build `/auth/login` page (Email, Password)
- [x] Connect signup form to Supabase Auth + insert into `profiles`
- [x] Connect login form to Supabase Auth
- [x] Add redirect to `/dashboard` after successful login
- [x] Add logout button to Navbar (visible when logged in)
- [x] Show logged-in user's name in Navbar

### 2.2 Auth Guards
- [x] Create `AuthGuard` component (redirect to `/auth/login` if not logged in)
- [x] Create `AdminGuard` component (redirect if role is not `admin`)
- [x] Protect `/cart`, `/waste/sell`, `/innovation/submit`, `/dashboard`, `/admin`

### 2.3 Role-based Dashboard (`/dashboard`)
- [x] Fetch current user profile and role from Supabase
- [x] Buyer dashboard: order history, saved items
- [x] Seller dashboard: my products, my waste listings
- [x] Job Seeker dashboard: applied jobs
- [x] Admin dashboard: redirect to `/admin`

---

## Phase 3 — E-commerce

### 3.1 Product Listing Page (`/shop`)
- [x] Fetch all active products from Supabase
- [x] Build `ProductCard` component (image, name, price, category badge, add-to-cart)
- [x] Render product grid
- [x] Add category filter (tabs: All, Home Decor, Jewelry, Accessories)
- [x] Add search bar (filter by product name)
- [x] Verify responsive grid layout

### 3.2 Product Detail Page (`/shop/[id]`)
- [x] Fetch single product by ID from Supabase
- [x] Display product image, name, description, price, category
- [x] Display seller name
- [x] Quantity selector (increment / decrement)
- [x] Add to Cart button

### 3.3 Cart (`/cart`)
- [x] Set up cart state using `localStorage`
- [x] Display cart items (image, name, price, quantity)
- [x] Update quantity in cart
- [x] Remove item from cart
- [x] Calculate and display order total
- [x] "Checkout" button → mock success message / toast
- [x] Show cart item count badge in Navbar

---

## Phase 4 — Waste Selling

### 4.1 Waste Listings Page (`/waste`)
- [x] Fetch all active waste listings from Supabase
- [x] Build `WasteCard` component (image, type, quantity, location, price, contact button)
- [x] Render waste listings grid
- [x] Add waste type filter
- [x] "Contact Seller" button → show seller email in modal (mock)

### 4.2 Waste Upload Form (`/waste/sell`)
- [x] Build waste upload form (title, description, type, quantity, unit, location, price)
- [x] Add image upload field (upload to Supabase Storage)
- [x] Submit form → insert into `waste_listings` table with `status = 'pending'`
- [x] Show success toast after submission

---

## Phase 5 — Job Portal

### 5.1 Job Listings Page (`/jobs`)
- [x] Fetch all active job listings from Supabase
- [x] Build `JobCard` component (title, company, location, category badge, job type)
- [x] Render job listings grid
- [x] Add category filter (Crafting, Collection, Design, Delivery)

### 5.2 Job Detail Page (`/jobs/[id]`)
- [x] Fetch single job by ID
- [x] Display full job description, requirements, salary range, age preference
- [x] "Apply Now" button → open apply modal

### 5.3 Apply Modal
- [x] Build `ApplyModal` component
- [x] Pre-fill name and email if user is logged in
- [x] Phone number field
- [x] Cover letter textarea
- [x] Submit → insert into `job_applications` table
- [x] Show "Application Submitted!" toast

---

## Phase 6 — Engineering Innovation

### 6.1 Innovation Showcase Page (`/innovation`)
- [x] Fetch all approved innovations from Supabase
- [x] Build `InnovationCard` component (image, title, tags, author, short description)
- [x] Render innovation grid
- [x] Click card → expand or navigate to detail view

### 6.2 Submit Idea Page (`/innovation/submit`)
- [x] Build submit idea form (title, description, tags, image upload)
- [x] Upload image to Supabase Storage
- [x] Submit → insert into `innovations` table with `status = 'pending'`
- [x] Show success message

---

## Phase 7 — Static Pages

### 7.1 About Us Page (`/about`)
- [x] Mission statement section
- [x] Vision section
- [x] How EcoCraft Works timeline
- [x] Team section (4 mock members with avatars)
- [x] Impact numbers section

### 7.2 Contact Us Page (`/contact`)
- [x] Contact form (Name, Email, Subject, Message)
- [x] Mock submit → show success toast (no email sending)
- [x] Info cards (address, phone, email)
- [x] Static map placeholder image

---

## Phase 8 — Admin Panel

### 8.1 Admin Dashboard (`/admin`)
- [x] Stats overview cards (Total Users, Products, Waste Listings, Job Applications, Innovations)
- [x] Sidebar or tab navigation for all sections

### 8.2 User Management
- [x] Fetch and display all users in a table
- [x] Show name, email, role, joined date
- [x] Change role dropdown per user

### 8.3 Product Management
- [x] Fetch and display all products in a table
- [x] Approve / Reject pending products (update `status`)
- [x] Delete product

### 8.4 Waste Listing Management
- [x] Fetch and display all waste listings in a table
- [x] Mark as sold / reject listing

### 8.5 Job Management
- [x] Fetch and display all job listings in a table
- [x] Add new job listing (inline form or modal)
- [x] View applications count per job
- [x] Delete job listing

### 8.6 Innovation Management
- [x] Fetch and display all innovations in a table
- [x] Approve / Reject submitted ideas

---

## Phase 9 — Seed Data

### 9.1 Demo Data
- [x] Create seed script (`supabase/seed.sql`)
- [ ] Seed 1 admin, 2 buyers, 2 sellers, 1 job seeker into `profiles`
- [x] Seed 10–12 products across all categories (Unsplash image URLs)
- [x] Seed 4–5 waste listings
- [x] Seed 6–8 job listings across all categories
- [x] Seed 4–5 approved innovations
- [x] Run seed script on Supabase and verify data appears on all pages

---

## Phase 10 — Polish & Final Review

### 10.1 Animations & Transitions
- [ ] Add fade-in / slide-up on scroll for sections
- [ ] Smooth hover states on all cards and buttons
- [ ] Page transition animations

### 10.2 Responsive Check
- [ ] Test all pages on mobile (375px)
- [ ] Test all pages on tablet (768px)
- [ ] Test all pages on desktop (1280px)
- [ ] Fix any layout breaks

### 10.3 Visual Polish
- [ ] Consistent spacing and padding across all pages
- [ ] Ensure all images have fallback placeholders
- [ ] Check all buttons have correct hover and active states
- [ ] Verify color theme is consistent (green primary, amber accent)

### 10.4 Demo Preparation
- [ ] Verify all 9 pages load without errors
- [ ] Test full user flow: Sign up → Browse products → Add to cart → Checkout
- [ ] Test seller flow: Login as seller → Upload waste → View listing
- [ ] Test job flow: Login as job seeker → Browse jobs → Apply
- [ ] Test admin flow: Login as admin → Approve product → Reject waste listing
- [ ] Confirm seed data looks realistic and complete

---

## Summary

| Phase | Description | Status |
|---|---|---|
| 1 | Setup & Foundation | ✅ Complete |
| 2 | Authentication & Dashboard | ✅ Complete |
| 3 | E-commerce | ✅ Complete |
| 4 | Waste Selling | ✅ Complete |
| 5 | Job Portal | ✅ Complete |
| 6 | Engineering Innovation | ✅ Complete |
| 7 | Static Pages | ✅ Complete |
| 8 | Admin Panel | ✅ Complete |
| 9 | Seed Data | ✅ Complete (admin user setup pending) |
| 10 | Polish & Final Review | 🔲 Not Started |
