import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/product-card"
import prisma from "@/lib/prisma"
import { ArrowRight, Truck, Shield, RotateCcw } from "lucide-react"

async function getHomepageData() {
  const [featuredProducts, newArrivals, bestSellers, collections] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, status: "ACTIVE" },
      include: { designer: true, images: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { designer: true, images: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { designer: true, images: true, reviews: true },
      take: 4,
    }),
    prisma.collection.findMany({
      where: { featured: true },
      take: 3,
    }),
  ])

  return { featuredProducts, newArrivals, bestSellers, collections }
}

export default async function HomePage() {
  const { featuredProducts, newArrivals, bestSellers, collections } = await getHomepageData()

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] max-h-[1000px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920&q=80"
            alt="Luxury handbag collection"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/90 via-ivory/50 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="luxury-container">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-6">
                Spring / Summer 2026
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-emerald leading-[1.05] mb-6">
                The Art of<br />
                <span className="italic">Timeless</span><br />
                Elegance
              </h1>
              <p className="text-charcoal-600 text-base md:text-lg leading-relaxed mb-10 max-w-md">
                Discover our curated collection of the world's most coveted luxury bags, 
                shoes, and accessories. Each piece tells a story of craftsmanship and heritage.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/new-arrivals">Shop New Arrivals</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/collections">Explore Collections</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-8 bg-white border-y border-charcoal-100 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {["Hermès", "Chanel", "Louis Vuitton", "Gucci", "Prada", "Dior", "Saint Laurent", "Bottega Veneta", "Celine", "Fendi", "Valentino", "Balenciaga"].map((brand) => (
            <span key={brand} className="mx-12 text-2xl font-serif text-charcoal-300">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="luxury-section">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">Curated For You</p>
            <h2 className="font-serif text-4xl md:text-5xl text-emerald">Featured Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <Image
                  src={collection.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-emerald/40 transition-opacity group-hover:opacity-30" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2">Collection</p>
                  <h3 className="font-serif text-3xl text-white mb-4">{collection.name}</h3>
                  <span className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-[0.1em] border border-white px-6 py-3 w-fit hover:bg-white hover:text-emerald transition-colors">
                    Discover <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="luxury-section bg-white">
        <div className="luxury-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">Just In</p>
              <h2 className="font-serif text-4xl md:text-5xl text-emerald">New Arrivals</h2>
            </div>
            <Link
              href="/new-arrivals"
              className="mt-4 md:mt-0 text-sm uppercase tracking-[0.15em] text-charcoal-600 hover:text-emerald transition-colors flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="Maison Aurelle Boutique"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-emerald/80" />
        </div>
        <div className="relative z-10 luxury-container text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-6">Since 2019</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 max-w-3xl mx-auto">
            Where Heritage Meets<br /><span className="italic">Modern Luxury</span>
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Every piece in our collection is authenticated by our team of experts and comes 
            with a certificate of authenticity, ensuring your investment is protected.
          </p>
          <Button variant="secondary" className="text-white border-white hover:bg-white hover:text-emerald" asChild>
            <Link href="/authenticity">Our Authentication Process</Link>
          </Button>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="luxury-section">
        <div className="luxury-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">Most Loved</p>
              <h2 className="font-serif text-4xl md:text-5xl text-emerald">Best Sellers</h2>
            </div>
            <Link
              href="/best-sellers"
              className="mt-4 md:mt-0 text-sm uppercase tracking-[0.15em] text-charcoal-600 hover:text-emerald transition-colors flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-t border-charcoal-100">
        <div className="luxury-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Truck className="w-8 h-8 mx-auto mb-4 text-emerald" />
              <h3 className="font-serif text-lg mb-2">Complimentary Shipping</h3>
              <p className="text-sm text-charcoal-500">Free delivery on all orders over $500</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-4 text-emerald" />
              <h3 className="font-serif text-lg mb-2">Authenticity Guaranteed</h3>
              <p className="text-sm text-charcoal-500">Every item verified by our experts</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-8 h-8 mx-auto mb-4 text-emerald" />
              <h3 className="font-serif text-lg mb-2">Hassle-Free Returns</h3>
              <p className="text-sm text-charcoal-500">30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
