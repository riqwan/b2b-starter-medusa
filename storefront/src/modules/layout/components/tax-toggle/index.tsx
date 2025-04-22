"use client"

import { useTax } from "@/lib/context/tax-context"
import { Label, Switch, Text } from "@medusajs/ui"

export default function TaxToggle() {
  const { includeTax, toggleTaxInclusion } = useTax()

  return (
    <div className="flex items-center gap-x-2">
      <Label htmlFor="tax-toggle" className="text-sm text-neutral-700">
        Prices {includeTax ? "Inc." : "Excl."} Tax
      </Label>
      <Switch
        id="tax-toggle"
        checked={includeTax}
        onCheckedChange={toggleTaxInclusion}
        data-testid="tax-toggle"
      />
    </div>
  )
}
