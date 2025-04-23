"use client" // Needs to be client component to use context

import { VariantPrice } from "@/lib/util/get-product-price"
import { Text, clx } from "@medusajs/ui"
import { usePriceTax } from "@/lib/context/price-tax-context" // Import context hook

// TODO: Price needs to access price list type
export default function PreviewPrice({ price }: { price: VariantPrice }) { // Make it a client component
  const { showPricesWithTax } = usePriceTax() // Use context
  if (!price) {
    return null
  }

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
        {showPricesWithTax ? price.calculated_price_with_tax : price.calculated_price}
      </Text>
    </>
  )
}
