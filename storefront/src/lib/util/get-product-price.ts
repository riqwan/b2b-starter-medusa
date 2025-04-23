import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

export type VariantPrice = {
  calculated_price_number: string
  calculated_price: string
  calculated_price_includes_tax: boolean // Add flag to indicate if displayed price includes tax
  original_price_number: string
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export const getPricesForVariant = (
  variant: any,
  includeTax: boolean
): VariantPrice | null => {
  const calculatedPrice = variant?.calculated_price

  if (!calculatedPrice?.calculated_amount) {
    return null
  }

  const priceWithTax = calculatedPrice.calculated_amount_with_tax
  const priceWithoutTax = calculatedPrice.calculated_amount_without_tax

  // Determine which price to display based on the includeTax flag
  // Fallback to calculated_amount if specific tax amounts are missing
  const displayAmount = includeTax
    ? priceWithTax ?? calculatedPrice.calculated_amount
    : priceWithoutTax ?? calculatedPrice.calculated_amount

  // Determine if the displayed price actually includes tax (could differ from flag if data is missing)
  const displayAmountIncludesTax = includeTax && priceWithTax !== null && priceWithTax !== undefined

  return {
    calculated_price_number: displayAmount,
    calculated_price: convertToLocale({
      amount: displayAmount,
      currency_code: calculatedPrice.currency_code,
    }),
    calculated_price_includes_tax: displayAmountIncludesTax,
    original_price_number: calculatedPrice.original_amount,
    original_price: convertToLocale({
      amount: calculatedPrice.original_amount,
      currency_code: calculatedPrice.currency_code,
    }),
    currency_code: calculatedPrice.currency_code,
    price_type: calculatedPrice.price_list_type,
    percentage_diff: getPercentageDiff(
      calculatedPrice.original_amount,
      displayAmount // Compare original with the displayed amount
    ),
  }
}

export function getProductPrice({
  product,
  variantId,
  includeTax, // Add includeTax parameter
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
  includeTax: boolean // Add includeTax parameter type
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

    return getPricesForVariant(cheapestVariant, includeTax)
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

    return getPricesForVariant(variant, includeTax)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
