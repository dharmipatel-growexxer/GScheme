import Link from "next/link"
import { Building2 } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">GScheme Assistant</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* <nav className="flex items-center space-x-2">
            <Link
              href="/search"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-4 py-2"
            >
              Search
            </Link>
            <Link
              href="/eligibility"
              className="text-sm font-medium bg-primary text-primary-foreground transition-colors hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Check Eligibility
            </Link>
          </nav> */}
        </div>
      </div>
    </header>
  )
}
