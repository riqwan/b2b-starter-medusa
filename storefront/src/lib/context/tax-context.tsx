"use client"

import React, { createContext, useContext, useState, useMemo, PropsWithChildren } from "react"

interface TaxContextProps {
  includeTax: boolean
  toggleTaxInclusion: () => void
  setTaxInclusion: (value: boolean) => void // Add setter function type
}

const TaxContext = createContext<TaxContextProps | undefined>(undefined)

export const TaxProvider = ({ children }: PropsWithChildren<{}>) => {
  // Default to showing prices *without* tax initially
  const [includeTax, setIncludeTax] = useState<boolean>(false)

  const toggleTaxInclusion = () => {
    setIncludeTax((prev) => !prev)
  }

  // Implement the setter function
  const setTaxInclusionDirectly = (value: boolean) => {
    setIncludeTax(value)
  }

  const value = useMemo(() => ({
    includeTax,
    toggleTaxInclusion,
    setTaxInclusion: setTaxInclusionDirectly, // Expose the setter
  }), [includeTax])

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>
}

export const useTax = () => {
  const context = useContext(TaxContext)
  if (context === undefined) {
    throw new Error("useTax must be used within a TaxProvider")
  }
  return context
}
