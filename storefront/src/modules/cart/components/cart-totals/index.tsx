"use client"

import { useCart } from "@/lib/context/cart-context"
import { useTax } from "@/lib/context/tax-context" // Import useTax
import { convertToLocale } from "@/lib/util/money"
import Divider from "@/modules/common/components/divider"
import { Text } from "@medusajs/ui"
import React from "react"

const CartTotals: React.FC = () => {
  const { isUpdatingCart, cart } = useCart()
  const { includeTax } = useTax() // Use the tax context

  if (!cart) return null

  const {
    currency_code,
    total, // Tax-inclusive total
    subtotal, // Tax-exclusive item subtotal
    item_subtotal, // Keep for explicit item subtotal display
    tax_total,
    shipping_total,
    discount_total,
    gift_card_total,
  } = cart

  // Determine the final total and label to display based on the toggle
  const displayTotalAmount = includeTax ? total : subtotal
  const displayTotalLabel = includeTax ? "Total (Inc. Tax)" : "Subtotal (Excl. Tax)"

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        {/* Keep these breakdowns as they are */}
        <div className="flex items-center justify-between">
          <Text className="flex gap-x-1 items-center">
            Item Subtotal (excl. taxes)
          </Text>
          <Text
            data-testid="cart-item-subtotal"
            data-value={item_subtotal || 0}
          >
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </Text>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <Text>Discount</Text>
            <Text
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </Text>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Text>Shipping</Text>
          <Text data-testid="cart-shipping" data-value={shipping_total || 0}>
            {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text className="flex gap-x-1 items-center ">Taxes</Text>
          <Text data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </Text>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <Text>Gift card</Text>
            <Text
              className="text-ui-fg-interactive"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </Text>
          </div>
        )}
      </div>
      <Divider className="my-2" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        {/* Adjust the label and value based on the toggle */}
        <Text className="font-medium">{displayTotalLabel}</Text>
        {isUpdatingCart ? (
          <div className="w-28 h-6 mt-[3px] bg-neutral-200 rounded-full animate-pulse" />
        ) : (
          <Text
            className="txt-xlarge-plus"
            data-testid="cart-total"
            data-value={displayTotalAmount || 0}
          >
            {convertToLocale({ amount: displayTotalAmount ?? 0, currency_code })}
          </Text>
        )}
      </div>
    </div>
  )
}

export default CartTotals
