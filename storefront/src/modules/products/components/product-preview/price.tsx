"use client"

import { useTax } from "@/lib/context/tax-context" // Import useTax
import { VariantPrice } from "@/lib/util/get-product-price"
import { Text, clx } from "@medusajs/ui"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  const { includeTax } = useTax() // Use the tax context

  if (!price) {
    return null
  }

  // Determine which price and original price to display based on toggle
  const displayPrice = includeTax
    ? price.calculated_price_with_tax
    : price.calculated_price
  const displayPriceNumber = includeTax
    ? price.calculated_price_with_tax_number
    : price.calculated_price_number

  const originalPrice = includeTax
    ? price.original_price_with_tax
    : price.original_price
  const originalPriceNumber = includeTax
    ? price.original_price_with_tax_number
    : price.original_price_number

  const isSale = displayPriceNumber < originalPriceNumber

  return (
    <>
      {isSale && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {originalPrice}
        </Text>
      )}

      <Text
        className={clx("text-neutral-950 font-medium text-lg", {
          "text-ui-fg-interactive": isSale,
        })}
        data-testid="price"
      >
        {displayPrice}
      </Text>
      {/* Adjust label based on toggle */}
      <Text className="text-neutral-600 text-[0.6rem]">
        {includeTax ? "Inc. Tax" : "Excl. Tax"}
      </Text>
    </>
  )
}
