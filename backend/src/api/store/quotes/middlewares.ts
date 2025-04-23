import {
  authenticate, // Keep this import
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
  // REMOVED: Global authentication for /store/quotes*
  // {
  //   method: "ALL",
  //   matcher: "/store/quotes*",
  //   middlewares: [authenticate("customer", ["session", "bearer"])],
  // },

  // GET /store/quotes (List quotes for the logged-in customer)
  {
    method: ["GET"],
    matcher: "/store/quotes",
    middlewares: [
      authenticate("customer", ["session", "bearer"]), // ADDED: Auth required
      validateAndTransformQuery(GetQuoteParams, listQuotesTransformQueryConfig),
    ],
  },

  // POST /store/quotes (Create quote - Allow guests)
  {
    method: ["POST"],
    matcher: "/store/quotes",
    middlewares: [
      authenticate("customer", ["session", "bearer"], { allowUnauthenticated: true }), // ADDED: Allow guests
      validateAndTransformBody(CreateQuote),
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig // Keep query validation if needed, though maybe not necessary for create? Review validator.
      ),
    ],
  },

  // GET /store/quotes/:id (Get specific quote - Requires auth)
  {
    method: ["GET"],
    matcher: "/store/quotes/:id",
    middlewares: [
      authenticate("customer", ["session", "bearer"]), // ADDED: Auth required
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },

  // POST /store/quotes/:id/accept (Accept quote - Requires auth)
  {
    method: ["POST"],
    matcher: "/store/quotes/:id/accept",
    middlewares: [
      authenticate("customer", ["session", "bearer"]), // ADDED: Auth required
      validateAndTransformBody(AcceptQuote),
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },

  // POST /store/quotes/:id/reject (Reject quote - Requires auth)
  {
    method: ["POST"],
    matcher: "/store/quotes/:id/reject",
    middlewares: [
      authenticate("customer", ["session", "bearer"]), // ADDED: Auth required
      validateAndTransformBody(RejectQuote),
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },

  // GET /store/quotes/:id/preview (Preview quote - Requires auth)
  {
    method: ["GET"],
    matcher: "/store/quotes/:id/preview",
    middlewares: [
      authenticate("customer", ["session", "bearer"]), // ADDED: Auth required
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },

  // POST /store/quotes/:id/messages (Add message - Requires auth)
  {
    method: ["POST"],
    matcher: "/store/quotes/:id/messages",
    middlewares: [
      authenticate("customer", ["session", "bearer"]), // ADDED: Auth required
      validateAndTransformBody(StoreCreateQuoteMessage),
      validateAndTransformQuery(
        GetQuoteParams,
        retrieveQuoteTransformQueryConfig
      ),
    ],
  },
  // NOTE: New route for GET /store/quotes/by-cart/:cart_id will be added later without auth.
];
