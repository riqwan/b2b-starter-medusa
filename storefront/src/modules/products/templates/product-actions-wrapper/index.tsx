import { getProductsById } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@/modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  countryCode, // Add countryCode prop
}: {
  id: string
  region: HttpTypes.StoreRegion
  countryCode: string // Add countryCode prop type
}) {
  const products = await getProductsById({
    ids: [id],
    regionId: region.id,
    countryCode: countryCode, // Pass countryCode
  })

  if (!products || products.length === 0) {
    return null
  }

  return <ProductActions product={products[0]} region={region} />
}
