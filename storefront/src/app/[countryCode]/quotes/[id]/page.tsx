import { fetchQuote, fetchQuotePreview } from "@/lib/data/quotes"
import { notFound } from "next/navigation"
import QuoteDetails from "@/app/[countryCode]/(main)/account/@dashboard/quotes/components/quote-details" // Re-use existing component for now
import { getGuestId } from "@/lib/data/guest"
import { sdk } from "@/lib/config" // Import sdk
import { StoreQuoteResponse, StoreQuotePreviewResponse } from "@/types" // Import types

type Props = {
  params: { id: string; countryCode: string }
  searchParams: { guest_id?: string }
}

// This page needs to fetch data using the guest_id from searchParams
// It cannot rely on authentication context.

export default async function GuestQuoteDetailsPage({ params, searchParams }: Props) {
  const quoteId = params.id;
  const guestId = searchParams.guest_id; // Get guest_id from URL

  // Validate guest_id presence
  if (!guestId) {
      // Or redirect to a login/error page
      return notFound();
  }

  // Fetch quote using the modified fetchQuote which should include guest_id param
  // Note: fetchQuote needs access to guestId, which might require passing it explicitly
  // or modifying how getGuestId works if called server-side.
  // Assuming fetchQuote is adapted to read guestId from its context or params.
  // For server components, passing it explicitly is safer.

  // We need to adapt fetchQuote and fetchQuotePreview to accept guestId
  // For now, let's assume they are adapted or we call a modified version.
  // Let's simulate passing it for now:

  const fetchQuoteAdapted = async (id: string, guestIdParam: string) => {
      // In a real scenario, fetchQuote would be modified to handle this
      // For now, simulate the logic:
      const headers = {}; // No auth headers
      const next = {}; // Cache options if needed
      // Construct the URL carefully, ensuring guest_id is appended correctly
      const url = `/store/quotes/${id}?guest_id=${guestIdParam}`;
      return sdk.client.fetch<StoreQuoteResponse>(url, {
          method: "GET",
          headers,
          next,
      });
  }

   const fetchQuotePreviewAdapted = async (id: string, guestIdParam: string) => {
      // Preview might still need auth depending on implementation.
      // Assuming guest access is allowed for preview too for this example.
      const headers = {}; // No auth headers
      const next = {}; // Cache options if needed
      // Construct the URL carefully
      const url = `/store/quotes/${id}/preview?guest_id=${guestIdParam}`;
      return sdk.client.fetch<StoreQuotePreviewResponse>(url, {
          method: "GET",
          headers,
          next,
      });
  }


  try {
    const { quote } = await fetchQuoteAdapted(quoteId, guestId);
    // Ensure quote.order_preview exists before accessing it
    const previewResponse = await fetchQuotePreviewAdapted(quoteId, guestId);
    const quotePreview = previewResponse?.quote?.order_preview;

    if (!quote || !quotePreview) {
      notFound();
    }

    // Render the details - might need adjustments in QuoteDetails if it assumes logged-in user
    return (
        <div className="content-container py-6">
             {/* Add breadcrumbs or minimal layout for guest view */}
            <QuoteDetails
                quote={quote} // Pass fetched quote
                preview={quotePreview} // Pass fetched preview
                countryCode={params.countryCode}
                // Indicate it's a guest view if needed by the component
                isGuestView={true}
            />
        </div>
    );
  } catch (error) {
      console.error("Failed to fetch guest quote:", error);
      notFound(); // Show not found on error
  }
}
