import { isEmpty } from "@/lib/util/isEmpty"
import { TaxDisplayState } from "@/lib/hooks/use-tax-display" // Import the state type

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

type FormatAmountWithTaxToggleParams = {
  amount: number // Base amount (exclusive of tax)
  currency_code: string
  tax_rate?: number // Optional: Tax rate (e.g., 0.2 for 20%)
  tax_amount?: number // Optional: Pre-calculated tax amount
  taxDisplayState: TaxDisplayState
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const formatAmountWithTaxToggle = ({
  amount,
  currency_code,
  tax_rate,
  tax_amount,
  taxDisplayState,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: FormatAmountWithTaxToggleParams) => {
  let displayAmount = amount

  if (taxDisplayState === "included") {
    if (tax_amount !== undefined) {
      displayAmount += tax_amount
    } else if (tax_rate !== undefined) {
      displayAmount = amount * (1 + tax_rate)
    } // If neither is provided, display base amount
  }

  return convertToLocale({
    amount: displayAmount,
    currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
    locale,
  })
}
