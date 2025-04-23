"use client"

import { useSearchParams } from "next/navigation"

export type TaxDisplayState = "included" | "excluded"

export function useTaxDisplay(): TaxDisplayState {
  const searchParams = useSearchParams()
  const taxDisplay = searchParams.get("taxDisplay")

  if (taxDisplay === "included") {
    return "included"
  }
  // Default to excluded if param is missing or invalid
  return "excluded" 
}

// Helper to create the new URL string
export function createUrlWithTaxDisplay(pathname: string, currentParams: URLSearchParams, newState: TaxDisplayState): string {
  const newParams = new URLSearchParams(currentParams.toString())
  newParams.set("taxDisplay", newState)
  return `${pathname}?${newParams.toString()}`
}