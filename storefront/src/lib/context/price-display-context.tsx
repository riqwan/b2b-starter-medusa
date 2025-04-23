"use client"

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react"

type PriceDisplayContextType = {
  showWithTax: boolean
  toggleShowWithTax: () => void
}

const PriceDisplayContext = createContext<PriceDisplayContextType | undefined>(
  undefined
)

export const PriceDisplayProvider = ({ children }: { children: ReactNode }) => {
  const [showWithTax, setShowWithTax] = useState(false) // Default to showing prices WITHOUT tax

  const toggleShowWithTax = () => {
    setShowWithTax((prev) => !prev)
  }

  const contextValue = useMemo(() => {
    return { showWithTax, toggleShowWithTax }
  }, [showWithTax])

  return (
    <PriceDisplayContext.Provider value={contextValue}>
      {children}
    </PriceDisplayContext.Provider>
  )
}

export const usePriceDisplay = () => {
  const context = useContext(PriceDisplayContext)
  if (context === undefined) {
    throw new Error(
      "usePriceDisplay must be used within a PriceDisplayProvider"
    )
  }
  return context
}
