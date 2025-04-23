"use client"

import { usePriceTax } from "@/lib/context/price-tax-context"
import { Label, Switch, Text } from "@medusajs/ui"

const TaxToggle = () => {
  const { showWithTax, toggleShowWithTax } = usePriceTax()

  return (
    <div className="flex items-center gap-x-2">
      <Label htmlFor="tax-toggle" className="text-sm text-ui-fg-subtle">
        Prices incl. Tax
      </Label>
      <Switch
        id="tax-toggle"
        checked={showWithTax}
        onCheckedChange={toggleShowWithTax}
        data-testid="tax-toggle"
      />
    </div>
  )
}

export default TaxToggle
