# Eventure — Campus Event Management Platform

> One app. Every event. Zero hassle.

Eventure is a full-stack event management platform built for colleges, communities, and organizations. It lets students register for events, check in via QR codes, earn certificates, chat in real time, and manage everything from an admin dashboard — all with email OTP authentication, real-time data, and AI assistance.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Sample User IDs (Try It Out)](#-sample-user-ids-try-it-out)
- [Seeding Data](#-seeding-data)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Language Support (हिन्दी / मराठी)](#-language-support-हिन्दी--मराठी)
- [Integrations](#-integrations)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Students / Users
- **Event browsing** — view upcoming, active, and past events with details
- **Event registration** — sign up for individual or team events
- **QR check-in** — scan or enter a check-in code at the venue
- **Certificates** — download digital certificates for attended events (**PDF export available**)
- **Profile & settings** — manage your profile, branch, roll number, and mobile number
- **Event chat** — real-time group chat for each event
- **Private messaging** — direct messages with other users
- **Support tickets** — raise and track support tickets
- **Trusted device** — mark your device as trusted to stay logged in for 30 days

### For Admins & Team Members
- **Admin dashboard** — overview of events, registrations, and attendance
- **Event management** — create, edit, cancel, and complete events
- **Team management** — add and manage volunteers/team members
- **Announcements** — broadcast messages to all users
- **Check-in** — verify attendee check-ins at events
- **Event analytics** — attendance rates, check-in stats, winner tracking
- **Tickets** — view and reply to user support tickets
- **Google Sheets sync** — export event data to Google Sheets
- **AI chat widget** — AI assistant embedded in the app

### Platform
- **Email OTP + Password authentication** (Convex Auth)
- **Role-based access control** (admin / user)
- **Mobile-responsive** design with Tailwind CSS
- **Dark mode** support
- **Animations** via Framer Motion
- **Real-time data** via Convex

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router v7 |
| Styling | Tailwind CSS v4, Shadcn UI |
| Animations | Framer Motion |
| Icons | Lucide React, Tabler Icons |
| Backend | Convex (serverless functions + database) |
| Authentication | Convex Auth (Email OTP + Password) |
| AI | VLY Integrations, Google Generative AI |
| Payments | VLY Integrations |
| Email | Resend |
| Charts | Recharts |
| Maps | Leaflet / React Leaflet |
| PDF | jsPDF |
| i18n | Custom JSON-based (English, Hindi, Marathi) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- A [Convex](https://convex.dev) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/MrTambe/Mini-Project.git
cd Mini-Project
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up Convex

```bash
npx convex dev
```

This creates/link a Convex deployment and writes `.env.local` with `VITE_CONVEX_URL`.

### 4. Configure environment variables

Set these on your Convex deployment:

```bash
npx convex env set JWT_PRIVATE_KEY <your-es256-private-key>
npx convex env set JWKS <your-jwks-json>
npx convex env set SITE_URL http://localhost:5173
npx convex env set SEED_ADMIN_SECRET <random-secret-string>
npx convex env set RESEND_API_KEY <your-resend-api-key>
```

Optional (dev-only OTP logging):
```bash
npx convex env set DEV_CONSOLE_OTP true
```

See `.env.example` for the full template.

### 5. Seed your first admin

```bash
pnpm seed:admin <email> <password> "<name>"
```

Example:
```bash
pnpm seed:admin admin@college.edu AdminPass123 "College Admin"
```

### 6. Add sample data (optional but recommended)

```bash
pnpm seed:sample
# or for the full dummy dataset:
pnpm seed:dummy
```

### 7. Start the development server

```bash
pnpm dev
```

Open http://localhost:5173 in your browser.

---

## 🔐 Environment Variables

### Client-side (`.env.local`, written by `npx convex dev`)

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Your Convex deployment URL |

### Server-side (set on Convex deployment via `npx convex env set`)

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_PRIVATE_KEY` | Convex Auth ES256 signing private key | Yes |
| `JWKS` | JSON Web Key Set (public key) | Yes |
| `SITE_URL` | Frontend URL (e.g. `http://localhost:5173`) | Yes |
| `SEED_ADMIN_SECRET` | Secret for seeding admin/demo data | Yes |
| `RESEND_API_KEY` | Resend API key for email OTP | Yes (for email delivery) |
| `DEV_CONSOLE_OTP` | Log OTP to console instead of email (dev only) | No |
| `VLY_INTEGRATION_KEY` | VLY AI/email/payments integration key | Auto-set |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service account email | For Sheets/Docs |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google service account private key | For Sheets/Docs |
| `GOOGLE_SHEETS_DB_ID` | Google Sheets spreadsheet ID | For Sheets sync |
| `GOOGLE_DOCS_FOLDER_ID` | Google Drive folder ID for Docs export | For Docs integration |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID for event sync | For Calendar integration |

---

## 👥 Sample User IDs (Try It Out)

Run `pnpm seed:dummy` to populate the database with sample data. Then use these credentials to log in:

### Admins (full access to admin dashboard)

| Role | Email | Password |
|------|-------|----------|
| Admin | `sanshit@eventure.app` | `Sanshit@2026` |
| Admin | `mayuri@eventure.app` | `Mayuri@2026` |

### Team Member / Volunteer

| Role | Email | Password |
|------|-------|----------|
| Team Member | `sanika@eventure.app` | `Sanika@2026` |

### Sample Students (regular users — create via `pnpm seed:test-users`)

| Name | Email | Roll No | Branch |
|------|-------|---------|--------|
| Parth Aayush Tambe | `parth.tambe@student.edu` | 22CS101 | Computer Science |
| Aayush Bhat | `aayush.bhat@student.edu` | 22CS102 | Computer Science |
| Naveen Shaik | `naveen.shaik@student.edu` | 22IT201 | Information Technology |
| Sorav Joshi | `sorav.joshi@student.edu` | 22EC145 | Electronics |
| Soham Yadav | `soham.yadav@student.edu` | 22ME178 | Mechanical |

To create loginable student accounts:
```bash
pnpm seed:test-users
```
Then sign up each student with their email and a password of your choice via the app's sign-up flow.

> **Note:** Admins and team members log in via `/admin-signIn`. Regular users sign up/sign in via the `AuthButton` on the landing page or `/auth`.

---

## 🌱 Seeding Data

| Command | Description |
|---------|-------------|
| `pnpm seed:admin <email> <password> "<name>"` | Create the first admin user |
| `pnpm seed:sample` | Insert 3 sample events (Hackathon, Tech Talk, Cultural Night) |
| `pnpm seed:dummy` | Full dummy dataset: 2 admins, 1 team member, 5 users, 1 ongoing event |
| `pnpm seed:test-users` | Create 5 loginable test user accounts (email + password) |
| `pnpm seed:ongoing-event` | Create an ongoing check-in test event |

All seed commands are gated by `SEED_ADMIN_SECRET`.

---

## 📁 Project Structure

```
Mini-Project/
├── README.md                      # This file (English)
├── README.hi.md                   # Hindi documentation
├── README.mr.md                   # Marathi documentation
├── integrations.md                # VLY + Google integrations guide
├── .env.example                   # Environment variable template
├── package.json                   # Dependencies & scripts
├── convex.json                    # Convex project config
├── vercel.json                    # Vercel deployment config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── public/                        # Static assets
├── scripts/                       # Seed scripts
│   ├── seed-admin.mjs
│   ├── seed-sample-events.mjs
│   └── seed-dummy-data.mjs
├── set-convex-jwt-env.sh          # JWT env setup script
└── src/
    ├── main.tsx                   # App entry point + routes
    ├── index.css                  # Global CSS + design tokens
    ├── instrumentation.tsx        # Error instrumentation
    ├── vite-env.d.ts
    ├── components/
    │   ├── ui/                    # Shadcn UI primitives
    │   ├── auth/                  # AuthButton, AuthCard
    │   ├── admin/                 # Admin-specific components
    │   ├── dashboard/             # Dashboard components
    │   ├── AIChatWidget.tsx       # AI chat widget
    │   ├── PaymentModal.tsx       # Payment modal
    │   ├── VlyToolbar.tsx         # VLY integration toolbar
    │   ├── theme-provider.tsx     # Theme provider
    │   └── getReactComponentHierarchy.ts
    ├── convex/                    # Convex backend
    │   ├── schema.ts              # Database schema
    │   ├── auth.ts                # Convex Auth config
    │   ├── auth.config.ts         # Auth domain config
    │   ├── auth/                  # Email OTP provider
    │   ├── users.ts               # User queries/mutations
    │   ├── events.ts              # Event management
    │   ├── team.ts                # Team member management
    │   ├── tickets.ts             # Support tickets
    │   ├── communication.ts       # Chat & announcements
    │   ├── privateMessages.ts     # Direct messaging
    │   ├── admin.ts               # Admin queries
    │   ├── admin_actions.ts       # Admin actions
    │   ├── admin_creation.ts      # Admin creation
    │   ├── dashboard.ts           # Dashboard data
    │   ├── ai.ts                  # AI chat functions
    │   ├── aiChatLimit.ts         # AI rate limiting
    │   ├── email.ts               # Email sending
    │   ├── registration_emails.ts # Registration emails
    │   ├── googleSheets.ts        # Google Sheets sync
    │   ├── googleDocs.ts          # Google Docs export (NEW)
    │   ├── sheetsData.ts          # Sheets data queries
    │   ├── notifications.ts       # Notifications
    │   ├── seed.ts                # Seed data functions
    │   ├── user_management.ts     # User management
    │   ├── user_creation.ts       # User creation
    │   ├── utils/                 # Convex utilities
    │   └── generators/            # Code generators
    ├── data/
    │   └── event-templates.ts     # Event templates
    ├── hooks/
    │   ├── use-auth.ts            # Auth hook
    │   └── use-translation.ts     # i18n hook (NEW)
    ├── lib/
    │   ├── protected-page.tsx     # Route protection
    │   ├── admin-protected-page.tsx # Admin route protection
    │   ├── utils.ts               # Utility functions
    │   ├── friendly-error.ts      # Error formatting
    │   ├── qr-generator.ts        # QR code generation
    │   ├── vly-integrations.ts    # VLY client wrapper
    │   └── i18n/                  # Translation files (NEW)
    │       ├── en.json            # English translations
    │       ├── hi.json            # Hindi translations
    │       └── mr.json            # Marathi translations
    └── pages/
        ├── Landing.tsx            # Landing page
        ├── Dashboard.tsx          # User dashboard
        ├── Events.tsx             # Event browsing
        ├── EventInfo.tsx          # Event details
        ├── EventCheckIn.tsx       # Event check-in
        ├── Certificates.tsx       # Certificates
        ├── Profile.tsx            # User profile
        ├── Settings.tsx           # User settings
        ├── Communication.tsx      # Event chat
        ├── CompleteProfile.tsx    # Profile completion
        ├── Auth.tsx               # Auth page
        ├── NotFound.tsx           # 404 page
        ├── AdminSignIn.tsx        # Admin sign-in
        ├── AdminDashboard.tsx     # Admin dashboard
        ├── AdminEvents.tsx        # Admin event management
        ├── AdminTeam.tsx          # Admin team management
        ├── AdminCommunication.tsx # Admin announcements
        ├── AdminTickets.tsx       # Admin ticket management
        ├── AdminSettings.tsx      # Admin settings
        └── AdminEventAnalytics.tsx # Admin analytics
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm preview` | Preview production build |
| `pnpm seed:admin` | Seed first admin |
| `pnpm seed:sample` | Seed sample events |
| `pnpm seed:dummy` | Seed full dummy dataset |
| `pnpm seed:test-users` | Seed loginable test users |

---

## 🌐 Language Support (हिन्दी / मराठी)

Eventure supports **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)**.

Translations live in `src/lib/i18n/`:
- `en.json` — English
- `hi.json` — हिन्दी
- `mr.json` — मराठी

### How to change language

A language selector is available in **Settings** (and the navbar dropdown). Selecting a language persists your choice and re-renders the entire UI in that language.

### Adding a new language

1. Create `src/lib/i18n/<lang-code>.json` (copy from `en.json`)
2. Translate all values, keeping keys identical
3. Add the language to the selector in `src/lib/i18n/index.ts`
4. Export the new translation object

See `src/hooks/use-translation.ts` for the `useTranslation` hook usage.

---

## 🔌 Integrations

### Google Sheets (already implemented)
Export events, participants, and staff data to a Google Sheets spreadsheet. See [`integrations.md`](./integrations.md) for setup.

### Google Docs (NEW)
Export event reports, certificates, and announcements as Google Docs documents. See [`integrations.md`](./integrations.md) for the full setup guide.

### Google Calendar (NEW)
Sync events from Eventure to Google Calendar so attendees can add them to their personal calendars. Requires `GOOGLE_CALENDAR_ID` env var. See [`integrations.md`](./integrations.md).

### VLY Integrations (AI, Email, Payments)
AI completions, embeddings, email sending, and payment intents via `@vly-ai/integrations`. See [`integrations.md`](./integrations.md).

### Other libraries already installed
- `googleapis` — Google API client
- `@google/generative-ai` — Google Gemini AI
- `axios` — HTTP client
- `jspdf` + `jspdf-autotable` — PDF generation
- `leaflet` + `react-leaflet` — Maps

---

## 🚀 Deployment

### Vercel (recommended)

1. Push your code to GitHub
2. Import the repo into [Vercel](https://vercel.com)
3. Add all environment variables (see the table above)
4. Deploy

Your Convex deployment must be separate — run `npx convex deploy` to push your backend functions to production.

### Convex Production

```bash
npx convex deploy
```

Then set all production environment variables on your Convex dashboard.

---

## 🏫 Self-Hosting (For Institutes)

Eventure can be fully self-hosted on your own servers. See [`SELF_HOSTING.md`](./SELF_HOSTING.md) for the complete guide including:

- Server requirements (RAM, CPU, storage)
- Convex Cloud setup or self-hosted Convex
- Nginx/Caddy/Docker deployment
- Environment variables
- SSL/HTTPS setup
- Scaling for 10k+ users
- Security checklist

## 📈 Scalability

| Metric | Free Tier | Production |
|--------|-----------|------------|
| Concurrent users | Limited | **10k+** |
| Function calls | Daily limit | High limit |
| DB storage | 1 GB | 100+ GB |
| Bandwidth | 1 GB/month | Unlimited |

For 10,000+ concurrent users, upgrade to **Convex Production** (paid). Convex auto-scales serverless functions and database. All tables are properly indexed for performance.

## 🔒 Security

- **No SQL injection**: Convex is a NoSQL database — all queries use typed APIs, not string concatenation
- **Input validation**: All inputs validated via Convex `v` validators
- **Session security**: HTTP-only cookies, Secure flag in production
- **Role-based access**: Admin routes require `role === "admin"` check
- **Rate limiting**: Per-user rate limits on AI chat and sensitive actions
- **Brute force protection**: Auth attempt tracking via `authRateLimits` table


We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and test them locally
4. **Commit**: `git commit -m "feat: add your feature"`
5. **Push**: `git push origin feature/your-feature-name`
6. **Open a Pull Request**

### Suggested improvements / roadmap

If you're looking for something to contribute, here are ideas:

- [ ] **Google Calendar sync** — push events to attendees' calendars
- [ ] **Razorpay / Stripe payments** — paid event tickets
- [ ] **WhatsApp / SMS notifications** — check-in reminders via Twilio or MSG91
- [ ] **Event photo gallery** — upload and share event photos
- [ ] **Certificate PDF download** — export certificates as PDF (jspdf already installed)
- [ ] **Email digests** — weekly event summary via Resend
- [ ] **Unit tests** — Vitest + React Testing Library
- [ ] **CI/CD** — GitHub Actions for lint, build, and deploy
- [ ] **SEO meta tags** — dynamic meta tags for landing and event pages
- [ ] **More languages** — add Gujarati, Tamil, Telugu, Bengali translations
- [ ] **Push notifications** — web push for event reminders

### Code style
- Follow the existing Shadcn UI conventions (see `src/components/ui/`)
- Keep Shadcn primitives untouched; override styles inline instead
## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and test them locally
4. **Commit**: `git commit -m "feat: add your feature"`
5. **Push**: `git push origin feature/your-feature-name`
6. **Open a Pull Request**

### Suggested improvements / roadmap

If you're looking for something to contribute, here are ideas:

- [ ] **Google Calendar sync** — push events to attendees' calendars
- [ ] **Razorpay / Stripe payments** — paid event tickets
- [ ] **WhatsApp / SMS notifications** — check-in reminders via Twilio or MSG91
- [ ] **Event photo gallery** — upload and share event photos
- [ ] **Certificate PDF download** — export certificates as PDF (jspdf already installed)
- [ ] **Email digests** — weekly event summary via Resend
- [ ] **Unit tests** — Vitest + React Testing Library
- [ ] **CI/CD** — GitHub Actions for lint, build, and deploy
- [ ] **SEO meta tags** — dynamic meta tags for landing and event pages
- [ ] **More languages** — add Gujarati, Tamil, Telugu, Bengali translations
- [ ] **Push notifications** — web push for event reminders

### Code style
- Follow the existing Shadcn UI conventions (see `src/components/ui/`)
- Keep Shadcn primitives untouched; override styles inline instead
- All UI components must be mobile-responsive and dark-mode compatible
- Use Framer Motion for animations
- Use `sonner` for toasts
- Protect routes with `<Protected>` or `<AdminProtected>`

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Convex](https://convex.dev) — backend & database
- [Shadcn UI](https://ui.shadcn.com) — UI components
- [Tailwind CSS](https://tailwindcss.com) — styling
- [Framer Motion](https://www.framer.com/motion) — animations
- [VLY](https://vly.ai) — AI, email, and payments integrations
- [Lucide](https://lucide.dev) — icons

Built with ❤️ by the Eventure team.
