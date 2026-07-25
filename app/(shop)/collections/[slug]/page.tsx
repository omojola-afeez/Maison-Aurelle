import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ProductGrid } from "@/components/product/product-grid"

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

async function getCollection(slug: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: {
            include: { designer: true, images: true },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!collection) return null

  const products = collection.products.map((cp) => cp.product)
  return { collection, products }
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const data = await getCollection((await params).slug)
  if (!data) return { title: "Collection Not Found" }
  return {
    title: `${data.collection.name} | Maison Aurelle`,
    description: data.collection.metaDesc || data.collection.description || undefined,
  }
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const data = await getCollection((await params).slug)
  if (!data) notFound()

  const { collection, products } = data

  return (
    <div className="luxury-container py-8 md:py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">Collection</p>
        <h1 className="font-serif text-4xl md:text-5xl text-emerald">{collection.name}</h1>
        {collection.description && (
          <p className="mt-4 text-charcoal-600 max-w-2xl mx-auto">{collection.description}</p>
        )}
      </div>
      <ProductGrid products={products} columns={4} />
    </div>
  )
}
