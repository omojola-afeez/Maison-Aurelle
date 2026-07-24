import { requireAdmin } from "@/lib/auth-helpers"
import { PageForm } from "@/components/admin/page-form"

export default async function NewPagePage() {
  await requireAdmin()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">New Page</h1>
        <p className="text-charcoal-500 mt-1">Create a new content page</p>
      </div>
      <PageForm />
    </div>
  )
}
