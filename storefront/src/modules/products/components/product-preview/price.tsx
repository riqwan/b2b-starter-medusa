import { VariantPrice } from "@/lib/util/get-product-price"
import { Text, clx } from "@medusajs/ui"
import { TaxDisplayState } from "@/lib/hooks/use-tax-display"
import { formatAmountWithTaxToggle } from "@/lib/util/money"

// TODO: Price needs to access price list type
export default async function PreviewPrice({
  price,
  taxDisplayState,
}: {
  price: VariantPrice
  taxDisplayState: TaxDisplayState // Receive state as prop
}) {
  if (!price) {
    return null
  }

  // TODO: Need actual tax info here. Using 0 for now.
  const displayPrice = formatAmountWithTaxToggle({ amount: price.calculated_price_number, currency_code: price.currency_code, tax_amount: 0, taxDisplayState })
  const displayOriginalPrice = formatAmountWithTaxToggle({ amount: price.original_price_number, currency_code: price.currency_code, tax_amount: 0, taxDisplayState })

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {displayOriginalPrice}
        </Text>
      )}
      <Text
        className={clx("text-neutral-950 font-medium text-lg", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {displayPrice}
      </Text>
    </>
  )
}
