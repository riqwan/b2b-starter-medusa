import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

// Updated VariantPrice type to include both tax amounts
export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  calculated_price_with_tax_number: number
  calculated_price_with_tax: string
  original_price_number: number
  original_price: string
  original_price_with_tax_number: number
  original_price_with_tax: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export const getPricesForVariant = (variant: any): VariantPrice | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  const calculatedAmount = variant.calculated_price.calculated_amount
  const originalAmount = variant.calculated_price.original_amount
  const currencyCode = variant.calculated_price.currency_code

  // Use tax-inclusive amounts if available, otherwise fallback to non-tax amounts
  const calculatedAmountWithTax = variant.calculated_price.calculated_amount_with_tax ?? calculatedAmount
  const originalAmountWithTax = variant.calculated_price.original_amount_with_tax ?? originalAmount

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
    price_type: variant.calculated_price.calculated_price.price_list_type,
    percentage_diff: getPercentageDiff(
      originalAmount,
      calculatedAmount
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
