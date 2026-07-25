"use client"

import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

// Prisma returns money fields (price, comparePrice) as a Decimal object,
// not a plain number. This accepts either shape and normalizes to a plain
// number below, so callers can pass raw Prisma results directly.
interface RawProduct {
  id: string
  slug: string
  name: string
  price: number | string | { toString(): string }
  comparePrice?: number | string | { toString(): string } | null
  images: { url: string; alt?: string | null; isPrimary: boolean }[]
  designer?: { name: string } | null
  featured?: boolean
  status?: string
}

interface ProductGridProps {
  products: RawProduct[]
  className?: string
  columns?: 2 | 3 | 4
  allWishlisted?: boolean
}

export function ProductGrid({ products, className, columns = 4, allWishlisted = false }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            price: Number(product.price),
            comparePrice: product.comparePrice != null ? Number(product.comparePrice) : null,
          }}
          initialWishlisted={allWishlisted}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  )
}
