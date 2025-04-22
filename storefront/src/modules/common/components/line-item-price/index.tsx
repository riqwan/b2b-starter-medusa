import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"
import useTaxToggle from "@/lib/hooks/use-tax-toggle"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  className?: string
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  className,
  currencyCode,
}: LineItemPriceProps) => {
  const { showTaxes } = useTaxToggle()

  // Determine the price to display based on the toggle
  const displayPriceAmount = showTaxes ? item.total : item.subtotal

  // Determine the original price for comparison (use original_total for tax-inclusive comparison, original_subtotal for tax-exclusive)
  // Note: This assumes original_subtotal exists and represents the pre-tax, pre-discount price.
  // Adjust if the definition of 'original' needs clarification for tax-exclusive view.
  const originalPriceAmount = showTaxes ? item.original_total : item.original_subtotal ?? item.original_total

  const hasReducedPrice = (displayPriceAmount ?? 0) < (originalPriceAmount ?? 0)

  return (
    <Text
      className={clx(
        "flex flex-col gap-x-2 text-ui-fg-subtle items-end",
        className
      )}
    >
      <span className="flex flex-col text-left">
        {hasReducedPrice && originalPriceAmount !== null && originalPriceAmount !== undefined && (
          <>
            <span
              className="line-through text-ui-fg-muted"
              data-testid="product-original-price"
            >
              {convertToLocale({
                amount: originalPriceAmount,
                currency_code: currencyCode ?? "eur",
              })}
            </span>

            {/* Optional: Show discount amount if needed, requires calculation */}
            {/* {style === "default" && (
              <span className="text-base-regular text-ui-fg-interactive">
                -
                {convertToLocale({
                  amount: (originalPriceAmount ?? 0) - (displayPriceAmount ?? 0),
                  currency_code: currencyCode ?? "eur",
                })}
              </span>
            )} */}
          </>
        )}
        <span
          className={clx("text-base-regular", {
            "text-ui-fg-interactive": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: displayPriceAmount ?? 0,
            currency_code: currencyCode ?? "eur",
          })}
        </span>
      </span>
    </Text>
  )
}

export default LineItemPrice
