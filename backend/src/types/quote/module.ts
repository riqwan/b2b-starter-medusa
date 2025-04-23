/* Entity: Quote */

export type ModuleQuote = {
  id: string;
  status: string;
  draft_order_id: string;
  order_change_id: string;
  cart_id: string;
  customer_id: string | null; // Make nullable
  guest_id: string | null;    // Add nullable guest_id
  created_at: string;
  updated_at: string;
};

export type ModuleCreateQuote = {
  draft_order_id: string;
  order_change_id: string;
  cart_id: string;
  customer_id?: string | null; // Make optional/nullable
  guest_id?: string | null;    // Add optional/nullable guest_id
};

export type ModuleUpdateQuote = {
  id: string;
  status?: string;
};

/* Entity: Message */

export type ModuleCreateQuoteMessage = {
  text: string;
  quote_id: string;
  admin_id?: string;
  customer_id?: string;
  item_id?: string | null;
};

export type ModuleQuoteMessage = {
  id: string;
  text: string;
  quote_id: string;
  admin_id: string;
  customer_id: string;
  item_id: string;
};