"use client"; // Add this directive

import { clx, Text } from "@medusajs/ui"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useTaxDisplay } from "@/lib/context/tax-display-context" // Import the context hook
import { convertToLocale } from "@/lib/util/money" // Import money util
import { useMemo } from "react"; // Import useMemo

export default function ProductPrice({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { showWithTax } = useTaxDisplay(); // Consume the context

  // We need the raw variant data to access tax-inclusive/exclusive prices
  // getProductPrice currently returns formatted strings. Let's get the raw data.
  const cheapestVariant = useMemo(() => {
    if (!product || !product.variants?.length) {
      return null
    }
    // Find the variant with the cheapest calculated price
    return product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        )
      })[0]
  }, [product]);

  const cheapestPriceData = cheapestVariant?.calculated_price;

  if (!cheapestPriceData) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const displayAmount = showWithTax
    ? cheapestPriceData.calculated_amount_with_tax
    : cheapestPriceData.calculated_amount_without_tax;

  // Handle cases where tax-specific amounts might be null/undefined
  const finalDisplayAmount = displayAmount ?? cheapestPriceData.calculated_amount;

  const formattedDisplayPrice = convertToLocale({
    amount: finalDisplayAmount,
    currency_code: cheapestPriceData.currency_code,
  });

  const formattedOriginalPrice = convertToLocale({
    amount: cheapestPriceData.original_amount,
    currency_code: cheapestPriceData.currency_code,
  });

  const isSale = cheapestPriceData.price_type === "sale";

  return (
    <div className="flex flex-col text-neutral-950">
      <span
        className={clx({
          "text-ui-fg-interactive": isSale,
        })}
      >
        <Text
          className="font-medium text-xl"
          data-testid="product-price"
          data-value={finalDisplayAmount}
        >
          From {formattedDisplayPrice}
        </Text>
        <Text className="text-neutral-600 text-[0.6rem]">
          {showWithTax ? "Incl. Tax" : "Excl. Tax"}
        </Text>
      </span>
      {isSale && (
        <p
          className="line-through text-neutral-500"
          data-testid="original-product-price"
          data-value={cheapestPriceData.original_amount}
        >
          {formattedOriginalPrice}
        </p>
      )}
    </div>
  )
}
