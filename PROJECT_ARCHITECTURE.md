<!--
  @file PROJECT_ARCHITECTURE.md
  @purpose System architecture documentation for The House of Gaunt.
  @agency Climate Change Digital Labs (CCDL)
-->

# Project Architecture — The House of Gaunt

## 1. System Overview

The House of Gaunt uses a modern full-stack single-repo architecture designed for high maintainability, rapid cold starts, and zero runtime surprises. The application executes as an integrated Node.js Express server running on port 3000, with Vite serving optimized client-side React bundles in development and hosting compiled static assets in production.

```
                              ┌────────────────────────────────────────┐
                              │            Client Browser              │
                              │  (React 19, Tailwind v4, Lucide Icons) │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  │ HTTPS / REST (JSON)
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │           Express API Server           │
                              │            (server.ts / :3000)         │
                              └───────┬──────────────┬───────────┬─────┘
                                      │              │           │
                    ┌─────────────────┴─┐    ┌───────┴──────┐  ┌─┴────────────────┐
                    │  Razorpay Gateway │    │  Shiprocket  │  │ JSON Persistence │
                    │ (HMAC SHA256 Sign)│    │  (Air AWB)   │  │  (storage.ts)    │
                    └───────────────────┘    └──────────────┘  └──────────────────┘
```

---

## 2. Component Architecture

### Frontend Layer (`src/`)
- **`src/context/StoreContext.tsx`:** Single authoritative client state container. Manages cart, wishlist, comparison list, active filters, auth sessions, and toasts. Uses `localStorage` synchronization for cart persistence.
- **`src/components/Header.tsx`:** Strict 3-zone contract top bar: Zone 1 (Wordmark), Zone 2 (Single-line navigation links), Zone 3 (Utility actions & Cart drawer trigger).
- **`src/components/ProductCard.tsx`:** Lead imagery focus (70% card height), unboxed metadata with `·` separators, tabular figures for INR pricing, and immediate add-to-bag triggers.
- **`src/components/CartDrawer.tsx`:** Contiguous slide-over panel with line items, quantity steppers, free shipping threshold indicator, and coupon input.
- **`src/pages/`:** 23 dedicated customer pages representing the entire golfer lifecycle from discovery to post-purchase tracking.
- **`src/admin/`:** Dedicated backoffice layout with 17 operational modules.

### Backend Layer (`server/` & `server.ts`)
- **`server.ts`:** Entry point mounting Express middleware, CORS, security headers (`X-Content-Type-Options`, `X-Frame-Options`), API routers, and Vite middleware.
- **`server/storage.ts`:** File-backed JSON database engine (`server/data/store.json`). Guarantees that changes to products, orders, reviews, coupons, and inventory survive restarts.
- **`server/types.ts`:** Strongly typed domain models shared across backend and frontend contracts.

---

## 3. Key Architectural Decisions

1. **Integrated Full-Stack Server:** By running Express via `tsx server.ts` mounted with `vite.middlewares`, backend REST endpoints and frontend hot-reloading coexist seamlessly on port 3000.
2. **Server-Authoritative Pricing & Verification:** Order calculations and Razorpay payment signatures are validated on the server. The client never dictates the final price or trusts client-reported payment flags.
3. **Logistics Simulation Engine:** The Shiprocket engine calculates rates based on the first digit of Indian postal PIN codes (North, West, South, East zones), allocating realistic Airway Bills (e.g. `SR-IN-XXXXXXXXX`).
4. **Resilient Local Images:** Generated assets reside in `/src/assets/images/`, avoiding unstable external CDNs.
