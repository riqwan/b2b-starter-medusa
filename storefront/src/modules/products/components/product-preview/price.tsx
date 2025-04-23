"use client" // Add this because we'll use a hook

import { ProductPriceType } from "@/lib/util/get-product-price"
import { Text, clx } from "@medusajs/ui"
import { usePriceTax } from "@/lib/context/price-tax-context" // Import the context hook

// TODO: Price needs to access price list type
export default function PreviewPrice({ price }: { price: ProductPriceType }) {
  const { showWithTax } = usePriceTax() // Consume context

  if (!price) {
    return null
  }

  const displayPrice = showWithTax
    ? price.calculated_price_with_tax
    : price.calculated_price_without_tax

  const originalDisplayPrice = showWithTax
    ? price.original_price_with_tax
    : price.original_price_without_tax

  return (
    <>
      {price.price_type === "sale" && originalDisplayPrice && (
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
        {displayPrice || price.calculated_price} {/* Fallback to default calculated if tax price is null */}
      </Text>
      {/* Add tax label based on context */}
      <Text className="text-neutral-600 text-[0.6rem]">
        {showWithTax ? "Incl. Tax" : "Excl. Tax"}
      </Text>
    </>
  )
}
