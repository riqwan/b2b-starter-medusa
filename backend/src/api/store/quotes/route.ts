import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  MedusaRequest, // Import MedusaRequest for potentially unauthenticated
} from "@medusajs/framework";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createRequestForQuoteWorkflow } from "../../../workflows/quote/workflows/create-request-for-quote";
import { CreateQuoteType, GetQuoteParamsType } from "./validators";
import { randomUUID } from "crypto"; // Import randomUUID

export const GET = async (
  req: AuthenticatedMedusaRequest<GetQuoteParamsType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  );

  // Filter by customer_id only if authenticated
  const customerFilter = req.auth_context?.actor_id
    ? { customer_id: req.auth_context.actor_id }
    : {};

  const { fields, pagination } = req.queryConfig;
  const { data: quotes, metadata } = await query.graph({
    entity: "quote",
    fields,
    filters: {
      ...customerFilter,
      // Add other potential filters from req.query if needed, ensuring they don't bypass security
    },
    // Ensure guests cannot list all quotes - apply necessary filters
    pagination: {
      ...pagination,
      skip: pagination.skip!,
    },
  });

  res.json({
    quotes,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  });
};

export const POST = async (
  // Use MedusaRequest as auth is optional
  req: MedusaRequest<CreateQuoteType, GetQuoteParamsType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  );
  const customerId = req.auth_context?.actor_id;
  let guestId: string | undefined = undefined;
  let email: string | undefined = undefined;

  // If guest, generate guest_id and try to get email from cart
  if (!customerId) {
    guestId = randomUUID();
    // Fetch cart to get email - requires cart_id in body
    const { data: [cart] } = await query.graph({
      entity: "cart",
      fields: ["email"],
      filters: { id: req.validatedBody.cart_id },
    });

    if (!cart?.email) {
      // Handle missing email for guest quote - perhaps return an error
      // Or modify workflow/API to accept email directly in the request body for guests
      return res.status(400).json({ message: "Email is required for guest quotes." });
    }
    email = cart.email;
  }

  const workflowInput = {
    ...req.validatedBody,
    customer_id: customerId, // Will be undefined for guests
    guest_id: guestId,       // Will be undefined for customers
    email: email,            // Provide email for guests
  };

  const {
    result: { quote: createdQuote },
  } = await createRequestForQuoteWorkflow(req.scope).run({
    input: workflowInput,
  });

  const {
    data: [quote],
  } = await query.graph(
    {
      entity: "quote",
      fields: req.queryConfig.fields,
      filters: { id: createdQuote.id },
    },
    { throwIfKeyNotFound: true }
  );

  // Return guest_id for guest users
  const responsePayload: { quote: any; guest_id?: string } = { quote };
  if (guestId) {
    responsePayload.guest_id = guestId;
  }

  return res.json(responsePayload);
};