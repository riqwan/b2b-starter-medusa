"use client"

import React, { createContext, useContext, useState, useMemo, PropsWithChildren } from "react"

interface PriceTaxContextType {
  showPricesWithTax: boolean
  toggleShowPricesWithTax: () => void
}

const PriceTaxContext = createContext<PriceTaxContextType | undefined>(undefined)

export const PriceTaxProvider = ({ children }: PropsWithChildren<{}>) => {
  // Default to showing prices WITHOUT tax initially
  const [showPricesWithTax, setShowPricesWithTax] = useState(false)

  const toggleShowPricesWithTax = () => {
    setShowPricesWithTax((prev) => !prev)
  }

  const contextValue = useMemo(() => ({
    showPricesWithTax,
    toggleShowPricesWithTax,
  }), [showPricesWithTax])

  return (
    <PriceTaxContext.Provider value={contextValue}>
      {children}
    </PriceTaxContext.Provider>
  )
}

export const usePriceTax = () => {
  const context = useContext(PriceTaxContext)
  if (context === undefined) {
    throw new Error("usePriceTax must be used within a PriceTaxProvider")
  }
  return context
}
