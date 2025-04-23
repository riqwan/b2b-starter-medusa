import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useTaxDisplay } from "@/lib/hooks/use-tax-display"
import { formatAmountWithTaxToggle } from "@/lib/util/money"

export default function ProductPrice({
  product,
  variant // Receive variant to potentially get tax info if needed
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const taxDisplayState = useTaxDisplay()
  const { cheapestPrice } = getProductPrice({
    product,
  })

  if (!cheapestPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // TODO: Need a way to get the applicable tax rate/amount for the cheapest price variant
  // For now, we'll display without tax adjustment as we lack the data.
  // Replace 'tax_amount: 0' with actual tax data when available.
  const displayPrice = formatAmountWithTaxToggle({ amount: cheapestPrice.calculated_price_number, currency_code: cheapestPrice.currency_code, tax_amount: 0, taxDisplayState })
  const displayOriginalPrice = formatAmountWithTaxToggle({ amount: cheapestPrice.original_price_number, currency_code: cheapestPrice.currency_code, tax_amount: 0, taxDisplayState })

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
          data-value={cheapestPrice.calculated_price_number}
        >
          From {displayPrice}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">{taxDisplayState === 'included' ? 'Incl. Tax' : 'Excl. Tax'}</Text>
      </span>
      {cheapestPrice.price_type === "sale" && (
        <p
          className="line-through text-neutral-500"
          data-testid="original-product-price"
          data-value={cheapestPrice.original_price_number}
        >
          {displayOriginalPrice}
        </p>
      )}
    </div>
  )
}
