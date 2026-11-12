<!--
  @file DATABASE_SCHEMA.md
  @purpose Database schema and data model documentation for The House of Gaunt.
  @agency Climate Change Digital Labs (CCDL)
-->

# Database Schema — The House of Gaunt

The application uses a persistent file-backed JSON store (`server/data/store.json`) with TypeScript schema definitions matching standard SQL relational schemas. When scaling to PostgreSQL or MySQL, this translates directly to relational tables.

---

## 1. Relational Entities & Data Dictionaries

### Products Table (`products`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique product identifier (e.g. `prod-1`) |
| `sku` | `VARCHAR(64)` | `UNIQUE, NOT NULL` | Stock Keeping Unit (e.g. `CCDL-DRV-AURUM9`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | Display name of the golf equipment |
| `slug` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | SEO-friendly URL slug |
| `brand` | `VARCHAR(128)` | `NOT NULL` | Manufacturer (e.g. Titleist, TaylorMade, CCDL) |
| `category` | `VARCHAR(64)` | `NOT NULL` | Foreign key reference to category slug |
| `regularPrice` | `INTEGER` | `NOT NULL` | Base price in Indian Rupees (INR ₹) |
| `salePrice` | `INTEGER` | `NULLABLE` | Discounted sale price in INR ₹ |
| `stockQuantity` | `INTEGER` | `DEFAULT 0` | Available stock in units |
| `featured` | `BOOLEAN` | `DEFAULT FALSE` | Highlight on homepage showcase |
| `status` | `VARCHAR(32)` | `DEFAULT 'published'` | Enum: `published`, `draft`, `archived` |
| `rating` | `NUMERIC(2,1)` | `DEFAULT 5.0` | Average star rating (1.0 to 5.0) |
| `reviewCount` | `INTEGER` | `DEFAULT 0` | Total verified player reviews |
| `hand` | `VARCHAR(32)` | `NULLABLE` | `Right-Handed`, `Left-Handed`, `Universal` |
| `flex` | `VARCHAR(32)` | `NULLABLE` | `Regular`, `Stiff`, `Extra Stiff`, `Senior`, `Ladies` |
| `createdAt` | `TIMESTAMP` | `DEFAULT NOW()` | Record creation timestamp |

### Orders Table (`orders`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique order ID (e.g. `ord-1042`) |
| `orderNumber` | `VARCHAR(64)` | `UNIQUE, NOT NULL` | Customer-facing order code (e.g. `CCDL-2026-1042`) |
| `customerEmail` | `VARCHAR(255)` | `NOT NULL` | Customer email for invoices |
| `customerPhone` | `VARCHAR(32)` | `NOT NULL` | Mobile number for Shiprocket tracking |
| `subtotal` | `INTEGER` | `NOT NULL` | Equipment total before tax & discount |
| `discountAmount` | `INTEGER` | `DEFAULT 0` | Promotional coupon deduction |
| `taxAmount` | `INTEGER` | `NOT NULL` | 18% Goods and Services Tax (GST) |
| `shippingFee` | `INTEGER` | `DEFAULT 0` | Freight charge (FREE if subtotal $\ge$ ₹5,000) |
| `totalAmount` | `INTEGER` | `NOT NULL` | Final payable amount in INR ₹ |
| `paymentMethod` | `VARCHAR(32)` | `NOT NULL` | `razorpay` or `cod` |
| `paymentStatus` | `VARCHAR(32)` | `NOT NULL` | `pending`, `paid`, `failed`, `refunded` |
| `orderStatus` | `VARCHAR(32)` | `NOT NULL` | `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| `razorpayOrderId` | `VARCHAR(128)` | `NULLABLE` | Razorpay order entity reference |
| `razorpayPaymentId` | `VARCHAR(128)` | `NULLABLE` | Captured payment ID from gateway |
| `shiprocketAwb` | `VARCHAR(64)` | `NULLABLE` | Airway bill number (e.g. `SR-IN-981273910`) |
| `shiprocketStatus` | `VARCHAR(64)` | `NULLABLE` | Courier tracking milestone |
| `createdAt` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of order creation |

### Coupons Table (`coupons`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Coupon identifier |
| `code` | `VARCHAR(32)` | `UNIQUE, NOT NULL` | Code entered by customer (e.g. `FAIRWAY10`) |
| `discountType` | `VARCHAR(16)` | `NOT NULL` | `percentage` or `fixed` |
| `discountValue` | `INTEGER` | `NOT NULL` | Percentage rate (e.g. 10%) or flat INR amount |
| `minPurchaseAmount` | `INTEGER` | `DEFAULT 0` | Minimum basket size required |
| `maxDiscount` | `INTEGER` | `NULLABLE` | Cap on percentage discount |
| `expiryDate` | `DATE` | `NOT NULL` | Expiry cutoff date |
| `isActive` | `BOOLEAN` | `DEFAULT TRUE` | Activation toggle |
| `usageCount` | `INTEGER` | `DEFAULT 0` | Total times coupon has been redeemed |
