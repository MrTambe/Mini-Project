// @ts-nocheck
"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { google } from "googleapis";
import { internal } from "./_generated/api";

/**
 * Google Calendar Sync for Eventure.
 *
 * Syncs events from Eventure to Google Calendar so attendees can add
 * events to their personal calendars.
 *
 * Model: A single Google Calendar (owned by the institute) is used.
 * The service account creates/updates/deletes events on that calendar.
 *
 * Env vars required on the Convex deployment:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  e.g. calendar-integration@project.iam.gserviceaccount.com
 *   GOOGLE_SERVICE_ACCOUNT_KEY    the private key (with real newlines)
 *   GOOGLE_CALENDAR_ID            the calendar ID (e.g. college.edu_events@group.calendar.google.com)
 */

function getGoogleAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!email || !key || !calendarId) return null;
  // Handle keys pasted with literal \n sequences
  key = key.replace(/\\n/g, "\n");
  return {
    auth: new google.auth.JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    }),
    calendarId,
  };
}

/** Format a Convex timestamp (ms) to ISO string for Google Calendar. */
function toISO(ms: number): string {
  return new Date(ms).toISOString();
}

/** Build Google Calendar event request body from Eventure event. */
function buildCalendarEvent(event: any): any {
  return {
    summary: event.name || "Untitled Event",
    description: [
      event.description || "",
      "",
      `Venue: ${event.venue || "Not specified"}`,
      `Type: ${event.eventType || "individual"}`,
      `Max Participants: ${event.maxParticipants ?? "Unlimited"}`,
      "",
      "Created by Eventure — Campus Event Management",
    ].join("\n"),
    location: event.venue || "",
    start: {
      dateTime: toISO(event.startDate),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: toISO(event.endDate),
      timeZone: "Asia/Kolkata",
    },
    reminderOverrides: [
      { method: "email", minutes: 24 * 60 },   // 1 day before
      { method: "popup", minutes: 60 },         // 1 hour before
      { method: "popup", minutes: 15 },         // 15 minutes before
    ],
    reminders: { useDefault: false },
  };
}

/**
 * Internal action: create or update a Google Calendar event for an Eventure event.
 */
export const syncEventToCalendar = internalAction({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const g = getGoogleAuth();
    if (!g) {
      return {
        success: false,
        message:
          "Google Calendar not configured: missing GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_KEY / GOOGLE_CALENDAR_ID.",
      };
    }

    const event: any = await ctx.runQuery(internal.sheetsData.getEventInternal, {
      eventId: args.eventId,
    });
    if (!event) {
      return { success: false, message: "Event not found" };
    }

    const calendar = google.calendar({ version: "v3", auth: g.auth });

    // Check if we already have a calendar event ID stored (optional extension)
    // For now, always create a new event
    const created = await calendar.events.insert({
      calendarId: g.calendarId,
      requestBody: buildCalendarEvent(event),
    });

    return {
      success: true,
      calendarEvent: {
        id: created.data.id,
        htmlLink: created.data.htmlLink,
        status: created.data.status,
      },
      message: `Event "${event.name}" synced to Google Calendar`,
    };
  },
});

/**
 * Internal action: delete a Google Calendar event.
 */
export const deleteCalendarEvent = internalAction({
  args: { calendarEventId: v.string() },
  handler: async (ctx, args) => {
    const g = getGoogleAuth();
    if (!g) {
      return {
        success: false,
        message: "Google Calendar not configured.",
      };
    }

    const calendar = google.calendar({ version: "v3", auth: g.auth });

    await calendar.events.delete({
      calendarId: g.calendarId,
      eventId: args.calendarEventId,
    });

    return { success: true, message: "Calendar event deleted" };
  },
});

/**
 * Public action: check Google Calendar configuration status.
 */
export const checkGoogleCalendarConfig = action({
  args: {},
  handler: async () => {
    const configured = !!(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
      process.env.GOOGLE_CALENDAR_ID
    );
    return {
      configured,
      message: configured
        ? "Google Calendar integration is configured."
        : "Google Calendar is not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_KEY, and GOOGLE_CALENDAR_ID on the Convex deployment.",
    };
  },
});
