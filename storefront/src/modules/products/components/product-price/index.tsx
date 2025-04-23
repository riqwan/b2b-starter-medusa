import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { usePriceTax } from "@/lib/context/price-tax-context" // Import context hook

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant // Accept variant prop
}) {
  const { showPricesWithTax } = usePriceTax() // Use context
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id, // Pass variantId if available
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice // Use variant price if available, otherwise cheapest

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

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
          data-value={showPricesWithTax ? selectedPrice.calculated_price_number_with_tax : selectedPrice.calculated_price_number}
        >
          {!variant && "From "} {/* Show "From" only if no specific variant is selected */}
          {showPricesWithTax ? selectedPrice.calculated_price_with_tax : selectedPrice.calculated_price}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">
          {showPricesWithTax ? "Incl. Tax" : "Excl. Tax"}
        </Text>
      </span>
      {selectedPrice.price_type === "sale" && (
        <p
          className="line-through text-neutral-500"
          data-testid="original-product-price"
          data-value={selectedPrice.original_price_number}
        >
          {selectedPrice.original_price}
        </p>
      )}
    </div>
  )
}
