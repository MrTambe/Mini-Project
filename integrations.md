# Eventure Integrations

First-class integrations for AI, email, payments, Google Sheets, and Google Docs — with automatic usage billing through VLY integration keys where applicable.

---

## Environment Variables

The following environment variables are automatically set during project creation:

| Variable | Description |
|----------|-------------|
| `VLY_INTEGRATION_KEY` | Your unique integration key (format: `sk_*`) |
| `VLY_INTEGRATION_BASE_URL` | The base URL for the integration gateway (default: `https://integrations.vly.ai/`) |

The following must be set manually on your Convex deployment:

| Variable | Description | Required For |
|----------|-------------|--------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service account email | Sheets + Docs + Calendar |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google service account private key | Sheets + Docs + Calendar |
| `GOOGLE_SHEETS_DB_ID` | Spreadsheet ID of the user-owned "Eventure DB" sheet | Sheets sync |
| `GOOGLE_DOCS_FOLDER_ID` | Drive folder ID where docs are created | Docs export |
| `GOOGLE_CALENDAR_ID` | Calendar ID for event sync | Calendar sync |

See `.env.example` for a template.

---

## Installation

The `@vly-ai/integrations` package is already included in `package.json`.

**Alternative AI Providers:** While you can use OpenAI, OpenRouter, or other AI providers directly with your own API keys, `@vly-ai/integrations` is simpler as it works out-of-the-box without requiring you to supply and manage API keys.

---

## Usage in Convex Actions

All Google and VLY integration calls must be made from Convex **actions** with the `"use node"` directive (they cannot run in queries or mutations directly).

```typescript
"use node";

import { vly } from '../lib/vly-integrations';
import { action } from "./_generated/server";

export const generateAIResponse = action({
  handler: async (ctx, args) => {
    const completion = await vly.ai.completion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' }
      ],
      temperature: 0.7,
      maxTokens: 150
    });

    return completion;
  }
});
```

---

## 🤖 AI Integration

```typescript
// Create completion
const completion = await vly.ai.completion({
  model: 'gpt-4o-mini', // or 'gpt-4o', 'claude-3-haiku', etc.
  messages: [...],
  temperature: 0.7,
  maxTokens: 150
});

// Stream completion
await vly.ai.streamCompletion(
  request,
  (chunk: string) => console.log(chunk)
);

// Generate embeddings
const embeddings = await vly.ai.embeddings("Your text here");
```

---

## 📧 Email Integration

```typescript
// Send email
const emailResult = await vly.email.send({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our service!</h1>',
  text: 'Welcome to our service!'
});

// Send batch emails
const batchResult = await vly.email.sendBatch([...emails]);
```

---

## 💳 Payments Integration

```typescript
// Create payment intent
const paymentIntent = await vly.payments.createPaymentIntent({
  amount: 2000, // $20.00 in cents
  currency: 'usd',
  description: 'Premium subscription',
  customer: {
    email: 'customer@example.com'
  }
});

// Create subscription
const subscription = await vly.payments.createSubscription({...});

// Create checkout session
const session = await vly.payments.createCheckoutSession({...});
```

---

## 📊 Google Sheets Integration (already implemented)

**File:** `src/convex/googleSheets.ts`

Google Sheets acts as a live database mirror. The service account cannot own files (zero Drive storage quota), but it can read/write any spreadsheet shared with it by the owner.

### Model
- ONE user-owned spreadsheet (the "Eventure DB")
- The owner creates/shares the sheet once with the service account
- The spreadsheet ID is stored in `GOOGLE_SHEETS_DB_ID`
- Every sync rewrites three tabs:
  1. **Events** — every event + live stats
  2. **Participants** — every registration (event name, user details, check-in)
  3. **Staff** — admins + team members (volunteers)

### Setup

1. Create a Google Cloud service account and download its JSON key
2. Share your Google Sheet with the service account email (Editor access)
3. Set these env vars on your Convex deployment:

```bash
npx convex env set GOOGLE_SERVICE_ACCOUNT_EMAIL <service-account-email>
npx convex env set GOOGLE_SERVICE_ACCOUNT_KEY <private-key>
npx convex env set GOOGLE_SHEETS_DB_ID <spreadsheet-id>
```

### Usage

```typescript
// Sync all event data to Google Sheets (admin-only)
await ctx.runAction(internal.googleSheets.syncEventSheetsNow, {
  eventId: eventId,
  adminEmail: adminEmail,
});

// Fetch sheet backup links
const backups = await ctx.runAction(api.googleSheets.getSheetBackups, {});
```

---

## 📄 Google Docs Integration (NEW)

**File:** `src/convex/googleDocs.ts`

Google Docs export lets you generate formatted documents for event reports, participation certificates, and announcements directly from Convex data.

### What you can generate

| Document Type | Description |
|---------------|-------------|
| **Event Report** | Full event summary with registration count, attendance rate, and stats |
| **Participation Certificate** | Formal certificate for a user who attended an event |
| **Announcement Doc** | Formatted admin announcement for distribution |

### Setup

1. Create a Google Cloud service account and download its JSON key
2. Create a Google Drive folder where documents will be stored
3. Share the folder with the service account email (Editor access)
4. Set these env vars on your Convex deployment:

```bash
npx convex env set GOOGLE_SERVICE_ACCOUNT_EMAIL <service-account-email>
npx convex env set GOOGLE_SERVICE_ACCOUNT_KEY <private-key>
npx convex env set GOOGLE_DOCS_FOLDER_ID <drive-folder-id>
```

### Usage

```typescript
// Generate an event report doc
const report = await ctx.runAction(internal.googleDocs.createEventReportDoc, {
  eventId: eventId,
});

// Generate a participation certificate
const certificate = await ctx.runAction(internal.googleDocs.createCertificateDoc, {
  eventId: eventId,
  userId: userId,
  certificateNumber: "EVT-2026-001",
});

// Check if Google Docs is configured
const config = await ctx.runAction(api.googleDocs.checkGoogleDocsConfig, {});
```

Each generated doc is created inside your configured Drive folder and returns a shareable `webViewLink`.

### Return shape

```typescript
interface GoogleDocResult {
  success: boolean;
  document?: {
    documentId: string;
    title: string;
    url: string;        // Google Docs web view link
    exportUrl: string;  // Direct export/download link
  };
  message: string;
}
```

---

## 📅 Google Calendar Sync (NEW)

**File:** `src/convex/googleCalendar.ts`

Sync events from Eventure to Google Calendar so attendees can add them to their personal calendars.

### What you can do

| Action | Description |
|--------|-------------|
| **Create calendar event** | When an event is created in Eventure, sync it to Google Calendar |
| **Delete calendar event** | Remove a synced calendar event |
| **Check configuration** | Verify Google Calendar is properly configured |

### Setup

1. Create a Google Cloud service account and download its JSON key
2. Create a Google Calendar (or use an existing one)
3. Share the calendar with the service account email (Editor access, "Make changes to events")
4. Get the Calendar ID (Settings → Calendar settings → Calendar ID)
5. Set env vars on your Convex deployment:

```bash
npx convex env set GOOGLE_SERVICE_ACCOUNT_EMAIL <service-account-email>
npx convex env set GOOGLE_SERVICE_ACCOUNT_KEY <private-key>
npx convex env set GOOGLE_CALENDAR_ID <calendar-id>
```

### Usage

```typescript
// Sync an event to Google Calendar
const result = await ctx.runAction(internal.googleCalendar.syncEventToCalendar, {
  eventId: eventId,
});

// Delete a calendar event
await ctx.runAction(internal.googleCalendar.deleteCalendarEvent, {
  calendarEventId: "abc123xyz",
});

// Check configuration
const config = await ctx.runAction(api.googleCalendar.checkGoogleCalendarConfig, {});
```

Each created event includes reminders (1 day, 1 hour, 15 minutes before) and the event venue as the location.

### Return shape

```typescript
interface GoogleCalendarResult {
  success: boolean;
  calendarEvent?: {
    id: string;
    htmlLink: string;    // Google Calendar event link
    status: string;
  };
  message: string;
}
```

---

## Error Handling

All integration methods return an `ApiResponse` object:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    credits: number;
    operation: string;
  };
}
```

Example:

```typescript
const result = await vly.ai.completion({ ... });

if (result.success) {
  console.log('Response:', result.data);
  console.log('Credits used:', result.usage?.credits);
} else {
  console.error('Error:', result.error);
}
```

---

## Important Notes

1. The integration key (`VLY_INTEGRATION_KEY`) is automatically injected during project creation
2. All VLY API calls are automatically billed to your deployment based on usage
3. Google integration calls must be used in Convex actions with `"use node"` directive
4. The integration key and service account key should never be exposed to the client
5. **Alternative AI providers:** While you can use OpenAI, OpenRouter, or other AI providers directly with your own API keys, `@vly-ai/integrations` is simpler as it works out-of-the-box without requiring you to supply and manage API keys

---

## Checking Integration Status

To verify the VLY integration is properly configured:

```typescript
const hasIntegration = !!process.env.VLY_INTEGRATION_KEY;
if (!hasIntegration) {
  console.error("VLY integration key not found");
}
```

To verify Google Docs/Sheets configuration:

```typescript
const docsConfig = await ctx.runAction(api.googleDocs.checkGoogleDocsConfig, {});
```

---

## Roadmap / Planned Integrations

- [ ] **Google Calendar** — push events to attendees' calendars
- [ ] **Google Drive** — attach files/photos to events
- [ ] **Razorpay / Stripe** — paid event tickets
- [ ] **WhatsApp / SMS** — check-in reminders via Twilio or MSG91
- [ ] **Email digests** — weekly event summary via Resend
