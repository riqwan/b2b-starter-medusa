import {
  beginOrderEditOrderWorkflow,
  createOrdersWorkflow,
  CreateOrderWorkflowInput, // Import the input type
  useRemoteQueryStep,
} from "@medusajs/core-flows";
import { OrderStatus } from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { createQuotesWorkflow } from "./create-quote";

/*
  A workflow that creates a request for quote. 
  
  Quotes contain links to a draft order, customer and cart. Any changes (updated price, quantity, etc) made on the quote
  is performed within the scope of a draft order. We then re-use the order edit functionality of the order to stage
  any changes to the quote made by the merchant. 

  The customer can then accept or reject the changes. The lifecycle of the quote is managed through its status,
  that is performed by independent workflows - accept / reject.
*/
export const createRequestForQuoteWorkflow = createWorkflow(
  "create-request-for-quote",
  // Update input type
  function (input: {
    cart_id: string;
    customer_id?: string; // Make customer_id optional
    guest_id?: string;    // Add optional guest_id
    email?: string;       // Add optional email for guests
  }) {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: [
        "id",
        "sales_channel_id",
        "currency_code",
        "region_id",
        "customer.id",
        "customer.email",
        "shipping_address.*",
        "billing_address.*",
        "items.*",
        "shipping_methods.*",
        "promotions.code",
      ],
      variables: { id: input.cart_id },
      list: false,
      throw_if_key_not_found: true,
    });

    // Only query customer if customer_id is provided
    let customer: any = undefined;
    if (input.customer_id) {
      customer = useRemoteQueryStep({
        entry_point: "customer",
        fields: ["id", "email"], // Only need email if not provided in input
        variables: { id: input.customer_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "customer-query" });
    }

    const orderInput = transform({ cart, customer, input }, ({ cart, customer, input }) => {
      return {
        is_draft_order: true,
        status: OrderStatus.DRAFT,
        sales_channel_id: cart.sales_channel_id,
        // Use input email for guests, customer email otherwise
        email: input.customer_id ? customer.email : input.email,
        // Use input customer_id if available
        customer_id: input.customer_id,
        billing_address: cart.billing_address,
        shipping_address: cart.shipping_address,
        items: cart.items,
        region_id: cart.region_id,
        promo_codes: cart.promotions.map(({ code }) => code),
        currency_code: cart.currency_code,
        shipping_methods: cart.shipping_methods,
      } as CreateOrderWorkflowInput; // Cast to the correct type
    });

    const draftOrder = createOrdersWorkflow.runAsStep({
      input: orderInput,
    });

    const orderEditInput = transform({ draftOrder }, ({ draftOrder }) => {
      return {
        order_id: draftOrder.id,
        description: "",
        internal_note: "",
        metadata: {},
      };
    });

    const changeOrder = beginOrderEditOrderWorkflow.runAsStep({
      input: orderEditInput,
    });

    const quoteInput = transform({ draftOrder, cart, input, changeOrder }, ({ draftOrder, cart, input, changeOrder }) => ({
      draft_order_id: draftOrder.id,
      cart_id: cart.id,
      customer_id: input.customer_id, // Pass customer_id if exists
      guest_id: input.guest_id,       // Pass guest_id if exists
      order_change_id: changeOrder.id,
    }));

    const quotes = createQuotesWorkflow.runAsStep({
      input: [
        quoteInput
      ],
    });

    return new WorkflowResponse({ quote: quotes[0] });
  }
);