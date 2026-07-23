"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Image, Type, Layout, Save } from "lucide-react"

const cmsSections = [
  { id: "hero", label: "Hero Section", icon: Image },
  { id: "banners", label: "Banners", icon: Layout },
  { id: "collections", label: "Collections", icon: Type },
  { id: "blog", label: "Blog Posts", icon: FileText },
  { id: "faqs", label: "FAQs", icon: FileText },
  { id: "testimonials", label: "Testimonials", icon: Type },
]

export default function AdminCMSPage() {
  const [activeSection, setActiveSection] = useState("hero")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Content Management</h1>
        <p className="text-charcoal-500 mt-1">
          Manage your website content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white border border-charcoal-100 p-4 space-y-1">
          {cmsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === section.id
                  ? "bg-emerald text-white"
                  : "text-charcoal-600 hover:bg-ivory-100"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3 bg-white border border-charcoal-100 p-8">
          {activeSection === "hero" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <Label>Headline</Label>
                  <Input defaultValue="The Art of Timeless Elegance" />
                </div>
                <div>
                  <Label>Subheadline</Label>
                  <Input defaultValue="Spring / Summer 2026" />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    className="w-full border border-charcoal-200 p-4 text-sm min-h-[100px] focus:outline-none focus:border-emerald"
                    defaultValue="Discover our curated collection of the world's most coveted luxury bags, shoes, and accessories."
                  />
                </div>
                <div>
                  <Label>Primary CTA</Label>
                  <Input defaultValue="Shop New Arrivals" />
                </div>
                <div>
                  <Label>Secondary CTA</Label>
                  <Input defaultValue="Explore Collections" />
                </div>
                <div>
                  <Label>Hero Image</Label>
                  <div className="border-2 border-dashed border-charcoal-200 p-8 text-center">
                    <Image className="w-8 h-8 mx-auto mb-2 text-charcoal-300" />
                    <p className="text-sm text-charcoal-400">Drag & drop or click to upload</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "banners" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Banners</h2>
              <div className="space-y-4">
                {[
                  { name: "Free Shipping Banner", active: true },
                  { name: "New Arrivals Banner", active: true },
                  { name: "Sale Banner", active: false },
                ].map((banner) => (
                  <div key={banner.name} className="flex items-center justify-between p-4 border border-charcoal-100">
                    <div>
                      <p className="font-medium">{banner.name}</p>
                      <p className="text-xs text-charcoal-400">
                        {banner.active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-emerald hover:underline">Edit</button>
                      <button className="text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Add New Banner</Button>
              </div>
            </div>
          )}

          {activeSection === "blog" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Blog Posts</h2>
              <div className="space-y-4">
                {[
                  { title: "The History of the Hermès Birkin", author: "Editorial Team", date: "2026-07-15" },
                  { title: "How to Spot Authentic Luxury Bags", author: "Authentication Team", date: "2026-07-10" },
                  { title: "Spring 2026 Trend Report", author: "Fashion Director", date: "2026-07-01" },
                ].map((post) => (
                  <div key={post.title} className="flex items-center justify-between p-4 border border-charcoal-100">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-charcoal-400">
                        {post.author} • {post.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-emerald hover:underline">Edit</button>
                      <button className="text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Create New Post</Button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-charcoal-100">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
