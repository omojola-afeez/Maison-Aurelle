import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminDeleteButton } from "@/components/admin/delete-button"
import { Plus, Pencil } from "lucide-react"

async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      designer: true,
      variants: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function AdminProductsPage() {
  await requireAdmin()
  const products = await getProducts()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-emerald">Products</h1>
          <p className="text-charcoal-500 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-ivory-50">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-charcoal-50 hover:bg-ivory-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ivory-200 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-charcoal-400">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-600">
                    {product.category?.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(Number(product.price))}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.variants.reduce((sum, v) => sum + v.inventory, 0)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs uppercase tracking-wider font-medium ${
                        product.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : product.status === "DRAFT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-charcoal-100 text-charcoal-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 hover:text-emerald transition-colors inline-block"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <AdminDeleteButton
                        url={`/api/admin/products/${product.id}`}
                        confirmMessage="Click again to delete this product"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
