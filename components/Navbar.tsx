import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-line bg-canvas/90 backdrop-blur sticky top-0 z-40">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-pine-800 tracking-tight">
            sobrup
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
          <Link href="/browse" className="hover:text-pine-600 transition-colors">
            Browse Treatment
          </Link>
          <Link href="/find-a-therapist" className="hover:text-pine-600 transition-colors">
            Find a Therapist
          </Link>
          <Link href="/cities" className="hover:text-pine-600 transition-colors">
            By City
          </Link>
          <Link href="/blog" className="hover:text-pine-600 transition-colors">
            Resources
          </Link>
          <Link href="/for-providers" className="hover:text-pine-600 transition-colors">
            For Providers
          </Link>
          <Link href="/for-therapists" className="hover:text-pine-600 transition-colors">
            For Therapists
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden sm:inline-block text-sm font-medium text-ink/80 hover:text-pine-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/for-providers"
            className="inline-flex items-center rounded-full bg-pine-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pine-700 transition-colors"
          >
            Claim Your Listing
          </Link>
        </div>
      </div>
    </header>
  );
}
