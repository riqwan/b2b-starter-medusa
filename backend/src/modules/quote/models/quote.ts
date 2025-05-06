import { model } from "@medusajs/framework/utils";
import { Message } from "./message";
import { generateEntityId } from "@medusajs/utils"; // Import generateEntityId

export const Quote = model.define("quote", {
  id: model.id({ prefix: "quo" }).primaryKey(),
  status: model
    .enum([
      "pending_merchant",
      "pending_customer",
      "accepted",
      "customer_rejected",
      "merchant_rejected",
    ])
    .default("pending_merchant"),
  customer_id: model.text().nullable(), // Make customer_id nullable
  guest_id: model.text().nullable().unique(), // Add guest_id field
  draft_order_id: model.text(),
  order_change_id: model.text(),
  cart_id: model.text(),
  messages: model.hasMany(() => Message),
  // Add beforeCreate hook to ensure guest_id uniqueness if needed,
  // although the unique constraint should handle this at DB level.
  // Consider adding indexing for guest_id if frequent lookups are expected.
});