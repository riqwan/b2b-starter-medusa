"use client"; // Add this directive

import { Text, clx } from "@medusajs/ui";
import { useTaxDisplay } from "@/lib/context/tax-display-context"; // Import the context hook
import { convertToLocale } from "@/lib/util/money"; // Import money util
import { HttpTypes } from "@medusajs/types"; // Import types

// Define a more complete type for the price object expected here,
// including the tax-specific fields if available.
// This assumes the upstream component fetches the necessary data.
type CalculatedPrice = HttpTypes.StoreCalculatedPriceSet;

export default function PreviewPrice({ price }: { price: CalculatedPrice }) {
  const { showWithTax } = useTaxDisplay(); // Consume the context

  if (!price) {
    return null;
  }

  const displayAmount = showWithTax
    ? price.calculated_amount_with_tax
    : price.calculated_amount_without_tax;

  // Handle cases where tax-specific amounts might be null/undefined
  const finalDisplayAmount = displayAmount ?? price.calculated_amount;

  const formattedDisplayPrice = convertToLocale({
    amount: finalDisplayAmount,
    currency_code: price.currency_code,
  });

  const formattedOriginalPrice = convertToLocale({
    amount: price.original_amount,
    currency_code: price.currency_code,
  });

  const isSale = price.price_type === "sale";

  return (
    <>
      {isSale && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {formattedOriginalPrice}
        </Text>
      )}
      <Text
        className={clx("text-neutral-950 font-medium text-lg", {
          "text-ui-fg-interactive": isSale,
        })}
        data-testid="price"
      >
        {formattedDisplayPrice}
      </Text>
    </>
  );
}
