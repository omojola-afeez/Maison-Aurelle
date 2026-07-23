import Link from "next/link"
import { Instagram, Facebook, Twitter, Linkedin, CreditCard, ShieldCheck } from "lucide-react"

const footerLinks = {
  shop: [
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/best-sellers", label: "Best Sellers" },
    { href: "/category/bags", label: "Handbags" },
    { href: "/category/shoes", label: "Shoes" },
    { href: "/category/jewelry", label: "Jewelry" },
    { href: "/category/watches", label: "Watches" },
  ],
  support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/faqs", label: "FAQs" },
    { href: "/shipping", label: "Shipping & Returns" },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/authenticity", label: "Authenticity" },
    { href: "/care", label: "Care Guide" },
  ],
  company: [
    { href: "/about", label: "Our Story" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/sustainability", label: "Sustainability" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
}

const socialLinks = [
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-charcoal-800 text-white pt-20 pb-8">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-white mb-4">Maison Aurelle</h2>
            <p className="text-charcoal-300 text-sm leading-relaxed mb-6 max-w-sm">
              Curating the world's finest luxury fashion since 2019. Every piece
              authenticated, every experience elevated.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 border border-charcoal-600 flex items-center justify-center hover:border-champagne hover:text-champagne transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-champagne mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-300 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-champagne mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-300 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-champagne mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-300 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-charcoal-400 text-xs">
            © {new Date().getFullYear()} Maison Aurelle. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <CreditCard className="w-8 h-5 text-charcoal-500" />
            <ShieldCheck className="w-8 h-5 text-charcoal-500" />
            <span className="text-xs text-charcoal-500">SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
