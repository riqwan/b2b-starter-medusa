"use client"

import React from "react"
import { Switch, Label } from "@medusajs/ui"
import { useTax } from "@/lib/context/tax-context"

const TaxToggle = () => {
  const { includeTax, toggleTaxInclusion } = useTax()

  return (
    <div className="flex items-center gap-x-2">
      <Label htmlFor="tax-toggle" className="text-sm text-ui-fg-subtle whitespace-nowrap">
        {includeTax ? "Incl. Tax" : "Excl. Tax"}
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

export default TaxToggle
