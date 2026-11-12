<!--
  @file SECURITY.md
  @purpose Security architecture and policies for The House of Gaunt.
  @agency Climate Change Digital Labs (CCDL)
-->

# Security Policy & Implementation — The House of Gaunt

## 1. Threat Mitigation Strategies

### Server-Side Payment Verification (Razorpay)
- **Zero Frontend Trust:** The backend never trusts status strings sent by the browser. When an order is completed, the payment signature (`razorpay_signature`) is verified on the server using HMAC SHA-256 against `RAZORPAY_KEY_SECRET`.
- **Amount Integrity:** Order totals, GST calculations, and discounts are computed on the server. Even if a malicious actor modifies the DOM price, the server recomputes lines items from database rates.

### Data Protection & Input Sanitization
- **SQL / Injection Defense:** All queries pass through validated internal handlers with strict type-casting (`Number()`, `String().trim()`).
- **XSS Prevention:** Input fields are sanitized before storage; React JSX automatically escapes dangerous markup.
- **PIN Code Validation:** Strict regex enforcement ensures only genuine 6-digit Indian PIN codes (`/^[1-9][0-9]{5}$/`) are accepted for logistics calculation.

### HTTP Security Headers
The server sets standard defense-in-depth headers on all API responses:
```typescript
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'SAMEORIGIN');
res.setHeader('X-XSS-Protection', '1; mode=block');
```

---

## 2. Secrets Management

- **API Keys & Credentials:** `RAZORPAY_KEY_SECRET`, `SHIPROCKET_API_KEY`, and database URLs are read exclusively via environment variables (`process.env`) on the Node.js server.
- **Frontend Isolation:** Secret credentials are never prefixed with `VITE_` and never included in client-side bundles.
