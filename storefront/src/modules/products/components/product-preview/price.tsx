"use client"

import { useTax } from "@/lib/context/tax-context" // Import useTax
import { VariantPrice } from "@/lib/util/get-product-price"
import { Text, clx } from "@medusajs/ui"

// TODO: Price needs to access price list type
export default function PreviewPrice({ price }: { price: VariantPrice }) {
  const { includeTax } = useTax() // Use the tax context

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
        {price.calculated_price}
      </Text>
      {/* Adjust label based on toggle */}
      <Text className="text-neutral-600 text-[0.6rem]">
        {includeTax ? "Inc. Tax" : "Excl. Tax"}
      </Text>
    </>
  )
}
