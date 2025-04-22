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

  const adjustmentsSum = (item.adjustments || []).reduce(
    (acc, adjustment) => adjustment.amount + acc,
    0
  )

  // Use total for tax-inclusive, subtotal for tax-exclusive
  const displayAmount = includeTax ? item.total : item.subtotal

  // Original price calculation might need adjustment based on tax setting if applicable
  // For now, keep original price logic as is, assuming it's typically shown pre-tax
  const originalPrice = item.original_total ?? 0 / item.quantity
  const currentPrice = displayAmount ?? 0 / item.quantity - adjustmentsSum

  const hasReducedPrice = currentPrice < originalPrice && includeTax // Only show strikethrough if tax is included and price reduced

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
                amount: originalPrice,
                currency_code: currencyCode ?? "eur",
              })}
            </span>

            {style === "default" && (
              <span className="text-base-regular text-ui-fg-interactive">
                -
                {convertToLocale({
                  amount: adjustmentsSum,
                  currency_code: currencyCode ?? "eur",
                })}
              </span>
            )}
          </>
        )}
        <span className="text-base-regular" data-testid="product-price">
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode ?? "eur",
          })}
        </span>
      </span>
    </Text>
  )
}

export default LineItemPrice
