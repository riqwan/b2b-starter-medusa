"use client"

import { useState, useCallback } from "react"

// Define the shape of the hook's return value
export type TaxToggleState = {
  showTaxes: boolean
  toggleTaxView: () => void
  setShowTaxesExplicitly: (show: boolean) => void
}

// The custom hook
const useTaxToggle = (): TaxToggleState => {
  // Initialize state, defaulting to showing prices *without* tax
  const [showTaxes, setShowTaxes] = useState<boolean>(false)

  // Function to toggle the state
  const toggleTaxView = useCallback(() => {
    setShowTaxes((prev) => !prev)
  }, [])

  // Function to set the state explicitly (e.g., based on user preferences later)
  const setShowTaxesExplicitly = useCallback((show: boolean) => {
    setShowTaxes(show)
  }, [])

  return {
    showTaxes,
    toggleTaxView,
    setShowTaxesExplicitly,
  }
}

export default useTaxToggle
