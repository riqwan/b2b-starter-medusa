"use client"

import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { usePriceDisplay } from "@/lib/context/price-display-context" // Import the context hook

export default function ProductPrice({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { showWithTax } = usePriceDisplay() // Use the context

  const { cheapestPrice } = getProductPrice({
    product,
  })

  if (!cheapestPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Determine which price to display based on the toggle
  const displayPrice = showWithTax
    ? cheapestPrice.calculated_price_with_tax
    : cheapestPrice.calculated_price_without_tax

  // Fallback to the default calculated price if tax-specific prices aren't available
  const finalDisplayPrice = displayPrice ?? cheapestPrice.calculated_price
  const priceLabel = showWithTax ? "Incl. VAT" : "Excl. VAT"

  return (
    <div className="flex flex-col text-neutral-950">
      <span
        className={clx({
          "text-ui-fg-interactive": cheapestPrice.price_type === "sale",
        })}
      >
        <Text
          className="font-medium text-xl"
          data-testid="product-price"
          data-value={cheapestPrice.calculated_price_number} // Keep original number for data value
        >
          From {finalDisplayPrice}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">{priceLabel}</Text>
      </span>
      {cheapestPrice.price_type === "sale" && (
        <p
          className="line-through text-neutral-500"
          data-testid="original-product-price"
          data-value={cheapestPrice.original_price_number}
        >
          {cheapestPrice.original_price}
        </p>
      )}
    </div>
  )
}
