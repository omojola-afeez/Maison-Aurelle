import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { PageForm } from "@/components/admin/page-form"

export default async function EditPagePage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const page = await prisma.page.findUnique({ where: { id: params.id } })
  if (!page) notFound()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Edit Page</h1>
        <p className="text-charcoal-500 mt-1">{page.title}</p>
      </div>
      <PageForm
        initialValues={{
          id: page.id,
          slug: page.slug,
          title: page.title,
          content: page.content,
          metaTitle: page.metaTitle ?? "",
          metaDesc: page.metaDesc ?? "",
          isPublished: page.isPublished,
        }}
      />
    </div>
  )
}
