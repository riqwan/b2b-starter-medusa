import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import useTaxToggle from "@/lib/hooks/use-tax-toggle"
import { convertToLocale } from "@/lib/util/money"

export default function ProductPrice({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })
  const { showTaxes } = useTaxToggle()

  if (!cheapestPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Use the specific tax fields if available, otherwise fallback to the base calculated price
  const displayPrice = showTaxes
    ? cheapestPrice.calculated_price_tax_inclusive ?? cheapestPrice.calculated_price
    : cheapestPrice.calculated_price_tax_exclusive ?? cheapestPrice.calculated_price

  const displayPriceNumber = showTaxes
    ? cheapestPrice.calculated_price_tax_inclusive_number ?? cheapestPrice.calculated_price_number
    : cheapestPrice.calculated_price_tax_exclusive_number ?? cheapestPrice.calculated_price_number

  // Original price for comparison (assuming it's always tax-exclusive for simplicity, adjust if needed)
  const originalPrice = cheapestPrice.original_price
  const originalPriceNumber = cheapestPrice.original_price_number
  const priceType = cheapestPrice.price_type

  return (
    <div className="flex flex-col text-neutral-950">
      <span
        className={clx({
          "text-ui-fg-interactive": priceType === "sale",
        })}
      >
        <Text
          className="font-medium text-xl"
          data-testid="product-price"
          data-value={displayPriceNumber}
        >
          From {displayPrice}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">
          {showTaxes ? "Incl. Tax" : "Excl. Tax"}
        </Text>
      </span>
      {priceType === "sale" && (
        <p
          className="line-through text-neutral-500"
          data-testid="original-product-price"
          data-value={originalPriceNumber}
        >
          {originalPrice} {showTaxes ? "" : "(Excl. Tax)"} {/* Clarify if original is excl/incl */}
        </p>
      )}
    </div>
  )
}
