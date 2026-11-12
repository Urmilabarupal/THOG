<!--
  @file API_DOCUMENTATION.md
  @purpose REST API specification for The House of Gaunt backend services.
  @agency Climate Change Digital Labs (CCDL)
-->

# API Documentation — The House of Gaunt

Base URL: `/api`  
Data Format: `application/json`

---

## 1. Catalog & Products

### `GET /api/products`
Retrieves products filtered by query criteria.
- **Query Parameters:**
  - `category` (string, optional): e.g. `golf-clubs`
  - `brand` (string, optional): e.g. `Titleist`
  - `search` (string, optional): Full-text keyword
  - `minPrice` / `maxPrice` (number, optional)
  - `hand` (string, optional): `Right-Handed` | `Left-Handed`
  - `flex` (string, optional): `Regular` | `Stiff` | `Extra Stiff`
  - `sort` (string, optional): `featured` | `price-low` | `price-high` | `rating` | `newest`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "count": 12,
    "data": [ ...Product objects... ]
  }
  ```

### `GET /api/products/:id`
Retrieves an individual product by ID or URL slug along with verified reviews.

### `POST /api/products/:id/reviews`
Submits a customer equipment review.
- **Payload:** `{ "customerName": "...", "rating": 5, "title": "...", "comment": "..." }`
- **Response `201 Created`:** Review entity.

---

## 2. Orders & Checkout

### `POST /api/orders`
Creates a confirmed order in the persistent database and deducts inventory.
- **Payload:**
  ```json
  {
    "customerEmail": "user@domain.com",
    "customerPhone": "+91 98450 12345",
    "shippingAddress": { "fullName": "...", "city": "Bangalore", "postalCode": "560001", ... },
    "items": [ { "productId": "prod-1", "quantity": 1, "price": 48999 } ],
    "subtotal": 48999,
    "discountAmount": 5000,
    "couponCode": "FAIRWAY10",
    "shippingFee": 0,
    "paymentMethod": "razorpay",
    "razorpayOrderId": "order_xyz123",
    "razorpayPaymentId": "pay_abc789"
  }
  ```

### `GET /api/orders/track/:identifier`
Tracks shipment by Order ID (e.g. `CCDL-2026-1041`) or Shiprocket AWB. Returns live milestone history and courier details.

---

## 3. Payments (Razorpay)

### `POST /api/payment/razorpay/create-order`
Creates an order entity on the Razorpay server with cryptographically signed amount.
- **Payload:** `{ "amount": 62064, "currency": "INR", "receipt": "rcpt_1041" }`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": { "id": "order_mock_99182", "amount": 6206400, "currency": "INR", "status": "created" }
  }
  ```

### `POST /api/payment/razorpay/verify`
Server-side HMAC SHA-256 cryptographic signature validation.
- **Payload:** `{ "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }`

---

## 4. Shipping & Vouchers

### `POST /api/shipping/calculate`
Calculates delivery charges and transit time by 6-digit Indian PIN code.
- **Payload:** `{ "postalCode": "560001", "cartSubtotal": 52000 }`
- **Response `200 OK`:** `{ "region": "South India (Metro Hub)", "estimatedDelivery": "2-3 Business Days", "isFreeShipping": true, "standardFee": 0 }`

### `POST /api/coupons/validate`
Validates voucher code against minimum cart value and computes percentage or fixed discount.
