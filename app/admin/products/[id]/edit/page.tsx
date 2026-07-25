import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const [product, categories, designers] = await Promise.all([
    prisma.product.findUnique({
      where: { id: (await params).id },
      include: { variants: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.designer.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Edit Product</h1>
        <p className="text-charcoal-500 mt-1">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        designers={designers}
        initialValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDesc: product.shortDesc ?? "",
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          sku: product.sku,
          status: product.status,
          featured: product.featured,
          categoryId: product.categoryId,
          designerId: product.designerId,
          inventory: product.variants.reduce((sum, v) => sum + v.inventory, 0),
        }}
      />
    </div>
  )
}
