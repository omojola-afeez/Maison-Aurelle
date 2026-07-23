"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Store, Truck, CreditCard, Bell, Shield } from "lucide-react"

const settingsTabs = [
  { id: "general", label: "General", icon: Store },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Settings</h1>
        <p className="text-charcoal-500 mt-1">
          Configure your store settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="bg-white border border-charcoal-100 p-4 space-y-1">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald text-white"
                  : "text-charcoal-600 hover:bg-ivory-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 bg-white border border-charcoal-100 p-8">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Store Name</Label>
                  <Input defaultValue="Maison Aurelle" />
                </div>
                <div>
                  <Label>Store Email</Label>
                  <Input defaultValue="hello@maisonaurelle.com" />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input defaultValue="USD" />
                </div>
                <div>
                  <Label>Default Language</Label>
                  <Input defaultValue="English (US)" />
                </div>
                <div className="md:col-span-2">
                  <Label>Store Description</Label>
                  <textarea
                    className="w-full border border-charcoal-200 p-4 text-sm min-h-[80px] focus:outline-none focus:border-emerald"
                    defaultValue="Premium luxury fashion boutique offering authentic designer bags, shoes, and accessories."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Shipping Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Free Shipping Threshold</Label>
                  <Input defaultValue="500" type="number" />
                </div>
                <div>
                  <Label>Standard Shipping Rate</Label>
                  <Input defaultValue="25.00" type="number" />
                </div>
                <div>
                  <Label>Express Shipping Rate</Label>
                  <Input defaultValue="45.00" type="number" />
                </div>
                <div>
                  <Label>Processing Time (Days)</Label>
                  <Input defaultValue="1-2" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Payment Settings</h2>
              <div className="space-y-4">
                <div className="p-4 border border-charcoal-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-xs text-charcoal-400">Credit/Debit Cards</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs uppercase tracking-wider font-medium">
                      Active
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Publishable Key</Label>
                      <Input type="password" defaultValue="pk_live_..." />
                    </div>
                    <div>
                      <Label className="text-xs">Secret Key</Label>
                      <Input type="password" defaultValue="sk_live_..." />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-charcoal-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Apple Pay</p>
                      <p className="text-xs text-charcoal-400">Express Checkout</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs uppercase tracking-wider font-medium">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-charcoal-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Google Pay</p>
                      <p className="text-xs text-charcoal-400">Express Checkout</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs uppercase tracking-wider font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  { label: "Order Confirmation", description: "Send email when order is placed", checked: true },
                  { label: "Shipping Updates", description: "Send email when order ships", checked: true },
                  { label: "Delivery Confirmation", description: "Send email when order is delivered", checked: true },
                  { label: "Abandoned Cart", description: "Send reminder for abandoned carts", checked: true },
                  { label: "Low Stock Alert", description: "Notify admin when inventory is low", checked: true },
                  { label: "New Review", description: "Notify admin when a review is submitted", checked: false },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-start justify-between p-4 border border-charcoal-100">
                    <div>
                      <p className="font-medium text-sm">{setting.label}</p>
                      <p className="text-xs text-charcoal-400">{setting.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={setting.checked}
                      className="w-5 h-5 accent-emerald"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Security Settings</h2>
              <div className="space-y-4">
                <div className="p-4 border border-charcoal-100">
                  <p className="font-medium mb-2">Rate Limiting</p>
                  <p className="text-xs text-charcoal-400 mb-4">Limit API requests to prevent abuse</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Requests per minute</Label>
                      <Input defaultValue="60" type="number" />
                    </div>
                    <div>
                      <Label className="text-xs">Burst limit</Label>
                      <Input defaultValue="10" type="number" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-charcoal-100">
                  <p className="font-medium mb-2">Session Settings</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Session timeout (hours)</Label>
                      <Input defaultValue="24" type="number" />
                    </div>
                    <div>
                      <Label className="text-xs">Max login attempts</Label>
                      <Input defaultValue="5" type="number" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-charcoal-100">
                  <p className="font-medium mb-2">Two-Factor Authentication</p>
                  <p className="text-xs text-charcoal-400 mb-4">Require 2FA for admin accounts</p>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald" />
                    <span className="text-sm">Enforce 2FA for all admin users</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-8" />
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
