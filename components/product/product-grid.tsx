"use client"

import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: Parameters<typeof ProductCard>[0]["product"][]
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
          product={product}
          initialWishlisted={allWishlisted}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  )
}
