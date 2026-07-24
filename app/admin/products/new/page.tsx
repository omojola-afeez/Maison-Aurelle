import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  await requireAdmin()
  const [categories, designers] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.designer.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Add Product</h1>
        <p className="text-charcoal-500 mt-1">Create a new product listing</p>
      </div>
      <ProductForm categories={categories} designers={designers} />
    </div>
  )
}
