"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"

const navLinks = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/collections", label: "Collections" },
  {
    href: "/shop",
    label: "Shop",
    children: [
      { href: "/category/bags", label: "Handbags" },
      { href: "/category/shoes", label: "Shoes" },
      { href: "/category/accessories", label: "Accessories" },
      { href: "/category/jewelry", label: "Jewelry" },
      { href: "/category/watches", label: "Watches" },
    ],
  },
  { href: "/designers", label: "Designers" },
  { href: "/about", label: "Our Story" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-emerald text-white text-center py-2.5 px-4 text-[11px] tracking-[0.2em] uppercase overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="mx-8">Complimentary Shipping on Orders Over $500</span>
          <span className="mx-8 text-champagne">•</span>
          <span className="mx-8">New Season Arrivals Now Available</span>
          <span className="mx-8 text-champagne">•</span>
          <span className="mx-8">Authenticity Guaranteed on Every Piece</span>
          <span className="mx-8 text-champagne">•</span>
          <span className="mx-8">Complimentary Shipping on Orders Over $500</span>
          <span className="mx-8 text-champagne">•</span>
          <span className="mx-8">New Season Arrivals Now Available</span>
          <span className="mx-8 text-champagne">•</span>
          <span className="mx-8">Authenticity Guaranteed on Every Piece</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-charcoal-100 transition-all duration-500",
          isScrolled && "shadow-sm"
        )}
      >
        <div className="luxury-container">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "nav-link text-xs uppercase tracking-[0.15em] font-medium transition-colors",
                      pathname === link.href
                        ? "text-emerald"
                        : "text-charcoal-700 hover:text-emerald"
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {link.label}
                      {link.children && <ChevronDown className="w-3 h-3" />}
                    </span>
                  </Link>

                  {/* Dropdown */}
                  {link.children && activeDropdown === link.href && (
                    <div className="absolute top-full left-0 pt-4 w-56">
                      <div className="bg-white border border-charcoal-100 shadow-lg py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-6 py-3 text-sm text-charcoal hover:text-emerald hover:bg-ivory-100 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className="font-serif text-2xl md:text-3xl tracking-[0.1em] text-emerald">
                Maison Aurelle
              </h1>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <button
                className="p-2 hover:text-emerald transition-colors"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/account"
                className="hidden md:block p-2 hover:text-emerald transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/wishlist"
                className="hidden md:block p-2 hover:text-emerald transition-colors"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="p-2 hover:text-emerald transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-champagne text-charcoal text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-ivory/98 flex items-start justify-center pt-32">
          <div className="luxury-container w-full max-w-3xl">
            <div className="flex items-center gap-4 border-b-2 border-charcoal pb-4">
              <Search className="w-6 h-6 text-charcoal-400" />
              <input
                type="text"
                placeholder="Search bags, shoes, accessories..."
                className="flex-1 bg-transparent text-2xl font-serif outline-none placeholder:text-charcoal-300"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:text-emerald transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal-400 mb-4">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-3">
                {["Hermès Birkin", "Chanel Classic", "Louis Vuitton", "Gucci Dionysus", "Prada Galleria"].map(
                  (term) => (
                    <button
                      key={term}
                      className="px-4 py-2 border border-charcoal-200 text-sm hover:border-emerald hover:text-emerald transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-ivory transition-transform duration-500 ease-luxury lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="luxury-container py-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-xl text-emerald">Maison Aurelle</h2>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="text-2xl font-serif text-charcoal hover:text-emerald transition-colors"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="mt-3 ml-4 space-y-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block text-lg text-charcoal-600 hover:text-emerald transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="h-px bg-charcoal-200 my-4" />
            <Link href="/account" className="text-lg text-charcoal-600 hover:text-emerald">
              My Account
            </Link>
            <Link href="/wishlist" className="text-lg text-charcoal-600 hover:text-emerald">
              Wishlist
            </Link>
            <Link href="/cart" className="text-lg text-charcoal-600 hover:text-emerald">
              Shopping Bag
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
