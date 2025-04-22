"use client"

import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useTax } from "@/lib/context/tax-context" // Import useTax
import { convertToLocale } from "@/lib/util/money"

export default function ProductPrice({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { includeTax } = useTax() // Use the tax context

  // Find the cheapest variant with a calculated price
  const cheapestVariant = useMemo(() => {
    if (!product || !product.variants?.length) {
      return null
    }
    return product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        // Sort by the appropriate amount based on the tax toggle
        const priceA = includeTax
          ? a.calculated_price.calculated_amount_with_tax
          : a.calculated_price.calculated_amount
        const priceB = includeTax
          ? b.calculated_price.calculated_amount_with_tax
          : b.calculated_price.calculated_amount
        return priceA - priceB
      })[0]
  }, [product, includeTax])

  if (!cheapestVariant || !cheapestVariant.calculated_price) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const { calculated_price } = cheapestVariant

  // Get the correct amount based on the toggle
  const displayAmount = includeTax
    ? calculated_price.calculated_amount_with_tax
    : calculated_price.calculated_amount

  // Get the original amount (strikethrough price)
  // Decide if original should also be tax-inclusive/exclusive based on toggle?
  // For simplicity, let's assume original is usually shown pre-tax or as Medusa provides it.
  const originalAmount = calculated_price.original_amount

  const currencyCode = calculated_price.currency_code
  const isSale = displayAmount < originalAmount

  return (
    <div className="flex flex-col text-neutral-950">
      <span
        className={clx({
          "text-ui-fg-interactive": isSale,
        })}
      >
        <Text
          className="font-medium text-xl"
          data-testid="product-price"
          data-value={displayAmount}
        >
          From{" "}
          {convertToLocale({
            amount: displayAmount,
            currency_code: currencyCode,
          })}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">
          {includeTax ? "Inc. Tax" : "Excl. Tax"}
        </Text>
      </span>
      {isSale && (
        <Text
          className="line-through text-neutral-500"
          data-testid="original-product-price"
          data-value={originalAmount}
        >
          {convertToLocale({
            amount: originalAmount,
            currency_code: currencyCode,
          })}
        </Text>
      )}
    </div>
  )
}
