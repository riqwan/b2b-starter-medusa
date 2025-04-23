import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
  searchParams, // Add searchParams
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  searchParams?: { [key: string]: string | string[] | undefined } // Add type
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} searchParams={searchParams} />
    </li>
  ))
}
