import Link from "next/link"
import { requireAuth } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { ProductGrid } from "@/components/product/product-grid"

export const metadata = {
  title: "Wishlist | Maison Aurelle",
}

export default async function WishlistPage() {
  const user = await requireAuth()

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: {
      product: { include: { designer: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const products = wishlistItems.map((item) => item.product)

  return (
    <div className="luxury-container py-12 md:py-16">
      <h1 className="font-serif text-4xl text-emerald mb-2">Wishlist</h1>
      <p className="text-charcoal-500 mb-12">{products.length} saved item{products.length === 1 ? "" : "s"}</p>

      {products.length === 0 ? (
        <div className="bg-ivory-100 p-8 text-center">
          <p className="text-charcoal-500 mb-4">Nothing saved yet.</p>
          <Link href="/shop" className="text-emerald hover:underline text-sm">
            Browse the collection
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} columns={4} allWishlisted />
      )}
    </div>
  )
}
