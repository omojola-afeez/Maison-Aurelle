import Link from "next/link"
import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AdminDeleteButton } from "@/components/admin/delete-button"
import { Plus, Pencil } from "lucide-react"

export default async function AdminMarketingPage() {
  await requireAdmin()
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-emerald">Marketing</h1>
          <p className="text-charcoal-500 mt-1">Manage discount codes</p>
        </div>
        <Button asChild>
          <Link href="/admin/marketing/new">
            <Plus className="w-4 h-4 mr-2" />
            New Coupon
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-ivory-50">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Code</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Discount</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Used</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Expires</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-charcoal-400">
                    No coupons yet.
                  </td>
                </tr>
              )}
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-charcoal-50 hover:bg-ivory-50">
                  <td className="px-6 py-4 text-sm font-medium">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `$${Number(coupon.value).toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-400">
                    {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs uppercase tracking-wider font-medium ${
                        coupon.isActive ? "bg-green-100 text-green-800" : "bg-charcoal-100 text-charcoal-600"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/marketing/${coupon.id}/edit`} className="p-2 hover:text-emerald transition-colors inline-block">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <AdminDeleteButton
                        url={`/api/admin/coupons/${coupon.id}`}
                        confirmMessage="Click again to delete this coupon"
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
