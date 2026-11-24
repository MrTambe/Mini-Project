# 📐 TECHNICAL ARCHITECTURE — EVENTURE

Detailed technical documentation for developers and AI assistants. Covers data flow, authentication, integrations, security, and deployment.

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React 19 + Vite)                │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐   │
│  │  Landing    │  │  Dashboard  │  │  Admin Panel          │   │
│  │  Events     │  │  Profile    │  │  Team / Tickets       │   │
│  │  Certificates│ │  Settings   │  │  Analytics / Check-in │   │
│  └─────────────┘  └─────────────┘  └───────────────────────┘   │
│                         ↓ React Router v7                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONVEX AUTH (Auth Layer)                     │
│  Email OTP + Password  →  JWT Sessions  →  HTTP-only Cookies   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONVEX BACKEND (Serverless)                  │
│  Queries (read)  │  Mutations (write)  │  Actions (Node.js)    │
│  └─ users.ts     │  └─ events.ts       │  └─ googleSheets.ts   │
│  └─ team.ts      │  └─ communication.ts│  └─ googleDocs.ts     │
│  └─ tickets.ts   │  └─ admin_*.ts      │  └─ googleCalendar.ts │
│  └─ seed.ts      │                     │  └─ seed.ts           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONVEX DATABASE (NoSQL)                      │
│  users, admins, teamMembers, events, eventRegistrations,       │
│  certificates, event_chats, private_messages, tickets,         │
│  notifications, sheet_backups, trustedDevices, authTables       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                          │
│  VLY (AI/Email/Payments) │ Resend (Email) │ Google APIs        │
│                          │                 (Sheets/Docs/Calendar)│
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. DATA FLOW DIAGRAMS

### 2.1 User Registration & Login

```
User enters email/password on Auth page
        ↓
useAuth() → signIn({provider: "password", params: {flow: "signIn", email, password}})
        ↓
Convex Auth validates → creates/returns session (JWT in HTTP-only cookie)
        ↓
Frontend receives isAuthenticated = true
        ↓
Redirect to /dashboard (or /complete-profile if profile incomplete)
        ↓
Dashboard loads user data via useQuery(api.users.currentUser)
```

### 2.2 Event Registration

```
User clicks "Register Now" on event page
        ↓
Frontend calls mutation api.events.registerForEvent({eventId})
        ↓
Convex validates: user authenticated, event exists, spots available
        ↓
Insert into eventRegistrations table with checkInCode (random)
        ↓
Send confirmation email via api.email.sendRegistrationEmail
        ↓
Toast: "Registered successfully"
        ↓
(Optional) Sync to Google Sheets via api.googleSheets.syncEventSheetsNow
```

### 2.3 QR Check-In

```
Admin scans QR or user enters check-in code
        ↓
Frontend calls api.events.checkInToEvent({eventId, checkInCode})
        ↓
Convex validates: event is active, code matches, user not already checked in
        ↓
Update registration status to "attended", set attendedAt timestamp
        ↓
Create notification for user
        ↓
Toast: "Check-in successful"
```

### 2.4 Certificate Generation

```
User views certificates page
        ↓
Frontend queries api.certificates.getMyCertificates
        ↓
Display list with download options
        ↓
User clicks "Download PDF"
        ↓
Frontend generates PDF via jspdf (client-side) OR
        ↓
Calls api.googleDocs.createCertificateDoc (server-side, Google Doc)
        ↓
Return PDF URL or Google Doc link
```

### 2.5 Google Calendar Sync (NEW)

```
Admin creates/updates event in Eventure
        ↓
Mutation api.events.createEvent or api.events.updateEvent
        ↓
After successful DB write, call internal action api.googleCalendar.syncEventToCalendar
        ↓
Google Calendar API: events.insert with event details (title, time, location, description)
        ↓
Store calendarEventId on event record (optional)
        ↓
If event deleted: api.googleCalendar.deleteCalendarEvent
```

---

## 3. AUTHENTICATION DETAILS

### 3.1 Convex Auth Configuration

**File**: `src/convex/auth.ts`
```typescript
import { convexAuth } from "@convex-dev/auth/server";
import { emailOtp } from "./auth/emailOtp";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailOtp, Password],
});
```

**Providers**:
- `emailOtp` — Email OTP only (6-digit code sent via Resend)
- `Password` — Email + password sign up/sign in

### 3.2 Session Management

- Sessions are HTTP-only cookies managed by Convex Auth
- JWT signed with ES256 (`JWT_PRIVATE_KEY`)
- Session duration configurable via Convex dashboard
- **30-minute cookie requirement**: Configure session TTL on Convex deployment, or implement custom short-lived tokens for sensitive operations

### 3.3 Route Protection

**`Protected` component** (`src/lib/protected-page.tsx`):
- Checks `isAuthenticated` from `useAuth()`
- Redirects unauthenticated users to auth page
- Checks `requiredRole` (admin/user)
- Redirects incomplete profiles to `/complete-profile`
- Shows loading spinner while auth state resolves

**`AdminProtected` component** (`src/lib/admin-protected-page.tsx`):
- Same as Protected but requires `role === "admin"`

### 3.4 Security

| Threat | Mitigation |
|--------|------------|
| SQL Injection | **N/A** — Convex is NoSQL, all queries use typed API |
| XSS | React auto-escapes, sanitize user input before display |
| CSRF | Convex Auth uses same-site cookies |
| Session Hijacking | HTTP-only cookies, secure flag in production |
| Brute Force | `authRateLimits` table tracks failed attempts |
| Unauthorized Access | Role-based checks on every protected route |

---

## 4. INTEGRATIONS

### 4.1 Google Sheets

**File**: `src/convex/googleSheets.ts`
- Service account JWT authentication
- Syncs Events, Participants, Staff tabs
- Admin-only access
- Env: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_SHEETS_DB_ID`

### 4.2 Google Docs

**File**: `src/convex/googleDocs.ts`
- Creates event reports and certificates as Google Docs
- Service account JWT
- Stores in configured Drive folder (`GOOGLE_DOCS_FOLDER_ID`)
- Returns shareable webViewLink

### 4.3 Google Calendar (NEW)

**File**: `src/convex/googleCalendar.ts`
- Creates/updates/deletes calendar events
- Service account JWT
- Env: `GOOGLE_CALENDAR_ID`
- Scopes: `https://www.googleapis.com/auth/calendar`

### 4.4 VLY Integrations

- AI completions, embeddings, streaming
- Email sending (batch)
- Payments (intents, subscriptions, checkout)
- Package: `@vly-ai/integrations`

---

## 5. TRUSTED DEVICE FEATURE

### 5.1 Overview

Allows users (admin, team member, student) to mark a device as trusted so they remain logged in for 30 days without re-authenticating.

### 5.2 Database Schema

**Table**: `trustedDevices` (add to `src/convex/schema.ts`)

```typescript
trustedDevices: defineTable({
  userId: v.id("users"),
  deviceToken: v.string(),
  deviceName: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  ipAddress: v.optional(v.string()),
  createdAt: v.number(),
  expiresAt: v.number(), // now + 30 days
  isActive: v.boolean(),
})
  .index("by_user", ["userId"])
  .index("by_token", ["deviceToken"])
  .index("by_user_and_active", ["userId", "isActive"]),
```

### 5.3 Backend Functions

**File**: `src/convex/trustedDevices.ts`

```typescript
// Mutation: Create trusted device
export const createTrustedDevice = mutation({
  args: {
    deviceToken: v.string(),
    deviceName: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    await ctx.db.insert("trustedDevices", {
      userId: user._id,
      deviceToken: args.deviceToken,
      deviceName: args.deviceName,
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isActive: true,
    });
    
    return { success: true };
  },
});

// Query: Check if device is trusted
export const isDeviceTrusted = query({
  args: { deviceToken: v.string() },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query("trustedDevices")
      .withIndex("by_token", (q) => q.eq("deviceToken", args.deviceToken))
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.gt(q.field("expiresAt"), Date.now())
      ))
      .first();
    return !!device;
  },
});

// Mutation: Revoke trusted device
export const revokeTrustedDevice = mutation({
  args: { deviceToken: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    await ctx.db
      .query("trustedDevices")
      .withIndex("by_token", (q) => q.eq("deviceToken", args.deviceToken))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect()
      .then((devices) => Promise.all(devices.map(d => ctx.db.delete(d._id))));
    
    return { success: true };
  },
});
```

### 5.4 Frontend Integration

**Settings page** (`src/pages/Settings.tsx`):
- Add checkbox: "Trust this device for 30 days"
- When checked on login or in settings, call `createTrustedDevice`
- Store `deviceToken` in `localStorage`

**Auth flow**:
- On app load, check `localStorage` for device token
- If token exists, call `isDeviceTrusted`
- If trusted, skip auth redirect and load dashboard directly

---

## 6. CERTIFICATE PDF EXPORT

### 6.1 Libraries

- `jspdf` v3.0.1
- `jspdf-autotable` v5.0.2
- Both already installed in `package.json`

### 6.2 Implementation

Add to `src/pages/Certificates.tsx` or create `src/components/CertificatePDF.tsx`:

```typescript
import jsPDF from "jspdf";
import "jspdf-autotable";

export function downloadCertificatePDF(cert: any) {
  const doc = new jsPDF();
  
  doc.setFontSize(24);
  doc.text("CERTIFICATE OF PARTICIPATION", 20, 30);
  
  doc.setFontSize(16);
  doc.text("This is to certify that", 20, 60);
  
  doc.setFontSize(20);
  doc.text(cert.userName || "Participant", 20, 80);
  
  doc.setFontSize(14);
  doc.text(`has participated in: ${cert.eventName}`, 20, 100);
  doc.text(`Date: ${new Date(cert.issuedDate).toLocaleDateString()}`, 20, 115);
  doc.text(`Certificate #: ${cert.certificateNumber}`, 20, 130);
  
  doc.save(`certificate-${cert.certificateNumber}.pdf`);
}
```

---

## 7. DEPLOYMENT

### 7.1 Vercel (Hosted)

1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy
5. Run `npx convex deploy` for backend

### 7.2 Self-Hosting (Institute Server)

See `SELF_HOSTING.md` for complete guide.

### 7.3 Scalability

| Metric | Free Tier | Production |
|--------|-----------|------------|
| Concurrent users | Limited | 10k+ |
| Function calls | Daily limit | High limit |
| DB storage | 1 GB | 100+ GB |
| Bandwidth | 1 GB/month | Unlimited |

**For 10k users**: Use Convex Production deployment, enable caching, consider CDN for static assets.

---

## 8. QUICK REFERENCE

```bash
# Development
pnpm dev                    # Start frontend
npx convex dev              # Start Convex dev (writes .env.local)

# Deployment
npx convex deploy           # Deploy backend to production
# Then set env vars on Convex dashboard

# Seeding
pnpm seed:admin <email> <password> "<name>"
pnpm seed:dummy
pnpm seed:test-users

# Type checking
pnpm build

# Linting
pnpm lint
```

---

**End of Technical Architecture documentation.**