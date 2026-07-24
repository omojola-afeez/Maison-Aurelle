import Link from "next/link"
import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AdminDeleteButton } from "@/components/admin/delete-button"
import { Plus, Pencil } from "lucide-react"

export default async function AdminCMSPage() {
  await requireAdmin()
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-emerald">Content Pages</h1>
          <p className="text-charcoal-500 mt-1">
            Manage static pages like Our Story, FAQs, and policies
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/new">
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-ivory-50">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Title</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Slug</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Updated</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-charcoal-400">
                    No pages yet. Create your first one.
                  </td>
                </tr>
              )}
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-charcoal-50 hover:bg-ivory-50">
                  <td className="px-6 py-4 text-sm font-medium">{page.title}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-500">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs uppercase tracking-wider font-medium ${
                        page.isPublished ? "bg-green-100 text-green-800" : "bg-charcoal-100 text-charcoal-600"
                      }`}
                    >
                      {page.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-400">{formatDate(page.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/cms/${page.id}/edit`} className="p-2 hover:text-emerald transition-colors inline-block">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <AdminDeleteButton
                        url={`/api/admin/pages/${page.id}`}
                        confirmMessage="Click again to delete this page"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
