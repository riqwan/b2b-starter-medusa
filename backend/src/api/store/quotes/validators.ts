import {
  createFindParams,
  createOperatorMap,
} from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export type GetQuoteParamsType = z.infer<typeof GetQuoteParams>;
export const GetQuoteParams = createFindParams({
  limit: 15,
  offset: 0,
})
  .merge(
    z.object({
      q: z.string().optional(),
      id: z
        .union([z.string(), z.array(z.string()), createOperatorMap()])
        .optional(),
      draft_order_id: z
        .union([z.string(), z.array(z.string()), createOperatorMap()])
        .optional(),
      status: z
        .union([z.string(), z.array(z.string()), createOperatorMap()])
        .optional(),
      guest_id: z.string().optional(), // Add guest_id as optional query param
      created_at: createOperatorMap().optional(),
      updated_at: createOperatorMap().optional(),
      // customer_id filter should likely be handled internally based on auth, not exposed here
    })
  )
  .strict();

export type CreateQuoteType = z.infer<typeof CreateQuote>;
export const CreateQuote = z
  .object({
    cart_id: z.string().min(1),
    // Add email if we decide guests must provide it explicitly here
    // email: z.string().email().optional(),
  })
  .strict();

export type AcceptQuoteType = z.infer<typeof AcceptQuote>;
export const AcceptQuote = z.object({}).strict();

export type RejectQuoteType = z.infer<typeof RejectQuote>;
export const RejectQuote = z.object({}).strict();

export type StoreCreateQuoteMessageType = z.infer<
  typeof StoreCreateQuoteMessage
>;
export const StoreCreateQuoteMessage = z
  .object({
    text: z.string(),
    item_id: z.string().nullish(),
  })
  .strict();