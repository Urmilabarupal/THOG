<!--
  @file README.md
  @purpose Master documentation for The House of Gaunt luxury golf e-commerce platform.
  @agency Climate Change Digital Labs (CCDL)
-->

# The House of Gaunt — Luxury Golf Equipment E-Commerce Platform

**Brand:** The House of Gaunt  
**Project Owner:** Climate Change Digital Labs (CCDL)  
**Target Market:** India (Pan-Indian Delivery & INR ₹ Pricing)  
**Business Model:** Direct-to-Consumer (B2C) & Custom Fitting Concierge  
**Capacity:** Scalable 100–500 Product Catalog  
**Version:** 1.0.0 (Production-Ready Release)

---

## 1. Project Overview

The House of Gaunt is a custom-engineered, luxury golf equipment and apparel e-commerce platform developed specifically for the Indian golf community. Designed to move beyond generic storefront templates, the platform pairs British Racing Green / Deep Forest Green aesthetic elegance with real backend REST APIs, server-side Razorpay cryptographic payment validation, and Shiprocket logistics automation.

### Key Highlights
- **23 Fully Navigable Customer Touchpoints:** From dynamic faceted shopping to real-time Shiprocket AWB order tracking.
- **Dedicated Admin Control Panel:** 17 comprehensive modules enabling total inventory, pricing, refund, review, banner, and order control without source code edits.
- **Real Backend Persistence:** File-backed persistent database (`server/data/store.json`) with automatic seeding and live mutations.
- **Indian Market Integrations:** Razorpay UPI/NetBanking/Cards sandbox integration with HMAC SHA-256 signature verification, 18% GST sports equipment tax breakdown, and Shiprocket PIN-code zone logistics calculations.
- **Zero-Pill Aesthetic Discipline:** Clean typography (`Playfair Display` + `Plus Jakarta Sans`), unboxed metadata, and high-fidelity product photography.

---

## 2. Customer Website Pages (All 23 Implemented)

1. **Homepage:** Campaign hero, category exploration tiles, featured tour equipment, craftsmanship story, customer endorsements.
2. **Shop All Products:** Faceted catalog with category, brand, price slider, dexterity, shaft flex, and availability filters.
3. **Product Categories:** Visual index of all 8 core golf retail categories with real product density metrics.
4. **Product Details (PDP):** Contiguous purchase module, multiple image previews, variant selector, technical specifications, and live customer reviews.
5. **Search Results:** Real-time query search matching names, descriptions, brands, and SKUs with popular search tags.
6. **Shopping Cart:** Detailed line-item summary, quantity steppers, Shiprocket Indian PIN delivery calculator, and promo code redemption.
7. **Checkout:** Multi-section checkout with Indian State and 6-digit PIN validation, Razorpay gateway or COD selection, and server-side authorization.
8. **Login:** Role-aware authentication for golfers and administrators with 1-click test login shortcuts.
9. **Registration:** Instant account creation with mobile number capture for Shiprocket tracking notifications.
10. **Forgot Password:** Password reset workflow simulation.
11. **Customer Dashboard:** Personalized portal showing VIP membership tier, order counts, lifetime investment, and saved addresses.
12. **My Orders:** Order history with live status tags, AWB references, and printable GST tax invoices.
13. **Order Tracking:** Shiprocket tracking simulator displaying AWB milestone timeline across Indian airport sorting facilities.
14. **Wishlist:** Saved products grid with 1-click "Add All to Golf Bag" transfer.
15. **Product Comparison:** Side-by-side comparison table (up to 4 clubs) analyzing lofts, flex, materials, and prices.
16. **About Us:** Climate Change Digital Labs heritage, Bangalore TrackMan 4 studio specs, and sustainable supply chain mission.
17. **Contact Us:** Interactive inquiry form, showroom addresses in Bangalore, Gurugram, and Mumbai, and direct WhatsApp concierge integration.
18. **Blog (The Fairway Journal):** In-depth technical articles on launch angles, forging metallurgy, and glove maintenance.
19. **FAQ:** Expandable accordions with keyword filtering covering authenticity, shipping, fittings, and payments.
20. **Privacy Policy:** Compliance with the Indian Information Technology Act 2000.
21. **Terms & Conditions:** Conditions of sale, pricing transparency, and Bengaluru legal jurisdiction.
22. **Shipping Policy:** Shiprocket delivery tiers, metro air transit times, and free shipping thresholds.
23. **Return & Refund Policy:** 14-day hassle-free return window and 30-day complimentary loft/lie recalibration.

---

## 3. Backoffice Admin Dashboard Modules

- **Dashboard Analytics:** Gross revenue in ₹, average order value, total orders, active customers, and low stock warnings.
- **Product Management:** Full CRUD (add, edit, delete) with variants, specs, and status flags.
- **Category Management:** Create and edit category slugs and descriptions.
- **Brand Management:** Manage OEM brand partnerships (Titleist, Callaway, TaylorMade, CCDL).
- **Inventory Management:** Low stock alerts with inline restock quantity controls.
- **Order Management:** Lifecycle progression (Pending $\to$ Processing $\to$ Shipped $\to$ Delivered) with AWB generation.
- **Customer Management:** View customer spend, order counts, and contact data.
- **Payment Management:** Monitor Razorpay transaction IDs, HMAC signatures, and capture statuses.
- **Refund Management:** Review and approve 14-day return claims with payment reversals.
- **Coupon Management:** Create percentage or flat discount vouchers with minimum cart constraints.
- **Shipping Management:** Configure Shiprocket modes, shipping rates, and free shipping thresholds.
- **Reviews Management:** Moderate and approve customer ratings.
- **Sales Reports:** Real-time financial breakdowns and 1-click CSV export.
- **Website Banner Management:** Update promotional announcement copy and visibility.
- **Content Management:** Create blog articles and update FAQs.
- **Admin User Management:** Manage staff roles (Super Admin, Store Manager, Fitting Specialist).
- **General Store Settings:** Set store details, 18% GST rate, Razorpay keys, and currency.

---

## 4. Documentation Index

- `PROJECT_ARCHITECTURE.md`: High-level system design, data flow, and frontend-backend architecture.
- `DATABASE_SCHEMA.md`: Relational and document models for products, orders, and users.
- `API_DOCUMENTATION.md`: Full REST endpoint contracts, query parameters, and response structures.
- `SECURITY.md`: Encryption, input sanitization, HMAC validation, and rate-limiting practices.
- `INSTALLATION_GUIDE.md`: Local development setup and environment variables.
- `DEPLOYMENT_GUIDE.md`: Cloud deployment instructions for Node.js and static assets.
- `CHANGELOG.md`: Version release log.

---

*Developed by Climate Change Digital Labs (CCDL). Registered Indian Enterprise.*
