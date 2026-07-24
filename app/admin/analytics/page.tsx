"use client"

import { useState } from "react"
import { requireAdmin } from "@/lib/auth-helpers"
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-emerald">Analytics</h1>
          <p className="text-charcoal-500 mt-1">
            Track your store performance
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-charcoal-200 text-sm bg-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white border border-charcoal-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-xl text-emerald">Revenue Overview</h2>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+24.5% vs last period</span>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {[65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-emerald/20 hover:bg-emerald/40 transition-colors"
                style={{ height: `${h}%` }}
              />
              <span className="text-xs text-charcoal-400">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-charcoal-100 p-6">
          <h2 className="font-serif text-xl text-emerald mb-6">Top Products</h2>
          <div className="space-y-4">
            {[
              { name: "Hermès Birkin 30", sales: 24, revenue: "$588,000" },
              { name: "Chanel Classic Flap", sales: 42, revenue: "$453,600" },
              { name: "Louis Vuitton Neverfull", sales: 67, revenue: "$166,830" },
              { name: "Gucci Dionysus", sales: 38, revenue: "$121,600" },
              { name: "Prada Galleria", sales: 31, revenue: "$122,450" },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-charcoal-50 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-charcoal-400 text-sm w-6">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-charcoal-400">{product.sales} sales</p>
                  </div>
                </div>
                <span className="text-sm font-medium">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-charcoal-100 p-6">
          <h2 className="font-serif text-xl text-emerald mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: "Organic Search", value: 42, color: "bg-emerald" },
              { source: "Direct", value: 28, color: "bg-champagne" },
              { source: "Social Media", value: 18, color: "bg-charcoal-400" },
              { source: "Referral", value: 8, color: "bg-charcoal-200" },
              { source: "Email", value: 4, color: "bg-charcoal-100" },
            ].map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{source.source}</span>
                  <span className="font-medium">{source.value}%</span>
                </div>
                <div className="h-2 bg-charcoal-100 overflow-hidden">
                  <div
                    className={`h-full ${source.color} transition-all duration-1000`}
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
