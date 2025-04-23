import { listProducts } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import { TaxDisplayState } from "@/lib/hooks/use-tax-display"
import ProductPreview from "@/modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
  searchParams, // Add searchParams to read URL state
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  const taxDisplayState: TaxDisplayState = searchParams?.taxDisplay === 'included' 
    ? 'included' 
    : 'excluded';

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview
                product={product}
                region={region}
                isFeatured
                taxDisplayState={taxDisplayState} // Pass state down
              />
            </li>
          ))}
      </ul>
    </div>
  )
}
