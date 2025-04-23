"use client"

import { VariantPrice } from "@/lib/util/get-product-price"
import { Text, clx } from "@medusajs/ui"
import { useTax } from "@/lib/context/tax-context" // Import useTax hook

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  const { includeTax } = useTax() // Consume the tax context

  if (!price) {
    return null
  }

  // Determine which price to display based on context
  const displayPrice = includeTax
    ? price.calculated_price_with_tax
    : price.calculated_price
  const originalDisplayPrice = includeTax
    ? price.original_price_with_tax
    : price.original_price

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {originalDisplayPrice}
        </Text>
      )}

      <Text
        className={clx("text-neutral-950 font-medium text-lg", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {displayPrice}
      </Text>
    </>
  )
}
