import { getBaseURL } from "@/lib/util/env"
import { Toaster } from "@medusajs/ui"
import { Analytics } from "@vercel/analytics/next"
import { PriceTaxProvider } from "@/lib/context/price-tax-context" // Import the provider
import { GeistSans } from "geist/font/sans"
import { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={GeistSans.variable}>
      <PriceTaxProvider> {/* Wrap with the provider */}
        <body>
          <main className="relative">{props.children}</main>
          <Toaster className="z-[99999]" position="bottom-left" />
        </body>
        <Analytics />
      </PriceTaxProvider>
    </html>
  )
}
