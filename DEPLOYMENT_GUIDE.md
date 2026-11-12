<!--
  @file DEPLOYMENT_GUIDE.md
  @purpose Cloud production deployment procedures for The House of Gaunt.
  @agency Climate Change Digital Labs (CCDL)
-->

# Deployment Guide — The House of Gaunt

## 1. Production Build & Bundling

Build the client-side SPA bundle and compile the Node.js Express server:
```bash
npm run build
```
This produces:
- `dist/`: Optimized Vite production build (HTML, CSS, JS chunks, and high-fidelity image assets).
- `server.js`: Bundled Node.js ESM server executable.

---

## 2. Running in Production

To run the full-stack server in production:
```bash
npm start
```
The server will bind to `0.0.0.0:${PORT:-3000}` and serve static assets directly from `dist/`.

---

## 3. Containerized Deployment (Docker)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/server/data ./server/data

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 4. Google Cloud Run Deployment
To deploy directly on Google Cloud Run:
```bash
gcloud run deploy ccdl-fairway-links \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```
