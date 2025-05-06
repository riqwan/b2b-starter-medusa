import {
  BaseFilterable,
  Context,
  FindConfig,
  IModuleService,
} from "@medusajs/types";
import {
  ModuleCreateQuote,
  ModuleCreateQuoteMessage,
  ModuleQuote,
  ModuleQuoteMessage,
  ModuleUpdateQuote,
} from "./module";

export interface ModuleQuoteFilters extends BaseFilterable<ModuleQuoteFilters> {
  q?: string;
  id?: string | string[];
  status?: string | string[];
  guest_id?: string | string[]; // Add guest_id filter
}

/**
 * The main service interface for the Quote Module.
 */
export interface IQuoteModuleService extends IModuleService {
  /* Entity: Quotes */
  createQuotes(
    data: ModuleCreateQuote | (ModuleCreateQuote & { guest_id?: string | null }), // Allow guest_id during creation
    sharedContext?: Context
  ): Promise<ModuleQuote>;

  createQuotes(
    data: (ModuleCreateQuote | (ModuleCreateQuote & { guest_id?: string | null }))[], // Allow guest_id during creation
    sharedContext?: Context
  ): Promise<ModuleQuote[]>;

  updateQuotes(
    data: ModuleUpdateQuote,
    sharedContext?: Context
  ): Promise<ModuleQuote>;

  updateQuotes(
    data: ModuleUpdateQuote[],
    sharedContext?: Context
  ): Promise<ModuleQuote[]>;

  listQuotes(
    filters?: ModuleQuoteFilters,
    config?: FindConfig<ModuleQuote>,
    sharedContext?: Context
  ): Promise<ModuleQuote[]>;

  deleteQuotes(ids: string[], sharedContext?: Context): Promise<void>;

  /* Entity: Message */

  createMessages(
    data: ModuleCreateQuoteMessage,
    sharedContext?: Context
  ): Promise<ModuleQuoteMessage>;

  deleteMessages(ids: string[], sharedContext?: Context): Promise<void>;
}