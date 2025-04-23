"use client"

import { usePriceTax } from "@/lib/context/price-tax-context"
import { Label, Switch, Text } from "@medusajs/ui"

const TaxDisplayToggle = () => {
  const { showPricesWithTax, toggleShowPricesWithTax } = usePriceTax()

  return (
    <div className="flex items-center gap-x-2">
       <Text className="text-sm">Prices incl. Tax</Text>
      <Switch
        id="tax-toggle"
        checked={showPricesWithTax}
        onCheckedChange={toggleShowPricesWithTax}
        data-testid="tax-display-toggle"
      />
    </div>
  )
}

export default TaxDisplayToggle
