"use client"

import { usePriceDisplay } from "@/lib/context/price-display-context"
import { Switch, Label, clx } from "@medusajs/ui"

const TaxToggleSwitch = () => {
  const { showWithTax, toggleShowWithTax } = usePriceDisplay()

  return (
    <div className="flex items-center gap-x-2">
      <Label htmlFor="tax-toggle" className="text-sm text-ui-fg-subtle">
        {showWithTax ? "Price incl. Tax" : "Price excl. Tax"}
      </Label>
      <Switch
        id="tax-toggle"
        checked={showWithTax}
        onCheckedChange={toggleShowWithTax}
        data-testid="tax-toggle-switch"
      />
    </div>
  )
}

export default TaxToggleSwitch
