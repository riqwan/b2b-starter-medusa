"use client"

import { useTax } from "@/lib/context/tax-context"
import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"

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
  const { includeTax } = useTax()

  // Use total for tax-inclusive, subtotal for tax-exclusive line item price
  const displayAmount = (includeTax ? item.total : item.subtotal) ?? 0
  const displayAmountPerItem = displayAmount / item.quantity

  // Original price logic might need refinement depending on how discounts interact with tax
  // Let's assume original_total is tax-inclusive and original_subtotal is tax-exclusive
  const originalAmount = (includeTax ? item.original_total : item.original_subtotal) ?? 0
  const originalAmountPerItem = originalAmount / item.quantity

  const hasReducedPrice = displayAmountPerItem < originalAmountPerItem

  // Calculate adjustments per item if needed, assuming adjustments apply pre-tax
  const adjustmentsSumPerItem = (item.adjustments || []).reduce(
    (acc, adjustment) => acc + adjustment.amount / item.quantity,
    0
  )

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
              {convertToLocale({
                amount: originalAmountPerItem,
                currency_code: currencyCode ?? "eur",
              })}
            </span>
            {/* Displaying discount amount might be complex with tax toggle, omitting for now */}
            {/* {style === "default" && (
              <span className="text-base-regular text-ui-fg-interactive">
                -
                {convertToLocale({
                  amount: adjustmentsSumPerItem,
                  currency_code: currencyCode ?? "eur",
                })}
              </span>
            )} */}
          </>
        )}
        <span className="text-base-regular" data-testid="product-price">
          {convertToLocale({
            amount: displayAmountPerItem,
            currency_code: currencyCode ?? "eur",
          })}
        </span>
      </span>
    </Text>
  )
}

export default LineItemPrice
