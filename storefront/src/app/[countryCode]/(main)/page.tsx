import { listRegions } from "@/lib/data/regions"
import FeaturedProducts from "@/modules/home/components/featured-products"
import Hero from "@/modules/home/components/hero"
import SkeletonFeaturedProducts from "@/modules/skeletons/templates/skeleton-featured-products"
import { Metadata } from "next"
import { Suspense } from "react"
import { listCollections } from "@/lib/data/collections"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  return countryCodes?.map((countryCode) => ({ countryCode }))
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await listRegions().then((regions) =>
    regions?.find((r) =>
      r.countries?.map((c) => c.iso_2).includes(countryCode)
    )
  )

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6" data-testid="featured-products">
          <FeaturedProducts
            collections={collections}
            region={region}
            countryCode={countryCode}
          />
        </ul>
      </div>
    </>
  )
}
