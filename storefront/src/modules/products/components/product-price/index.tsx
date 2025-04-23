"use client" // Add this because we'll use a hook

import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { usePriceTax } from "@/lib/context/price-tax-context" // Import the context hook

export default function ProductPrice({
  product,
  variant, // Accept variant prop
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { showWithTax } = usePriceTax() // Consume context
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const displayPrice = showWithTax
    ? selectedPrice.calculated_price_with_tax
    : selectedPrice.calculated_price_without_tax

  const originalDisplayPrice = showWithTax
    ? selectedPrice.original_price_with_tax
    : selectedPrice.original_price_without_tax

  return (
    <div className="flex flex-col text-neutral-950">
      <span
        className={clx({
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        <Text
          className="font-medium text-xl"
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && "From "}
          {displayPrice || selectedPrice.calculated_price} {/* Fallback to default calculated if tax price is null */}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">
          {showWithTax ? "Incl. Tax" : "Excl. Tax"}
        </Text>
      </span>
      {selectedPrice.price_type === "sale" && originalDisplayPrice && (
        <p
          className="line-through text-neutral-500"
          data-testid="original-product-price"
          data-value={selectedPrice.original_price_number}
        >
          {originalDisplayPrice}
        </p>
      )}
    </div>
  )
}
