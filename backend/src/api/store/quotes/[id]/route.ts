import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  MedusaRequest, // Import MedusaRequest for potentially unauthenticated
} from "@medusajs/framework";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { GetQuoteParamsType } from "../validators";
import { MedusaError } from "@medusajs/utils"; // Import MedusaError

export const GET = async (
  // Use MedusaRequest as auth is optional
  req: MedusaRequest<object, GetQuoteParamsType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const customerId = req.auth_context?.actor_id;
  const guestId = req.validatedQuery?.guest_id; // Get validated guest_id

  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  );

  let quoteFilter: Record<string, any> = { id };

  if (customerId) {
    // Authenticated user: filter by customer_id
    quoteFilter.customer_id = customerId;
  } else if (guestId) {
    // Guest user: filter by guest_id
    quoteFilter.guest_id = guestId;
  } else {
    // Unauthenticated and no guest_id provided: Forbidden/Not Found
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `Quote with id: ${id} not found`);
  }

  const {
    data: [quote],
  } = await query.graph(
    {
      entity: "quote",
      fields: req.queryConfig.fields,
      filters: {
        ...quoteFilter,
      },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ quote });
};