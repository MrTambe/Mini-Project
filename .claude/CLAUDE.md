# 🤖 AI CONTEXT — EVENTURE PROJECT

This file is for AI assistants (Claude, Cursor, Copilot, etc.) to understand the Eventure project completely. Read this before making any code changes.

---

## 1. PROJECT OVERVIEW

**Eventure** is a campus/community event management platform.
- **Purpose**: Students register for events, check in via QR codes, earn certificates, chat in real time. Admins manage events, teams, announcements, tickets.
- **Repository**: https://github.com/MrTambe/Mini-Project
- **Working directory**: `D:\PROJECTS\EVENTURE`

---

## 2. TECH STACK (EXACT VERSIONS)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | React | 19.1.0 | Vite bundler |
| Routing | React Router | v7.6.1 | All imports from `react-router` (NOT `react-router-dom`) |
| Styling | Tailwind CSS | v4.1.8 | Oklch color format, `src/index.css` |
| UI Library | Shadcn UI | — | Primitives in `src/components/ui/` |
| Animations | Framer Motion | v12.15.0 | `motion` component |
| Icons | Lucide React | v0.511.0 | Also Tabler Icons |
| Backend | Convex | v1.35.1 | Serverless functions + database |
| Auth | Convex Auth | v0.0.86 | Email OTP + Password provider |
| AI | VLY Integrations | v0.6.6 | `@vly-ai/integrations` |
| AI Alt | Google Generative AI | v0.24.1 | `@google/generative-ai` |
| Payments | VLY Integrations | — | Payment intents, subscriptions, checkout |
| Email | Resend | — | Email OTP delivery |
| Google Sheets | googleapis | v154.1.0 | Service account JWT |
| Google Docs | googleapis | v154.1.0 | Service account JWT |
| Google Calendar | googleapis | v154.1.0 | **NEW** — service account JWT |
| PDF | jspdf | v3.0.1 | + jspdf-autotable v5.0.2 |
| Charts | Recharts | v2.15.3 | |
| Maps | Leaflet | v1.9.4 | + react-leaflet v5.0.0 |
| Forms | React Hook Form | v7.57.0 | + zod resolvers |
| Validation | Zod | v3.25.46 | |
| Toasts | Sonner | v2.0.4 | |
| Package Manager | pnpm | — | `pnpm-lock.yaml` |
| Deployment | Vercel | — | `vercel.json` |

---

## 3. DIRECTORY STRUCTURE (FULL)

```
Mini-Project/
├── README.md                      # USER docs (English)
├── README.hi.md                   # USER docs (Hindi)
├── README.mr.md                   # USER docs (Marathi)
├── integrations.md                # Integration setup guide
├── .env.example                   # Environment variable template
├── SELF_HOSTING.md                # Self-hosting guide for institutes
├── package.json                   # Dependencies & scripts
├── convex.json                    # Convex project config
├── vercel.json                    # Vercel deployment config
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
├── prettier config
├── .claude/CLAUDE.md              # <-- THIS FILE (AI context)
├── docs/TECHNICAL_ARCHITECTURE.md # Detailed technical flow
├── public/                        # Static assets
├── scripts/                       # Seed scripts (Node.js)
│   ├── seed-admin.mjs
│   ├── seed-sample-events.mjs
│   └── seed-dummy-data.mjs
├── set-convex-jwt-env.sh          # JWT env setup
└── src/
    ├── main.tsx                   # App entry + all routes (BrowserRouter)
    ├── index.css                  # Global CSS + design tokens (oklch)
    ├── instrumentation.tsx
    ├── vite-env.d.ts
    ├── components/
    │   ├── ui/                    # Shadcn primitives (DO NOT MODIFY lightly)
    │   ├── auth/                  # AuthButton, AuthCard
    │   ├── admin/                 # Admin-specific components
    │   ├── dashboard/             # Dashboard components
    │   ├── AIChatWidget.tsx       # AI chat widget (VLY)
    │   ├── PaymentModal.tsx       # Payment modal
    │   ├── VlyToolbar.tsx         # VLY integration toolbar
    │   ├── theme-provider.tsx     # Theme provider (light/dark)
    │   └── getReactComponentHierarchy.ts
    ├── convex/                    # BACKEND — Convex functions
    │   ├── schema.ts              # Database schema (source of truth)
    │   ├── auth.ts                # Convex Auth config (emailOtp + Password)
    │   ├── auth.config.ts         # Auth domain config (READ ONLY)
    │   ├── auth/                  # Email OTP provider (DO NOT MODIFY)
    │   ├── users.ts               # User queries/mutations
    │   ├── events.ts              # Event management
    │   ├── team.ts                # Team member management
    │   ├── tickets.ts             # Support tickets
    │   ├── communication.ts       # Chat + announcements
    │   ├── privateMessages.ts     # Direct messaging
    │   ├── admin.ts               # Admin queries
    │   ├── admin_actions.ts       # Admin actions
    │   ├── admin_creation.ts      # Admin creation
    │   ├── dashboard.ts           # Dashboard data
    │   ├── ai.ts                  # AI chat functions
    │   ├── aiChatLimit.ts         # AI rate limiting (1 req/min/user)
    │   ├── email.ts               # Email sending
    │   ├── registration_emails.ts # Registration emails
    │   ├── googleSheets.ts        # Google Sheets sync (internal action)
    │   ├── googleDocs.ts          # Google Docs export (internal action)
    │   ├── googleCalendar.ts      # **NEW** Google Calendar sync
    │   ├── sheetsData.ts          # Sheets data queries (internal)
    │   ├── notifications.ts       # Notifications
    │   ├── seed.ts                # Seed data functions
    │   ├── user_management.ts     # User management
    │   ├── user_creation.ts       # User creation
    │   ├── user_creation_internal.ts
    │   ├── trustedDevices.ts      # **NEW** Trusted device management
    │   ├── utils/                 # Convex utilities
    │   └── generators/            # Code generators
    ├── data/
    │   └── event-templates.ts     # Event templates
    ├── hooks/
    │   ├── use-auth.ts            # Auth hook (useAuth)
    │   └── use-translation.ts     # i18n hook
    ├── lib/
    │   ├── protected-page.tsx     # Route protection (Protected component)
    │   ├── admin-protected-page.tsx # Admin route protection
    │   ├── utils.ts               # Utility functions (cn, etc.)
    │   ├── friendly-error.ts      # Error formatting
    │   ├── qr-generator.ts        # QR code generation
    │   ├── vly-integrations.ts    # VLY client wrapper
    │   └── i18n/                  # Translation files
    │       ├── en.json            # English
    │       ├── hi.json            # हिन्दी
    │       └── mr.json            # मराठी
    └── pages/
        ├── Landing.tsx            # Landing page
        ├── Dashboard.tsx          # User dashboard
        ├── Events.tsx             # Event browsing
        ├── EventInfo.tsx          # Event details
        ├── EventCheckIn.tsx       # Event check-in
        ├── Certificates.tsx       # Certificates (PDF export here)
        ├── Profile.tsx            # User profile
        ├── Settings.tsx           # User settings (trusted device toggle here)
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

## 4. DATABASE SCHEMA (KEY TABLES)

Defined in `src/convex/schema.ts`. Roles: `admin`, `user`.

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | Auth users | name, email, role, rollNo, branch, mobileNumber, avatarUrl |
| `admins` | Admin accounts | email, password (hashed), role, branch, rollNo, mobileNumber |
| `teamMembers` | Volunteers | userId, name, email, role, department, branch, rollNo, mobileNumber |
| `events` | Events | name, description, venue, startDate, endDate, maxParticipants, createdBy, status, eventType, imageUrl |
| `eventRegistrations` | Registrations | eventId, userId, registrationDate, status, checkInCode, attendedAt |
| `certificates` | Certificates | eventId, userId, certificateUrl, issuedDate, certificateNumber |
| `event_chats` | Event chat rooms | eventId, title, createdBy, createdAt, isDeleted |
| `event_channel_messages` | Chat messages | eventId, authorId, authorName, content, chatId, reactions |
| `private_messages` | DMs | senderId, recipientId, content, isRead, reactions |
| `admin_communication_messages` | Announcements | authorId, content, channel, reactions |
| `tickets` | Support tickets | creatorId, subject, description, category, eventId, status, priority, createdAt |
| `ticket_replies` | Ticket replies | ticketId, authorId, authorName, content, createdAt |
| `notifications` | Notifications | recipientId, type, content, isRead, linkId |
| `sheet_backups` | Google Sheets links | eventId, folderUrl, participantsUrl, staffUrl, overviewUrl, syncedAt |
| `trustedDevices` | **NEW** Trusted devices | userId, deviceToken, deviceName, userAgent, ipAddress, createdAt, expiresAt, isActive |
| `authTables` | Convex Auth | authAccounts, sessions, verificationTokens, etc. |

**Indexes**: All tables properly indexed. `schemaValidation: false`.

---

## 5. AUTHENTICATION FLOW

### Convex Auth (Email OTP + Password)
- **File**: `src/convex/auth.ts` — uses `emailOtp` and `Password` providers
- **File**: `src/convex/auth.config.ts` — READ ONLY, domain config
- **File**: `src/convex/auth/emailOtp.ts` — DO NOT MODIFY
- **Hook**: `src/hooks/use-auth.ts` — `useAuth()` returns `{isLoading, isAuthenticated, user, signIn, signOut}`
- **Protected routes**: Wrap pages in `<Protected>` from `src/lib/protected-page.tsx`
- **Admin routes**: Wrap in `<AdminProtected>` from `src/lib/admin-protected-page.tsx`
- **Auth page**: `src/pages/Auth.tsx`
- **Auth button**: `src/components/auth/AuthButton.tsx` — opens modal or redirects to `/auth`
- **Session**: Managed by Convex Auth (HTTP-only cookies, JWT)

### Session Duration
- Convex Auth manages sessions via cookies
- Default session length is configurable on the Convex deployment
- For "30-minute cookies", configure `session` duration in Convex Auth or extend via custom logic

### Security (SQL Injection)
- **Convex is NoSQL** — no SQL injection possible
- All database access goes through Convex's typed API (`ctx.db.query`, `ctx.db.insert`, etc.)
- User inputs are validated via `v` validators from `convex/values`
- Never concatenate user input into queries
- Use `Id<"TableName">` types, not raw strings for document references

---

## 6. ROUTES (FROM `src/main.tsx`)

```
Public:
  /               → Landing
  /auth           → Auth (email OTP + password)
  /admin-signIn   → Admin sign-in

Protected (require auth):
  /dashboard      → User dashboard
  /events         → Event browsing
  /certificates   → Certificates
  /profile        → User profile
  /settings       → User settings
  /communication  → Event chat
  /complete-profile → Profile completion
  /event/:eventId → Event details

Admin Protected (require admin role):
  /admin-dashboard → Admin dashboard
  /admin-events    → Manage events
  /admin-team      → Manage team
  /admin-communication → Announcements
  /admin-tickets   → Support tickets
  /admin-settings  → Admin settings
  /admin-checkin   → Event check-in
  /admin-event-analytics → Analytics
```

---

## 7. ENVIRONMENT VARIABLES (REQUIRED)

### On Convex deployment (`npx convex env set NAME VALUE`)

| Variable | Purpose | Required |
|----------|---------|----------|
| `JWT_PRIVATE_KEY` | ES256 signing key | Yes |
| `JWKS` | Public JWK set | Yes |
| `SITE_URL` | Frontend URL | Yes |
| `SEED_ADMIN_SECRET` | Seeding gate | Yes |
| `RESEND_API_KEY` | Email OTP | Yes (for email) |
| `DEV_CONSOLE_OTP` | Log OTP to console (dev) | No |
| `VLY_INTEGRATION_KEY` | AI/email/payments | Auto-set |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Sheets/Docs/Calendar | For Google integrations |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Service account private key | For Google integrations |
| `GOOGLE_SHEETS_DB_ID` | Sheets spreadsheet ID | For Sheets sync |
| `GOOGLE_DOCS_FOLDER_ID` | Drive folder for docs | For Docs export |
| `GOOGLE_CALENDAR_ID` | Calendar ID for sync | **NEW** For Calendar sync |

### Client-side (`.env.local`, written by `npx convex dev`)
- `VITE_CONVEX_URL`

---

## 8. AVAILABLE SCRIPTS

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Type-check + production build |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm preview` | Preview production build |
| `pnpm seed:admin <email> <password> "<name>"` | Create first admin |
| `pnpm seed:sample` | Insert 3 sample events |
| `pnpm seed:dummy` | Full dummy dataset (2 admins, 1 team, 5 users, 1 event) |
| `pnpm seed:test-users` | Create loginable test users |

---

## 9. I18N (INTERNATIONALIZATION)

- **Files**: `src/lib/i18n/en.json`, `hi.json`, `mr.json`
- **Hook**: `src/hooks/use-translation.ts` — `useTranslation()` returns `{language, setLanguage, t, labels, flags, isRTL}`
- **Usage**: `const { t } = useTranslation(); t("nav.dashboard")`
- **Persistence**: Language saved to `localStorage` key `eventure-language`
- **Languages**: English (en), हिन्दी (hi), मराठी (mr) — all LTR scripts

---

## 10. KEY IMPLEMENTATION PATTERNS

### Convex Query
```typescript
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});
```

### Convex Mutation
```typescript
export const updateUserProfile = mutation({
  args: { userId: v.id("users"), name: v.optional(v.string()), ... },
  handler: async (ctx, args) => {
    // validation + db.patch
  },
});
```

### Convex Action (for Node.js / external APIs)
```typescript
"use node";
export const syncEventToSheets = internalAction({
  args: { eventId: v.id("events") },
  handler: async (ctx) => {
    // googleapis, fetch, etc.
  },
});
```

### Frontend Component
```typescript
import { Protected } from "@/lib/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
```

### Protected Route
```tsx
<Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
<Route path="/admin-dashboard" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
```

---

## 11. GOOGLE INTEGRATIONS (FILES)

| File | Purpose |
|------|---------|
| `src/convex/googleSheets.ts` | Sync events/participants/staff to Google Sheets |
| `src/convex/googleDocs.ts` | Export event reports + certificates to Google Docs |
| `src/convex/googleCalendar.ts` | **NEW** Sync events to Google Calendar |
| `src/convex/sheetsData.ts` | Internal data queries for Sheets |
| `src/lib/vly-integrations.ts` | VLY client wrapper |

### Google Auth Pattern (service account)
```typescript
function getGoogleAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  key = key.replace(/\\n/g, "\n");
  return new google.auth.JWT({ email, key, scopes: [...] });
}
```

---

## 12. TRUSTED DEVICE FEATURE (NEW)

**Purpose**: Allow users to mark a device as "trusted" so they don't need to log in every time.

**Files**:
- `src/convex/trustedDevices.ts` — backend (queries/mutations/actions)
- `src/pages/Settings.tsx` — UI toggle "Trust this device"
- `src/hooks/use-auth.ts` — extend with trusted device check

**Database table**: `trustedDevices`
- `userId`: v.id("users")
- `deviceToken`: v.string() — random token
- `deviceName`: v.string()
- `userAgent`: v.string()
- `ipAddress`: v.string()
- `createdAt`: v.number()
- `expiresAt`: v.number() — 30 days from creation
- `isActive`: v.boolean()

**Flow**:
1. User logs in, checks "Trust this device for 30 days"
2. Generate device token, store in `trustedDevices` with `expiresAt = now + 30 days`
3. Store token in `localStorage` (or HTTP-only cookie)
4. On app load, if token exists and is valid in DB, skip auth prompt
5. After 30 days, token expires, user must log in again

---

## 13. CERTIFICATE PDF EXPORT (NEW)

**Library**: `jspdf` + `jspdf-autotable` (already installed)

**File**: Add certificate PDF generation to `src/pages/Certificates.tsx` or a new component

**Flow**:
1. User clicks "Download PDF" on a certificate
2. Generate PDF with jspdf: event name, user name, date, certificate number
3. Trigger browser download

---

## 14. GOOGLE CALENDAR SYNC (NEW)

**File**: `src/convex/googleCalendar.ts`

**Env vars**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_CALENDAR_ID`

**Functions**:
- `syncEventToCalendar(eventId)` — creates a Google Calendar event
- `deleteCalendarEvent(calendarEventId)` — removes it
- `checkGoogleCalendarConfig()` — verification

**Scopes**: `https://www.googleapis.com/auth/calendar`

---

## 15. CONTRIBUTION RULES

1. **Routes**: Add to `src/main.tsx` with `<Protected>` or `<AdminProtected>`
2. **Auth**: Use `useAuth()` hook, never direct auth calls
3. **UI**: Shadcn primitives from `src/components/ui/`, mobile-responsive, dark-mode compatible
4. **Animations**: Use `framer-motion` `motion` component
5. **Toasts**: Use `sonner` `toast()`
6. **Convex**: Use `v` validators, `Id<"Table">` types, `schemaValidation: false`
7. **Actions**: External API calls (Google, VLY) must be in `"use node"` actions
8. **i18n**: Add strings to all three JSON files (en, hi, mr)
9. **No nested cards**, no shadows, thin borders only
10. **Security**: No SQL injection (Convex is NoSQL), validate all inputs

---

## 16. SCALABILITY NOTES

- **Convex**: Serverless, auto-scales. Can handle 10k+ concurrent users on paid plan
- **Free tier**: Limited daily function calls and DB reads/writes
- **10k users**: Requires Convex Production deployment (paid)
- **Caching**: Convex automatically caches queries
- **Rate limiting**: `aiChatLimit.ts` shows pattern for per-user rate limits

---

## 17. QUICK COMMANDS FOR AI

```bash
# Start dev
pnpm dev

# Build
pnpm build

# Convex dev
npx convex dev

# Convex deploy
npx convex deploy

# Seed admin
pnpm seed:admin admin@college.edu AdminPass123 "Admin"

# Seed dummy data
pnpm seed:dummy

# Set env var
npx convex env set NAME value

# Type check
pnpm build
```

---

## 18. SAMPLE CREDENTIALS (FOR TESTING)

After `pnpm seed:dummy`:

| Role | Email | Password |
|------|-------|----------|
| Admin | sanshit@eventure.app | Sanshit@2026 |
| Admin | mayuri@eventure.app | Mayuri@2026 |
| Team Member | sanika@eventure.app | Sanika@2026 |

Students: `parth.tambe@student.edu`, `aayush.bhat@student.edu`, `naveen.shaik@student.edu`, `sorav.joshi@student.edu`, `soham.yadav@student.edu` — create via `pnpm seed:test-users`

---

**End of AI Context. When you read this, you have full context to build, modify, and extend Eventure.**