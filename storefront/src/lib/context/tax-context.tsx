"use client"

import React, { createContext, useContext, useState, useMemo, PropsWithChildren } from "react"

type TaxContextType = {
  includeTax: boolean
  toggleTaxInclusion: () => void
}

const TaxContext = createContext<TaxContextType | undefined>(undefined)

export const TaxProvider = ({ children }: PropsWithChildren<{}>) => {
  const [includeTax, setIncludeTax] = useState<boolean>(false) // Default to excluding tax

  const toggleTaxInclusion = () => {
    setIncludeTax((prev) => !prev)
  }

  const value = useMemo(() => ({
    includeTax,
    toggleTaxInclusion,
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
