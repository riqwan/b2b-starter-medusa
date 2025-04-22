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

  // Determine the final total and label to display based on the toggle
  const displayTotalAmount = includeTax ? order.total : order.subtotal
  const displayTotalLabel = includeTax ? "Total (Inc. Tax)" : "Subtotal (Excl. Tax)"

  return (
    <div>
      <h2 className="text-base-semi">Order Summary</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex flex-col gap-y-1">
          {/* Keep these breakdowns as they are */}
          <div className="flex items-center justify-between">
            <span>Item Subtotal (excl. taxes)</span>
            <span>{getAmount(order.item_subtotal)}</span>
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
          {/* Adjust the label and value based on the toggle */}
          <span>{displayTotalLabel}</span>
          <span>{getAmount(displayTotalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
