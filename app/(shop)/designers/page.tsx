import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Designers | Maison Aurelle",
  description: "Explore the designers behind our curated luxury collection.",
}

export default async function DesignersPage() {
  const designers = await prisma.designer.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div className="luxury-container py-8 md:py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">The Houses</p>
        <h1 className="font-serif text-4xl md:text-5xl text-emerald">Designers</h1>
        <p className="mt-4 text-charcoal-600 max-w-2xl mx-auto">
          Every house we carry is authenticated and curated for craftsmanship and heritage.
        </p>
      </div>

      {designers.length === 0 ? (
        <p className="text-center text-charcoal-400">No designers listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designers.map((designer) => (
            <Link
              key={designer.id}
              href={`/category/${designer.slug}`}
              className="group relative aspect-[4/3] overflow-hidden bg-ivory-100"
            >
              {designer.image ? (
                <Image
                  src={designer.image}
                  alt={designer.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-2xl text-charcoal-300">{designer.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-emerald/0 group-hover:bg-emerald/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h2 className="font-serif text-2xl text-white drop-shadow">{designer.name}</h2>
                <p className="text-white/80 text-xs">{designer._count.products} pieces</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
