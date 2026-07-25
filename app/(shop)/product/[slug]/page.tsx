import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductCard } from "@/components/product/product-card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      designer: true,
      category: true,
      images: true,
      variants: { include: { options: true } },
      reviews: { include: { user: { select: { name: true, image: true } } } },
      collections: { include: { collection: true } },
    },
  })

  if (!product) return null

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      id: { not: product.id },
      OR: [
        { designerId: product.designerId },
        { categoryId: product.categoryId },
      ],
    },
    include: { designer: true, images: true },
    take: 4,
  })

  return { product, relatedProducts }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const data = await getProduct((await params).slug)
  if (!data) return { title: "Product Not Found" }

  const { product } = data
  return {
    title: `${product.name} | ${product.designer?.name || "Maison Aurelle"}`,
    description: product.metaDesc || product.shortDesc || product.description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await getProduct((await params).slug)
  if (!data) notFound()

  const { product, relatedProducts } = data

  return (
    <div className="luxury-container py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-charcoal-500 hover:text-emerald transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      <Separator className="my-16" />

      {/* Description */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="font-serif text-2xl text-emerald mb-6">About This Piece</h2>
        <p className="text-charcoal-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <>
          <Separator className="mb-16" />
          <div>
            <h2 className="font-serif text-2xl text-emerald text-center mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
