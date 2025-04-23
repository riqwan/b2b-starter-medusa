import { formatAmountWithTaxToggle, convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"
import { useTaxDisplay } from "@/lib/hooks/use-tax-display"

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
  const taxDisplayState = useTaxDisplay()
  const adjustmentsSum = (item.adjustments || []).reduce(
    (acc, adjustment) => adjustment.amount + acc,
    0
  )

  // Assuming original_total and total are tax-exclusive from Medusa V2
  // If they include tax based on region setting, this needs adjustment.
  const originalPriceExclTax = (item.original_total ?? 0) / item.quantity
  const currentPriceExclTax = ((item.total ?? 0) / item.quantity) - adjustmentsSum
  const itemTaxAmount = (item.tax_total ?? 0) / item.quantity // Assuming tax_total is available per item


  const displayOriginalPrice = formatAmountWithTaxToggle({ amount: originalPriceExclTax, currency_code: currencyCode, tax_amount: itemTaxAmount, taxDisplayState })
  const displayCurrentPrice = formatAmountWithTaxToggle({ amount: currentPriceExclTax, currency_code: currencyCode, tax_amount: itemTaxAmount, taxDisplayState })

  const hasReducedPrice = currentPriceExclTax < originalPriceExclTax

  return (
    <Text
      className={clx(
        "flex flex-col gap-x-2 text-ui-fg-subtle items-end",
        className
      )}
    >
      <span className="flex flex-col text-left">
        {hasReducedPrice && (
          <>
            <span
              className="line-through text-ui-fg-muted"
              data-testid="product-original-price"
            >
              {displayOriginalPrice}
            </span>

            {style === "default" && (
              <span className="text-base-regular text-ui-fg-interactive">
                -
                {/* Adjustments are usually pre-tax, display as is */}
                {convertToLocale({
                  amount: adjustmentsSum, // Display adjustment amount directly
                  currency_code: currencyCode ?? "eur",
                })}
              </span>
            )}
          </>
        )}
        <span className="text-base-regular" data-testid="product-price">
          {/* Display current price based on toggle */}
          {displayCurrentPrice}
        </span>
      </span>
    </Text>
  )
}

export default LineItemPrice
