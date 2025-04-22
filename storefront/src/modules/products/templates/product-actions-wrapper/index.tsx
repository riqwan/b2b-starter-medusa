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
  countryCode: string // Add countryCode type
}) {
  const [product] = await getProductsById({
    ids: [id],
    regionId: region.id,
    countryCode: countryCode, // Pass countryCode here
  })

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} />
}
