import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createRequestForQuoteWorkflow } from "../../../workflows/quote/workflows/create-request-for-quote";
import { CreateQuoteType, GetQuoteParamsType } from "./validators";

export const GET = async (
  req: AuthenticatedMedusaRequest<GetQuoteParamsType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  );

  // Ensure actor_id exists for listing quotes (middleware already enforces this)
  if (!req.auth_context?.actor_id) {
    // This should technically not happen due to middleware, but good practice to check
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { fields, pagination } = req.queryConfig;
  const { data: quotes, metadata } = await query.graph({
    entity: "quote",
    fields,
    filters: {
      customer_id: req.auth_context.actor_id,
    },
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
  req: AuthenticatedMedusaRequest<CreateQuoteType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  );

  // Determine customer_id: use authenticated user if available, otherwise null for guests
  const customerId = req.auth_context?.actor_id ?? null;

  const {
    result: { quote: createdQuote },
  } = await createRequestForQuoteWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      customer_id: customerId, // Pass determined customerId (can be null)
    },
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

  return res.json({ quote });
};
