"use client"

import { VariantPrice } from "@/lib/util/get-product-price"
import { Text, clx } from "@medusajs/ui"
import { usePriceDisplay } from "@/lib/context/price-display-context" // Import the context hook

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  const { showWithTax } = usePriceDisplay() // Use the context

  if (!price) {
    return null
  }

  // Determine which price to display based on the toggle
  const displayPrice = showWithTax
    ? price.calculated_price_with_tax
    : price.calculated_price_without_tax

  // Fallback to the default calculated price if tax-specific prices aren't available
  const finalDisplayPrice = displayPrice ?? price.calculated_price

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}

      <Text
        className={clx("text-neutral-950 font-medium text-lg", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {finalDisplayPrice}
      </Text>
    </>
  )
}
