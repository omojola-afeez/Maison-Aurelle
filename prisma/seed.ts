import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // --- Admin + test customer accounts ---
  const adminPassword = await bcrypt.hash("Admin123!", 10)
  await prisma.user.upsert({
    where: { email: "admin@maisonaurelle.com" },
    update: {},
    create: {
      email: "admin@maisonaurelle.com",
      name: "Store Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  const customerPassword = await bcrypt.hash("Customer123!", 10)
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Jane Customer",
      password: customerPassword,
      role: "CUSTOMER",
    },
  })

  // --- Categories ---
  const categoryData = [
    { slug: "bags", name: "Bags", description: "Handbags, totes, and clutches" },
    { slug: "shoes", name: "Shoes", description: "Heels, flats, and sneakers" },
    { slug: "accessories", name: "Accessories", description: "Belts, scarves, and jewelry" },
  ]
  const categories = []
  for (const c of categoryData) {
    categories.push(
      await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
    )
  }

  // --- Designers ---
  const designerData = [
    { slug: "aurelle-atelier", name: "Aurelle Atelier", country: "France", founded: 1998 },
    { slug: "maison-vittoria", name: "Maison Vittoria", country: "Italy", founded: 1975 },
    { slug: "noir-studio", name: "Noir Studio", country: "United States", founded: 2011 },
  ]
  const designers = []
  for (const d of designerData) {
    designers.push(
      await prisma.designer.upsert({ where: { slug: d.slug }, update: {}, create: d })
    )
  }

  // --- Products ---
  const productData = [
    {
      slug: "the-signature-tote",
      name: "The Signature Tote",
      description:
        "A structured leather tote built for daily carry, finished with our signature gold hardware and an interior suede lining.",
      shortDesc: "Structured leather tote with gold hardware",
      price: 890,
      comparePrice: 1090,
      sku: "MA-TOTE-001",
      category: "bags",
      designer: "aurelle-atelier",
      featured: true,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
    },
    {
      slug: "atelier-clutch",
      name: "Atelier Clutch",
      description:
        "A compact evening clutch in Italian calfskin, with a hidden magnetic clasp and card slots inside.",
      shortDesc: "Italian calfskin evening clutch",
      price: 420,
      comparePrice: null,
      sku: "MA-CLUTCH-002",
      category: "bags",
      designer: "maison-vittoria",
      featured: true,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    },
    {
      slug: "heritage-loafer",
      name: "Heritage Loafer",
      description:
        "Hand-stitched leather loafers with a stacked wood heel and cushioned insole for all-day wear.",
      shortDesc: "Hand-stitched leather loafer",
      price: 540,
      comparePrice: 620,
      sku: "MA-SHOE-003",
      category: "shoes",
      designer: "maison-vittoria",
      featured: false,
      image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800",
    },
    {
      slug: "noir-ankle-boot",
      name: "Noir Ankle Boot",
      description: "A minimalist ankle boot in matte black leather with a low block heel.",
      shortDesc: "Matte black leather ankle boot",
      price: 610,
      comparePrice: null,
      sku: "MA-SHOE-004",
      category: "shoes",
      designer: "noir-studio",
      featured: true,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
    },
    {
      slug: "silk-twill-scarf",
      name: "Silk Twill Scarf",
      description: "A hand-rolled silk twill scarf, printed in-house and finished with fringed edges.",
      shortDesc: "Hand-rolled silk twill scarf",
      price: 210,
      comparePrice: null,
      sku: "MA-ACC-005",
      category: "accessories",
      designer: "aurelle-atelier",
      featured: false,
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
    },
    {
      slug: "reversible-leather-belt",
      name: "Reversible Leather Belt",
      description: "A reversible full-grain leather belt with a brushed brass buckle, black on one side, tan on the other.",
      shortDesc: "Reversible full-grain leather belt",
      price: 165,
      comparePrice: 195,
      sku: "MA-ACC-006",
      category: "accessories",
      designer: "noir-studio",
      featured: false,
      image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800",
    },
  ]

  for (const p of productData) {
    const category = categories.find((c) => c.slug === p.category)
    const designer = designers.find((d) => d.slug === p.designer)

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        shortDesc: p.shortDesc,
        price: p.price,
        comparePrice: p.comparePrice,
        sku: p.sku,
        status: "ACTIVE",
        featured: p.featured,
        categoryId: category?.id,
        designerId: designer?.id,
      },
    })

    const existingVariant = await prisma.productVariant.findUnique({
      where: { sku: `${p.sku}-DEFAULT` },
    })
    if (!existingVariant) {
      await prisma.productVariant.create({
        data: { sku: `${p.sku}-DEFAULT`, inventory: 25, productId: product.id },
      })
    }

    const existingImage = await prisma.productImage.findFirst({ where: { productId: product.id } })
    if (!existingImage) {
      await prisma.productImage.create({
        data: { url: p.image, alt: p.name, isPrimary: true, position: 0, productId: product.id },
      })
    }
  }

  // --- Content pages ---
  const pages = [
    {
      slug: "about",
      title: "Our Story",
      content:
        "Maison Aurelle was founded to make it simple to discover authenticated luxury goods from independent ateliers and established houses alike. Every piece we carry is inspected by our authentication team before it reaches you.",
    },
    {
      slug: "faqs",
      title: "Frequently Asked Questions",
      content:
        "Shipping: Orders ship within 2 business days.\nReturns: We accept returns within 14 days of delivery, provided the item is unworn and in its original packaging.\nAuthentication: Every item is inspected by our in-house team before shipping.",
    },
    {
      slug: "shipping",
      title: "Shipping",
      content:
        "We offer standard shipping (5-7 business days) and express shipping (2-3 business days) across the US. Orders over $500 ship free with our standard option.",
    },
    {
      slug: "size-guide",
      title: "Size Guide",
      content:
        "Sizes vary slightly by designer. Each product page lists designer-specific measurements. If you're between sizes, we generally recommend sizing up for shoes and down for structured bags with handles.",
    },
    {
      slug: "authenticity",
      title: "Authenticity Guarantee",
      content:
        "Every item sold on Maison Aurelle is verified by our in-house authentication team, using a combination of material analysis, hardware inspection, and provenance documentation.",
    },
    {
      slug: "care",
      title: "Care Guide",
      content:
        "Store leather goods away from direct sunlight and extreme humidity. Use a soft, dry cloth for everyday cleaning, and a leather-specific conditioner every few months.",
    },
    {
      slug: "careers",
      title: "Careers",
      content:
        "We're a small, remote-friendly team. If you're interested in working with us, reach out via our contact page with a bit about your background.",
    },
    {
      slug: "press",
      title: "Press",
      content: "For press inquiries, please reach out via our contact page and we'll get back to you within a business day.",
    },
    {
      slug: "sustainability",
      title: "Sustainability",
      content:
        "Buying pre-owned and independently made pieces extends the life of well-made goods and reduces demand on new production. We're working on a formal sustainability report; check back soon.",
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      content:
        "We collect only the information needed to fulfill orders and improve our service, and never sell customer data to third parties. Contact us with any questions about your data.",
    },
    {
      slug: "terms",
      title: "Terms of Service",
      content:
        "By using this site, you agree to our standard terms of sale, including our return and authenticity policies described elsewhere on this site.",
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: { ...page, isPublished: true },
    })
  }

  console.log("Seed complete.")
  console.log("Admin login: admin@maisonaurelle.com / Admin123!")
  console.log("Customer login: customer@example.com / Customer123!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
