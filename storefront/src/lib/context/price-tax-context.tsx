"use client"

import React, { createContext, useContext, useState, useMemo } from "react"

interface PriceTaxContextType {
  showWithTax: boolean
  toggleShowWithTax: () => void
}

const PriceTaxContext = createContext<PriceTaxContextType | null>(null)

export const PriceTaxProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // Default to showing prices WITHOUT tax initially
  const [showWithTax, setShowWithTax] = useState(false)

  const toggleShowWithTax = () => {
    setShowWithTax((prev) => !prev)
  }

  const value = useMemo(
    () => ({
      showWithTax,
      toggleShowWithTax,
    }),
    [showWithTax]
  )

  return (
    <PriceTaxContext.Provider value={value}>
      {children}
    </PriceTaxContext.Provider>
  )
}

export const usePriceTax = () => {
  const context = useContext(PriceTaxContext)
  if (context === null) {
    throw new Error("usePriceTax must be used within a PriceTaxProvider")
  }
  return context
}
