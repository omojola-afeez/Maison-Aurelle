import prisma from "@/lib/prisma"
import { ProductGrid } from "@/components/product/product-grid"

export const metadata = {
  title: "New Arrivals | Maison Aurelle",
  description: "Discover the latest luxury fashion arrivals at Maison Aurelle.",
}

export default async function NewArrivalsPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { designer: true, images: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  })

  return (
    <div className="luxury-container py-8 md:py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">Just In</p>
        <h1 className="font-serif text-4xl md:text-5xl text-emerald">New Arrivals</h1>
        <p className="mt-4 text-charcoal-600 max-w-2xl mx-auto">
          The latest additions to our curated collection of luxury fashion.
        </p>
      </div>
      <ProductGrid products={products} columns={4} />
    </div>
  )
}
