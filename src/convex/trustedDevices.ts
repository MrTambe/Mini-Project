// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  return await ctx.db.get(userId);
}

/**
 * Create a trusted device record for the current user.
 * Called when user checks "Trust this device for 30 days".
 */
export const createTrustedDevice = mutation({
  args: {
    deviceToken: v.string(),
    deviceName: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await ctx.db.insert("trustedDevices", {
      userId: user._id,
      deviceToken: args.deviceToken,
      deviceName: args.deviceName,
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
      createdAt: Date.now(),
      expiresAt,
      isActive: true,
    });

    return { success: true, expiresAt };
  },
});

/**
 * Check if a device token is trusted and not expired.
 */
export const isDeviceTrusted = query({
  args: { deviceToken: v.string() },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query("trustedDevices")
      .withIndex("by_token", (q) => q.eq("deviceToken", args.deviceToken))
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.gt(q.field("expiresAt"), Date.now())
        )
      )
      .first();
    return { trusted: !!device };
  },
});

/**
 * Revoke (delete) a trusted device for the current user.
 */
export const revokeTrustedDevice = mutation({
  args: { deviceToken: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const devices = await ctx.db
      .query("trustedDevices")
      .withIndex("by_token", (q) => q.eq("deviceToken", args.deviceToken))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    await Promise.all(devices.map((d) => ctx.db.delete(d._id)));

    return { success: true };
  },
});

/**
 * List all trusted devices for the current user.
 */
export const listTrustedDevices = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("trustedDevices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/**
 * Clean up expired trusted devices (can be called periodically).
 */
export const cleanupExpiredTrustedDevices = mutation({
  args: {},
  handler: async (ctx) => {
    const devices = await ctx.db
      .query("trustedDevices")
      .filter((q) =>
        q.or(
          q.eq(q.field("isActive"), false),
          q.lt(q.field("expiresAt"), Date.now())
        )
      )
      .collect();

    await Promise.all(devices.map((d) => ctx.db.delete(d._id)));

    return { success: true, removed: devices.length };
  },
});
