"use client"

import { useTax } from "@/lib/context/tax-context" // Import useTax
import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const { includeTax } = useTax() // Use the tax context

  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  // Determine the final total to display based on the toggle
  const displayTotal = includeTax
    ? order.total
    : (order.subtotal ?? 0) +
      (order.shipping_total ?? 0) -
      (order.discount_total ?? 0) -
      (order.gift_card_total ?? 0)

  return (
    <div>
      <h2 className="text-base-semi">Order Summary</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex flex-col gap-y-1">
          {/* Keep these breakdowns as they are */}
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{getAmount(order.subtotal)}</span>
          </div>

          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Taxes</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          {/* Adjust the label based on the toggle */}
          <span>Total {includeTax ? "(Inc. Tax)" : "(Excl. Tax)"}</span>
          {/* Display the calculated total based on the toggle */}
          <span>{getAmount(displayTotal)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
