"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface ProductGalleryProps {
  images: {
    id: string
    url: string
    alt?: string | null
    position: number
    isPrimary: boolean
  }[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const sortedImages = [...images].sort((a, b) => a.position - b.position)
  const selectedImage = sortedImages[selectedIndex] || sortedImages[0]

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % sortedImages.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-ivory-200 overflow-hidden group">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={selectedImage.alt || productName}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            )}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={selectedImage.isPrimary}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-charcoal-100">
            <span className="text-charcoal-300">No image available</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm">
            <ZoomIn className="w-4 h-4" />
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm text-xs">
          {selectedIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                setSelectedIndex(index)
                setIsZoomed(false)
              }}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 border-2 transition-colors overflow-hidden",
                selectedIndex === index
                  ? "border-emerald"
                  : "border-transparent hover:border-charcoal-300"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} - view ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
