import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Collections | Maison Aurelle",
  description: "Explore our curated luxury fashion collections.",
}

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
  })

  return (
    <div className="luxury-container py-8 md:py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne mb-4">Curated For You</p>
        <h1 className="font-serif text-4xl md:text-5xl text-emerald">Collections</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src={collection.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-emerald/50 transition-opacity group-hover:opacity-40" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h2 className="font-serif text-2xl text-white mb-2">{collection.name}</h2>
              {collection.description && (
                <p className="text-white/80 text-sm mb-4 line-clamp-2">{collection.description}</p>
              )}
              <span className="inline-flex items-center gap-2 text-white text-xs uppercase tracking-[0.1em]">
                Explore <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
