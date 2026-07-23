export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-emerald">Maison Aurelle</h2>
          <p className="mt-2 text-sm text-charcoal-500">
            Luxury fashion, elevated.
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
