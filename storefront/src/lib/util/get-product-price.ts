import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

// Updated VariantPrice type to include specific tax fields
export type VariantPrice = {
  calculated_price_number: number // Base calculated price (might be incl. or excl. tax based on region)
  calculated_price: string // Formatted base calculated price
  calculated_price_tax_inclusive_number?: number // Price including tax
  calculated_price_tax_inclusive?: string // Formatted price including tax
  calculated_price_tax_exclusive_number?: number // Price excluding tax
  calculated_price_tax_exclusive?: string // Formatted price excluding tax
  original_price_number: number // Original price (before discounts/sales)
  original_price: string // Formatted original price
  currency_code: string
  price_type: string // e.g., 'default', 'sale'
  percentage_diff: string
}

// Updated function to extract detailed tax prices
export const getPricesForVariant = (variant: any): VariantPrice | null => {
  const calculatedPriceObj = variant?.calculated_price

  if (!calculatedPriceObj?.calculated_amount) {
    return null
  }

  const currencyCode = calculatedPriceObj.currency_code

  return {
    calculated_price_number: calculatedPriceObj.calculated_amount,
    calculated_price: convertToLocale({
      amount: calculatedPriceObj.calculated_amount,
      currency_code: currencyCode,
    }),
    // Extract tax-specific amounts if available
    calculated_price_tax_inclusive_number: calculatedPriceObj.calculated_amount_with_tax,
    calculated_price_tax_inclusive: calculatedPriceObj.calculated_amount_with_tax
      ? convertToLocale({
          amount: calculatedPriceObj.calculated_amount_with_tax,
          currency_code: currencyCode,
        })
      : undefined,
    calculated_price_tax_exclusive_number: calculatedPriceObj.calculated_amount_without_tax,
    calculated_price_tax_exclusive: calculatedPriceObj.calculated_amount_without_tax
      ? convertToLocale({
          amount: calculatedPriceObj.calculated_amount_without_tax,
          currency_code: currencyCode,
        })
      : undefined,
    // Original price details
    original_price_number: calculatedPriceObj.original_amount,
    original_price: convertToLocale({
      amount: calculatedPriceObj.original_amount,
      currency_code: currencyCode,
    }),
    currency_code: currencyCode,
    price_type: calculatedPriceObj.price_list_type, // Assuming price_list_type indicates 'sale' etc.
    percentage_diff: getPercentageDiff(
      calculatedPriceObj.original_amount,
      calculatedPriceObj.calculated_amount
    ),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!v.calculated_price) // Ensure variant has a calculated price
      .sort((a: any, b: any) => {
        // Sort based on the base calculated amount
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
