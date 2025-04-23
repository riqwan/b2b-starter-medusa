import { formatAmountWithTaxToggle, convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useTaxDisplay } from "@/lib/hooks/use-tax-display"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const taxDisplayState = useTaxDisplay()

  const getAmount = (amount?: number | null, lineType?: string) => {
    if (!amount) {
      return
    }

    // For individual lines like shipping/tax, display based on toggle, but tax itself is always shown as its value
    const displayTaxItself = lineType === 'tax_line'; // Check if called for the tax line specifically
    return formatAmountWithTaxToggle({
      amount,
      currency_code: order.currency_code,
      tax_amount: displayTaxItself ? 0 : order.tax_total ?? 0, // Only add tax if not the tax line itself
      taxDisplayState: displayTaxItself ? 'excluded' : taxDisplayState,
    })
  }

  return (
    <div>
      <h2 className="text-base-semi">Order Summary</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>Subtotal</span>
          {/* Subtotal should reflect tax toggle state */} 
          <span>{formatAmountWithTaxToggle({ amount: order.subtotal ?? 0, currency_code: order.currency_code, tax_amount: order.tax_total ?? 0, taxDisplayState })}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Taxes</span>
            <span>{getAmount(order.tax_total, 'tax_line')}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>Total</span>
          <span>
            {/* Base total is total minus tax */}
            {formatAmountWithTaxToggle({
              amount: (order.total ?? 0) - (order.tax_total ?? 0),
              currency_code: order.currency_code,
              tax_amount: order.tax_total ?? 0,
              taxDisplayState,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
