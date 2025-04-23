import {
  AdminCustomer,
  AdminOrder,
  AdminUser,
  StoreCart,
} from "@medusajs/types";
import { ModuleQuote, ModuleQuoteMessage } from "./module";
import { QueryEmployee } from "../company";

export type QueryQuote = ModuleQuote & {
  draft_order: AdminOrder;
  cart: StoreCart;
  customer?: (AdminCustomer & { // Make customer potentially optional for guests
    employee: QueryEmployee;
  }) | null;
  messages: QueryQuoteMessage[];
};

export type QueryQuoteMessage = ModuleQuoteMessage & {
  customer: AdminCustomer;
  admin: AdminUser;
};