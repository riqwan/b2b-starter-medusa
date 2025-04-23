"use client"

import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useTax } from "@/lib/context/tax-context" // Import useTax hook

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { includeTax } = useTax() // Consume the tax context
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Determine which price to display based on context
  const displayPrice = includeTax
    ? selectedPrice.calculated_price_with_tax
    : selectedPrice.calculated_price
  const displayPriceNumber = includeTax
    ? selectedPrice.calculated_price_with_tax_number
    : selectedPrice.calculated_price_number
  const originalDisplayPrice = includeTax
    ? selectedPrice.original_price_with_tax
    : selectedPrice.original_price
  const originalDisplayPriceNumber = includeTax
    ? selectedPrice.original_price_with_tax_number
    : selectedPrice.original_price_number

  return (
    <div className="flex flex-col text-neutral-950">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "From "}
        <Text
          className="font-medium text-xl"
          data-testid="product-price"
          data-value={displayPriceNumber}
        >
          {displayPrice}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">
          {includeTax ? "Incl. Tax" : "Excl. Tax"}
        </Text>
      </span>
      {selectedPrice.price_type === "sale" && (
        <p>
          <span className="text-ui-fg-subtle">Original: </span>
          <span
            className="line-through text-neutral-500"
            data-testid="original-product-price"
            data-value={originalDisplayPriceNumber}
          >
            {originalDisplayPrice}
          </span>
        </p>
      )}
    </div>
  )
}
