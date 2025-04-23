import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

// Updated VariantPrice type to include both tax-inclusive and exclusive prices
export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string // This will represent the price based on region setting (incl. or excl. tax)
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
  calculated_price_with_tax?: string // Explicitly tax-inclusive price
  calculated_price_without_tax?: string // Explicitly tax-exclusive price
  is_calculated_price_tax_inclusive?: boolean // Flag from API
}

export const getPricesForVariant = (variant: any): VariantPrice | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  const calculatedPrice = variant.calculated_price

  const hasTaxPrices = typeof calculatedPrice.calculated_amount_with_tax === 'number' && typeof calculatedPrice.calculated_amount_without_tax === 'number';

  return {
    calculated_price_number: calculatedPrice.calculated_amount,
    calculated_price: convertToLocale({
      amount: calculatedPrice.calculated_amount,
      currency_code: calculatedPrice.currency_code,
    }),
    original_price_number: calculatedPrice.original_amount,
    original_price: convertToLocale({
      amount: calculatedPrice.original_amount,
      currency_code: calculatedPrice.currency_code,
    }),
    currency_code: calculatedPrice.currency_code,
    price_type: calculatedPrice.price_list_type,
    percentage_diff: getPercentageDiff(
      calculatedPrice.original_amount,
      calculatedPrice.calculated_amount
    ),
    // Add tax-specific fields if available
    calculated_price_with_tax: hasTaxPrices ? convertToLocale({
      amount: calculatedPrice.calculated_amount_with_tax,
      currency_code: calculatedPrice.currency_code,
    }) : undefined,
    calculated_price_without_tax: hasTaxPrices ? convertToLocale({
      amount: calculatedPrice.calculated_amount_without_tax,
      currency_code: calculatedPrice.currency_code,
    }) : undefined,
    is_calculated_price_tax_inclusive: calculatedPrice.is_calculated_price_tax_inclusive,
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
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
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
