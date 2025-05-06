"use server"

import { sdk } from "@/lib/config"
import { retrieveCart } from "@/lib/data/cart" // Import retrieveCart
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
} from "@/lib/data/cookies"
import {
  QuoteFilterParams,
  StoreCreateQuoteMessage,
  StoreQuotePreviewResponse,
  StoreQuoteResponse,
  StoreQuotesResponse,
} from "@/types"
import { track } from "@vercel/analytics/server"
import { revalidateTag } from "next/cache"
import { getGuestId, setGuestId } from "./guest" // Import guest ID helpers

export const createQuote = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartId = await getCartId()

  // Ensure cart exists and has an email if user is guest
  const auth = await getAuthHeaders();
  if (!auth.hasOwnProperty('authorization')) {
    const cart = await retrieveCart(cartId);
    if (!cart?.email) {
      throw new Error("Cart email is required to create a quote for guest users.");
      // Consider prompting user for email or integrating with checkout email step
    }
  }

  return sdk.client
    .fetch<StoreQuoteResponse & { guest_id?: string }>(`/store/quotes`, { // Expect guest_id in response type
      method: "POST",
      body: { cart_id: cartId },
      headers,
    })
    .then(async (response) => {
      track("quote_created", {
        quote_id: response.quote.id,
      })

      // If guest_id is returned, store it
      if (response.guest_id) {
        await setGuestId(response.guest_id);
      }

      return response
    })
}

export const fetchQuotes = async (query?: QuoteFilterParams) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("quotes")),
  }

  return sdk.client.fetch<StoreQuotesResponse>(
    `/store/quotes?order=-created_at`,
    {
      method: "GET",
      query,
      headers,
      next,
    }
  )
}

export const fetchQuote = async (id: string, query?: QuoteFilterParams) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // If guest, add guest_id query parameter
  const auth = await getAuthHeaders();
  const guestId = await getGuestId();
  const guestQueryParam = !auth.hasOwnProperty('authorization') && guestId ? `&guest_id=${guestId}` : '';

  const next = {
    ...(await getCacheOptions(["quote", id].join("-"))),
  }

  return sdk.client.fetch<StoreQuoteResponse>(`/store/quotes/${id}?${guestQueryParam.substring(1)}`, { // Append guest_id if present
    method: "GET",
    query,
    headers: { ...headers }, // Ensure headers is an object
    next,
  })
}

export const fetchQuotePreview = async (
  id: string,
  query?: QuoteFilterParams
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // If guest, add guest_id query parameter
  const auth = await getAuthHeaders();
  const guestId = await getGuestId();
  const guestQueryParam = !auth.hasOwnProperty('authorization') && guestId ? `&guest_id=${guestId}` : '';

  const next = {
    ...(await getCacheOptions(["quotePreview", id].join("-"))),
  }

  return sdk.client.fetch<StoreQuotePreviewResponse>(
    `/store/quotes/${id}/preview?${guestQueryParam.substring(1)}`, // Append guest_id if present
    {
      method: "GET", // Preview might still require auth, adjust if needed
      query,
      headers,
      next,
    }
  )
}

export const acceptQuote = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // Ensure user is authenticated to accept
  if (!headers.hasOwnProperty('authorization')) {
    throw new Error("Authentication required to accept a quote.");
  }

  return sdk.client
    .fetch<StoreQuoteResponse>(`/store/quotes/${id}/accept`, {
      method: "POST",
      body: {},
      headers,
      cache: "force-cache",
    })
    .then((res) => {
      track("quote_accepted", {
        quote_id: res.quote.id,
      })

      return res
    })
    .finally(async () => {
      const tags = await Promise.all([
        getCacheTag("quotes"),
        getCacheTag(["quote", id].join("-")),
        getCacheTag(["quotePreview", id].join("-")),
      ])
      tags.forEach((tag) => revalidateTag(tag))
    })
}

export const rejectQuote = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // Ensure user is authenticated to reject
  if (!headers.hasOwnProperty('authorization')) {
    throw new Error("Authentication required to reject a quote.");
  }

  return sdk.client
    .fetch<StoreQuoteResponse>(`/store/quotes/${id}/reject`, {
      method: "POST",
      body: {},
      headers,
      cache: "force-cache",
    })
    .finally(async () => {
      const tags = await Promise.all([
        getCacheTag("quotes"),
        getCacheTag(["quote", id].join("-")),
        getCacheTag(["quotePreview", id].join("-")),
      ])
      tags.forEach((tag) => revalidateTag(tag))
    })
}

export const createQuoteMessage = async (
  id: string,
  body: StoreCreateQuoteMessage
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // Ensure user is authenticated to send messages
  if (!headers.hasOwnProperty('authorization')) {
    throw new Error("Authentication required to send quote messages.");
  }

  return sdk.client
    .fetch<StoreQuoteResponse>(`/store/quotes/${id}/messages`, {
      method: "POST",
      body,
      headers,
      cache: "force-cache",
    })
    .then((res) => {
      track("quote_message_created", {
        quote_id: res.quote.id,
      })

      return res
    })
    .finally(async () => {
      const tags = await Promise.all([
        getCacheTag("quotes"),
        getCacheTag(["quote", id].join("-")),
        getCacheTag(["quotePreview", id].join("-")),
      ])
      tags.forEach((tag) => revalidateTag(tag))
    })
}
