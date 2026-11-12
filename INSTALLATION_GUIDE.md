<!--
  @file INSTALLATION_GUIDE.md
  @purpose Local installation and setup instructions for The House of Gaunt.
  @agency Climate Change Digital Labs (CCDL)
-->

# Installation Guide — The House of Gaunt

## Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

---

## 1. Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ccdl/fairway-links.git
   cd fairway-links
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add any optional production credentials (or run with defaults in sandbox mode):
   ```env
   PORT=3000
   RAZORPAY_KEY_ID="rzp_test_ccdl99golfindia"
   RAZORPAY_KEY_SECRET="rzp_test_secret_ccdl_2026"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The full-stack application will launch on `http://localhost:3000`.

5. **Access Backoffice Admin Portal:**
   - URL: `http://localhost:3000` (click **User Icon $\to$ Sign in as Admin** or navigate to `/admin`)
   - Default Super Admin Email: `admin@fairwaylinks.ccdl.in`
