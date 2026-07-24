import prisma from "@/lib/prisma"
import { ProductGrid } from "@/components/product/product-grid"

export const metadata = {
  title: "Shop All | Maison Aurelle",
  description: "Browse the full Maison Aurelle collection of luxury bags, shoes, and accessories.",
}

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { designer: true, images: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="luxury-container py-8 md:py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">Everything</p>
        <h1 className="font-serif text-4xl md:text-5xl text-emerald">Shop All</h1>
        <p className="mt-4 text-charcoal-600 max-w-2xl mx-auto">
          The full Maison Aurelle collection, in one place.
        </p>
      </div>
      <ProductGrid products={products} columns={4} />
    </div>
  )
}
