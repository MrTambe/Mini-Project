# 🏫 SELF-HOSTING GUIDE — EVENTURE

For institutes/organizations that want to run Eventure on their own servers instead of using the hosted version.

---

## 1. OVERVIEW

Eventure can be fully self-hosted. You need:
- A server (VPS, dedicated machine, or cloud instance)
- Node.js 18+
- pnpm
- A Convex deployment (Convex Cloud or self-hosted Convex)
- Domain name (optional, for production)
- SSL certificate (Let's Encrypt recommended)

---

## 2. PREREQUISITES

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| RAM | 2 GB | 4 GB+ |
| CPU | 2 cores | 4 cores+ |
| Storage | 20 GB SSD | 50 GB+ SSD |
| Node.js | 18+ | 20+ LTS |
| pnpm | Latest | Latest |

---

## 3. INSTALLATION STEPS

### Step 1: Clone the Repository

```bash
git clone https://github.com/MrTambe/Mini-Project.git
cd Mini-Project
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Set Up Convex

Eventure uses Convex as its backend. You have two options:

#### Option A: Convex Cloud (Recommended - Easiest)

```bash
npx convex dev
```

This creates a Convex deployment and writes `.env.local` with `VITE_CONVEX_URL`.

Then set required environment variables on your Convex deployment:

```bash
npx convex env set JWT_PRIVATE_KEY <your-es256-private-key>
npx convex env set JWKS <your-jwks-json>
npx convex env set SITE_URL https://your-domain.com
npx convex env set SEED_ADMIN_SECRET <random-secret>
npx convex env set RESEND_API_KEY <your-resend-key>
```

#### Option B: Self-Hosted Convex

If you want to run Convex entirely on your own infrastructure, you'll need to deploy Convex server yourself (requires Docker, PostgreSQL, etc.). This is advanced — see [Convex self-hosting docs](https://docs.convex.dev/self-hosting).

### Step 4: Configure Environment Variables

Create `.env.local` (or use the one written by `npx convex dev`):

```env
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

On your Convex deployment, set:

| Variable | Description |
|----------|-------------|
| `JWT_PRIVATE_KEY` | ES256 private key for auth |
| `JWKS` | Public JWK set |
| `SITE_URL` | Your frontend URL (e.g. `https://events.college.edu`) |
| `SEED_ADMIN_SECRET` | Secret for seeding data |
| `RESEND_API_KEY` | Resend API key for email |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | For Google integrations |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Service account key |
| `GOOGLE_SHEETS_DB_ID` | Google Sheets ID |
| `GOOGLE_DOCS_FOLDER_ID` | Google Drive folder ID |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID |

### Step 5: Seed Initial Data

```bash
# Create your first admin
pnpm seed:admin admin@yourcollege.edu AdminPass123 "College Admin"

# Add sample events (optional)
pnpm seed:sample

# Add full dummy data (optional, for testing)
pnpm seed:dummy
```

### Step 6: Build for Production

```bash
pnpm build
```

This creates a `dist/` folder with static files.

### Step 7: Serve the Frontend

#### Option A: Nginx (Recommended)

Install Nginx and configure:

```nginx
server {
    listen 80;
    server_name events.yourcollege.edu;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name events.yourcollege.edu;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    root /var/www/eventure/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://your-convex-deployment.convex.cloud;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option B: Caddy (Simpler SSL)

```caddy
events.yourcollege.edu {
    root * /var/www/eventure/dist
    file_server
    rewrite {
        to {path} /index.html
    }
    reverse_proxy /api/* https://your-convex-deployment.convex.cloud
}
```

#### Option C: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 4. CONFIGURATION FOR INSTITUTE USE

### 4.1 Custom Branding

Edit `src/index.css` to change colors:
```css
:root {
    --primary: oklch(0.205 0 0);  /* Your institute color */
    --background: oklch(0.99 0.002 0);
}
```

Update `src/pages/Landing.tsx` with your institute name and logo.

### 4.2 Email Configuration

Eventure uses Resend for email OTP. Set up:
1. Create account at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key
4. Set `RESEND_API_KEY` on Convex deployment

For development, set `DEV_CONSOLE_OTP=true` to log OTPs to console instead of sending email.

### 4.3 Google Integrations (Optional)

For Google Sheets/Docs/Calendar sync:

1. Create a Google Cloud project
2. Enable Google Sheets API, Google Docs API, Google Calendar API
3. Create a service account and download JSON key
4. Share your Google Sheet/Calendar with the service account email
5. Set env vars on Convex deployment

---

## 5. SCALING FOR 10K+ USERS

| Component | Free Tier | Production |
|-----------|-----------|------------|
| Convex functions | ~100K/day | Unlimited |
| DB reads | ~1M/day | Unlimited |
| DB writes | ~100K/day | Unlimited |
| Storage | 1 GB | 100+ GB |
| Bandwidth | 1 GB/mo | Unlimited |
| Concurrent users | Limited | 10k+ |

### Recommendations for 10k users:

1. **Upgrade to Convex Production** — pay-as-you-go, no hard limits
2. **Enable Convex caching** — automatic for queries
3. **Use CDN** — serve static assets via Cloudflare/CloudFront
4. **Database indexing** — all tables already indexed; add more as needed
5. **Rate limiting** — `aiChatLimit.ts` shows the pattern; extend to other endpoints
6. **Monitoring** — Convex dashboard provides metrics

---

## 6. SECURITY CHECKLIST

- [ ] `JWT_PRIVATE_KEY` is strong and kept secret
- `JWKS` is correctly configured
- `SITE_URL` matches your domain exactly
- `RESEND_API_KEY` is not exposed to client
- `SEED_ADMIN_SECRET` is random and long
- HTTPS enabled in production
- Convex Auth HTTP-only cookies with Secure flag
- Role-based access on all admin routes
- Input validation via `v` validators (Convex is NoSQL — no SQL injection)

---

## 7. TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| `VITE_CONVEX_URL not found` | Run `npx convex dev` first |
| Auth not working | Check `JWT_PRIVATE_KEY` and `JWKS` on Convex |
| Email OTP not received | Check `RESEND_API_KEY`, or set `DEV_CONSOLE_OTP=true` |
| Build fails | Run `pnpm install` then `pnpm build` |
| Google APIs fail | Check service account key and sharing permissions |
| 404 on refresh | Configure SPA fallback (`try_files $uri $uri/ /index.html`) |

---

## 8. SUPPORT

- Convex docs: https://docs.convex.dev
- Convex Auth docs: https://docs.convex.dev/auth
- VLY integrations: https://vly.ai
- Resend docs: https://resend.com/docs

---

**End of Self-Hosting Guide.**