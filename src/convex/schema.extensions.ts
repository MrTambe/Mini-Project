// SCHEMA EXTENSIONS — Add these to your existing src/convex/schema.ts
//
// Add this table definition to the schema object:
//
//   trustedDevices: defineTable({
//     userId: v.id("users"),
//     deviceToken: v.string(),
//     deviceName: v.optional(v.string()),
//     userAgent: v.optional(v.string()),
//     ipAddress: v.optional(v.string()),
//     createdAt: v.number(),
//     expiresAt: v.number(),
//     isActive: v.boolean(),
//   })
//     .index("by_user", ["userId"])
//     .index("by_token", ["deviceToken"])
//     .index("by_user_and_active", ["userId", "isActive"]),
//
//
// And import the trustedDevices functions:
//   import { createTrustedDevice, isDeviceTrusted, revokeTrustedDevice, listTrustedDevices } from "./trustedDevices";

export const trustedDevicesSchema = {
  trustedDevices: {
    fields: {
      userId: "id<users>",
      deviceToken: "string",
      deviceName: "optional string",
      userAgent: "optional string",
      ipAddress: "optional string",
      createdAt: "number",
      expiresAt: "number",
      isActive: "boolean",
    },
    indexes: ["by_user", "by_token", "by_user_and_active"],
  },
};
