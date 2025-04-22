import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

// Updated VariantPrice type to include tax fields
export type VariantPrice = {
  calculated_price_number: number // Price excluding tax
  calculated_price: string // Formatted price excluding tax
  calculated_price_with_tax_number: number // Price including tax
  calculated_price_with_tax: string // Formatted price including tax
  original_price_number: number // Original price excluding tax
  original_price: string // Formatted original price excluding tax
  original_price_with_tax_number: number // Original price including tax
  original_price_with_tax: string // Formatted original price including tax
  currency_code: string
  price_type: string
  percentage_diff: string
}

// Updated function to extract tax fields
export const getPricesForVariant = (
  variant: HttpTypes.StoreProductVariant
): VariantPrice | null => {
  const calculatedPriceObject = variant?.calculated_price

  if (!calculatedPriceObject?.calculated_amount) {
    return null
  }

  const calculatedAmount = calculatedPriceObject.calculated_amount
  const calculatedAmountWithTax =
    calculatedPriceObject.calculated_amount_with_tax ?? calculatedAmount // Fallback if not present
  const originalAmount = calculatedPriceObject.original_amount
  const originalAmountWithTax =
    calculatedPriceObject.original_amount_with_tax ?? originalAmount // Fallback if not present
  const currencyCode = calculatedPriceObject.currency_code

  return {
    calculated_price_number: calculatedAmount,
    calculated_price: convertToLocale({
      amount: calculatedAmount,
      currency_code: currencyCode,
    }),
    calculated_price_with_tax_number: calculatedAmountWithTax,
    calculated_price_with_tax: convertToLocale({
      amount: calculatedAmountWithTax,
      currency_code: currencyCode,
    }),
    original_price_number: originalAmount,
    original_price: convertToLocale({
      amount: originalAmount,
      currency_code: currencyCode,
    }),
    original_price_with_tax_number: originalAmountWithTax,
    original_price_with_tax: convertToLocale({
      amount: originalAmountWithTax,
      currency_code: currencyCode,
    }),
    currency_code: currencyCode,
    price_type: calculatedPriceObject.price_list_type,
    percentage_diff: getPercentageDiff(originalAmount, calculatedAmount),
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

    // Sort by calculated_amount (tax-exclusive) to find the cheapest base price variant
    const cheapestVariant = product.variants
      .filter((v) => !!v.calculated_price)
      .sort((a, b) => {
        return (
          (a.calculated_price?.calculated_amount ?? Infinity) -
          (b.calculated_price?.calculated_amount ?? Infinity)
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant = product.variants?.find(
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
