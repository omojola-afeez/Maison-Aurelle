import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ProductGrid } from "@/components/product/product-grid"
import { Separator } from "@/components/ui/separator"

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getCategoryData(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: true,
      parent: true,
    },
  })

  if (!category) return null

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { categoryId: category.id },
        { category: { parentId: category.id } },
      ],
    },
    include: {
      designer: true,
      images: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  })

  // Get filters
  const designers = await prisma.designer.findMany({
    where: { products: { some: { status: "ACTIVE" } } },
  })

  return { category, products, designers }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const data = await getCategoryData(params.slug)
  if (!data) return { title: "Category Not Found" }
  return {
    title: `${data.category.name} | Maison Aurelle`,
    description: data.category.metaDesc || `Shop ${data.category.name} at Maison Aurelle`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const data = await getCategoryData(params.slug)
  if (!data) notFound()

  const { category, products, designers } = data

  return (
    <div className="luxury-container py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">
          {category.parent?.name || "Shop"}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-emerald">{category.name}</h1>
        {category.description && (
          <p className="mt-4 text-charcoal-600 max-w-2xl mx-auto">{category.description}</p>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Filters & Products */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="space-y-8">
            {/* Designers */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal-600 mb-4">
                Designers
              </h3>
              <div className="space-y-2">
                {designers.map((designer) => (
                  <label key={designer.id} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-emerald" />
                    <span className="text-charcoal-600">{designer.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal-600 mb-4">
                Price Range
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Under $1,000", min: 0, max: 1000 },
                  { label: "$1,000 - $5,000", min: 1000, max: 5000 },
                  { label: "$5,000 - $10,000", min: 5000, max: 10000 },
                  { label: "Over $10,000", min: 10000, max: null },
                ].map((range) => (
                  <label key={range.label} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-emerald" />
                    <span className="text-charcoal-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal-600 mb-4">
                Sort By
              </h3>
              <select className="w-full border border-charcoal-200 p-3 text-sm bg-white">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <p className="text-sm text-charcoal-400 mb-6">{products.length} products</p>
          <ProductGrid products={products} columns={3} />
        </div>
      </div>
    </div>
  )
}
