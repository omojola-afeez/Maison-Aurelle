import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import type { Metadata } from "next"

async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || undefined,
  }
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page || !page.isPublished) {
    notFound()
  }

  return (
    <div className="luxury-container py-16 max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl text-emerald mb-8">{page.title}</h1>
      <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-charcoal-600 leading-relaxed">
        {page.content}
      </div>
    </div>
  )
}
