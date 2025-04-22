"use client"

import { useTax } from "@/lib/context/tax-context" // Import useTax
import { convertToLocale } from "@/lib/util/money"
import Divider from "@/modules/common/components/divider"
import { B2BCart, B2BOrder } from "@/types"
import { Text } from "@medusajs/ui"
import React from "react"

const CheckoutTotals: React.FC<{
  cartOrOrder: B2BCart | B2BOrder
}> = ({ cartOrOrder }) => {
  const { includeTax } = useTax() // Use the tax context

  if (!cartOrOrder) return null

  const {
    currency_code,
    total, // Tax-inclusive total
    item_subtotal, // Tax-exclusive item subtotal
    tax_total,
    shipping_total,
    discount_total,
    gift_card_total,
  } = cartOrOrder

  // Determine the final total to display based on the toggle
  const displayTotal = includeTax
    ? total
    : (item_subtotal ?? 0) +
      (shipping_total ?? 0) -
      (discount_total ?? 0) -
      (gift_card_total ?? 0)

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        {/* Keep these breakdowns as they are */}
        <div className="flex items-center justify-between">
          <Text className="flex gap-x-1 items-center">
            Subtotal (excl. shipping and taxes)
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
        {/* Adjust the label based on the toggle */}
        <Text className="font-medium">Total {includeTax ? "(Inc. Tax)" : "(Excl. Tax)"}</Text>
        <Text
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={displayTotal || 0}
        >
          {/* Display the calculated total based on the toggle */}
          {convertToLocale({ amount: displayTotal ?? 0, currency_code })}
        </Text>
      </div>
    </div>
  )
}

export default CheckoutTotals
