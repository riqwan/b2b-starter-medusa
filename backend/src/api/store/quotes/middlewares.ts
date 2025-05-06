import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import {
  listQuotesTransformQueryConfig,
  retrieveQuoteTransformQueryConfig,
} from "./query-config";
import {
  AcceptQuote,
  CreateQuote,
  GetQuoteParams,
  RejectQuote,
  StoreCreateQuoteMessage,
} from "./validators";

export const storeQuotesMiddlewares: MiddlewareRoute[] = [
  // Apply optional authentication globally first for simplicity,
  // or apply specifically to routes needing it.
  // Applying globally might be easier to manage initially.
  {
    method: "ALL",
    matcher: "/store/quotes*",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true, // Allow unauthenticated access
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/quotes",
    middlewares: [
      // Authentication is already handled above
      validateAndTransformQuery(GetQuoteParams, listQuotesTransformQueryConfig),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/quotes",
    middlewares: [
      // Authentication is already handled above
      validateAndTransformBody(CreateQuote),
      validateAndTransformQuery(
        GetQuoteParams, // Keep this? Maybe not needed for POST response. Check queryConfig usage.
        retrieveQuoteTransformQueryConfig // Use retrieve config for response shaping
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/quotes/:id",
    middlewares: [
      // Authentication is already handled above
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/quotes/:id/accept",
    middlewares: [
      // Requires authentication - keep specific auth or rely on global?
      // If relying on global optional auth, ensure logic inside route checks for auth_context
      authenticate("customer", ["session", "bearer"]), // Keep strict auth here
      validateAndTransformBody(AcceptQuote),
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/quotes/:id/reject",
    middlewares: [
      // Requires authentication
      authenticate("customer", ["session", "bearer"]), // Keep strict auth here
      validateAndTransformBody(RejectQuote),
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/quotes/:id/preview",
    middlewares: [
      // Requires authentication? Assume yes for now.
      authenticate("customer", ["session", "bearer"]), // Keep strict auth here
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/quotes/:id/messages",
    middlewares: [
      // Requires authentication
      authenticate("customer", ["session", "bearer"]), // Keep strict auth here
      validateAndTransformBody(StoreCreateQuoteMessage),
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },
];