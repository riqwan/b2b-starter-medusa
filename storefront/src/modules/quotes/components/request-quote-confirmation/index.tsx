"use client" // Add use client directive

import { createQuote } from "@/lib/data/quotes"
import { XCircle } from "@medusajs/icons"
import { toast } from "@medusajs/ui"
import Button from "@/modules/common/components/button"
import * as Dialog from "@radix-ui/react-dialog"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react" // Import useEffect
import { useCart } from "@/lib/context/cart-context" // Import useCart

export const RequestQuoteConfirmation = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [requesting, setRequesting] = useState(false)
  const { countryCode } = useParams()
  const { cart } = useCart() // Get cart from context
  const router = useRouter()

  // Check if cart has email before allowing quote request
  const canRequestQuote = !!cart?.email;

  const handleCreateQuoteRequest = async () => {
    setRequesting(true)

    if (!canRequestQuote) {
      toast.error("Please add an email to your cart before requesting a quote.");
      setRequesting(false);
      // Optionally, redirect to a page where email can be added, e.g., checkout contact step
      // router.push(`/${countryCode}/checkout?step=contact`);
      return;
    }

    try {
      const { quote, guest_id } = await createQuote() // Destructure guest_id if returned

      // Redirect to guest or account page based on guest_id presence
      const redirectPath = guest_id
        ? `/${countryCode}/quotes/${quote.id}?guest_id=${guest_id}`
        : `/${countryCode}/account/quotes/details/${quote.id}`;
      router.push(redirectPath);
    } catch (error: any) { // Add type annotation for error
      setRequesting(false)
      toast.error(error.message || "Failed to create quote request")
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-[75]" />
        <Dialog.Content className="z-[100] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-lg mb-6 flex justify-between items-center">
            Submit request for quote
            <Dialog.Close asChild>
              <XCircle className="text-violet11 hover:bg-violet4 focus:shadow-violet7 inline-flex appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] outline-none cursor-pointer" />
            </Dialog.Close>
          </Dialog.Title>

          <div className="flex flex-col gap-y-4">
            <p>
              You are about to request a quote for the cart. If you confirm, the
              cart will be converted to a quote.
            </p>
          </div>

          <div className="mt-[25px] flex justify-end gap-x-2">
            <Dialog.Close asChild>
              <Button variant="secondary" disabled={requesting}>
                Cancel
              </Button>
            </Dialog.Close>

            <Button
              onClick={handleCreateQuoteRequest}
              isLoading={requesting}
              disabled={!canRequestQuote && !requesting} // Disable if email missing
            >
              Submit
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
