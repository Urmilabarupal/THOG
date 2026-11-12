<!--
  @file CHANGELOG.md
  @purpose Release history and version logs for The House of Gaunt.
  @agency Climate Change Digital Labs (CCDL)
-->

# Changelog — The House of Gaunt

All notable changes to The House of Gaunt luxury golf e-commerce platform will be documented in this file.

---

## [1.0.0] - 2026-03-04 (Initial Production Release)

### Added
- **Storefront Architecture:**
  - 23 complete navigable customer pages covering catalog, discovery, checkout, order tracking, fitting, and policies.
  - Strict 3-zone Top Bar Contract navigation header and responsive mobile drawer.
  - Deep Forest Green and warm paper luxury color scheme adhering to 60-30-10 color distribution.
  - Zero-pill metadata design with clean unboxed typographic separators (`·`).
  - High-fidelity commercial photography assets generated for golf drivers, tour staff bags, spikeless shoes, and tour urethane balls.

- **Full-Stack REST APIs & Persistence:**
  - Complete Node.js Express server (`server.ts`) operating concurrently with Vite.
  - Persistent JSON database engine (`server/storage.ts`) supporting products, categories, brands, orders, customers, reviews, coupons, and settings.
  - Real Razorpay Indian payment integration with HMAC SHA-256 signature verification.
  - Real Shiprocket logistics engine calculating delivery rates by 6-digit Indian PIN codes and generating tracking timelines.
  - 18% GST sports equipment tax breakdown with printable tax invoices.

- **Admin Backoffice Suite:**
  - 17 distinct management modules covering Analytics, Products CRUD, Categories, Brands, Inventory, Orders, Customers, Payments, Refunds, Coupons, Shipping, Reviews, Reports, Banners, Content, Admin Users, and General Settings.

- **Full Technical Documentation Suite:**
  - `README.md`, `PROJECT_ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `API_DOCUMENTATION.md`, `SECURITY.md`, `INSTALLATION_GUIDE.md`, `DEPLOYMENT_GUIDE.md`, `CHANGELOG.md`.
