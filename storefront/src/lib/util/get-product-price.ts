import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

// TODO: Remove this util and use the AdminPrice type directly
export type ProductPriceType = {
  calculated_price_number: string
  calculated_price: string
  calculated_price_with_tax: string | null // Added
  calculated_price_without_tax: string | null // Added
  original_price_number: string
  original_price: string
  original_price_with_tax: string | null // Added
  original_price_without_tax: string | null // Added
  currency_code: string
  price_type: string
  percentage_diff: string
}

export const getPricesForVariant = (variant: any): ProductPriceType | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: convertToLocale({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    calculated_price_with_tax: variant.calculated_price.calculated_amount_with_tax ? convertToLocale({
      amount: variant.calculated_price.calculated_amount_with_tax,
      currency_code: variant.calculated_price.currency_code,
    }) : null,
    calculated_price_without_tax: variant.calculated_price.calculated_amount_without_tax ? convertToLocale({
      amount: variant.calculated_price.calculated_amount_without_tax,
      currency_code: variant.calculated_price.currency_code,
    }) : null,
    original_price_number: variant.calculated_price.original_amount,
    original_price: convertToLocale({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_with_tax: variant.calculated_price.original_amount_with_tax ? convertToLocale({
      amount: variant.calculated_price.original_amount_with_tax,
      currency_code: variant.calculated_price.currency_code,
    }) : null,
    original_price_without_tax: variant.calculated_price.original_amount_without_tax ? convertToLocale({
      amount: variant.calculated_price.original_amount_without_tax,
      currency_code: variant.calculated_price.currency_code,
    }) : null,
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price.price_list_type,
    percentage_diff: getPercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
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
