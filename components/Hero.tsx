import Link from "next/link";
import SearchBar from "./SearchBar";

const QUICK_LINKS = [
  { label: "Rehabs", href: "/browse?q=rehab" },
  { label: "Detox", href: "/browse?type=Detox" },
  { label: "Sober Living", href: `/browse?type=${encodeURIComponent("Sober Living")}` },
  { label: "Find a Therapist", href: `/browse?type=${encodeURIComponent("Mental Health")}` },
];

export default function Hero({ count }: { count: number }) {
  return (
    <section className="relative overflow-hidden bg-pine-800">
      {/* signature contour motif — evokes a topographic map / a path, rendered once, quietly */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M -50 550 C 150 480, 300 620, 500 540 S 850 420, 1100 500 S 1350 460, 1500 520"
          fill="none"
          stroke="#F6E9CC"
          strokeWidth="1.5"
        />
        <path
          d="M -50 460 C 180 400, 320 520, 520 450 S 860 340, 1100 420 S 1350 380, 1500 440"
          fill="none"
          stroke="#F6E9CC"
          strokeWidth="1.5"
        />
        <path
          d="M -50 380 C 200 320, 340 430, 540 370 S 870 270, 1100 340 S 1340 310, 1500 360"
          fill="none"
          stroke="#F6E9CC"
          strokeWidth="1.5"
        />
        <path
          d="M -50 300 C 220 250, 360 340, 560 290 S 880 210, 1100 270 S 1330 250, 1500 290"
          fill="none"
          stroke="#F6E9CC"
          strokeWidth="1.5"
        />
      </svg>

      <div className="container-page relative py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300 mb-4">
          California Treatment Directory
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-medium text-canvas leading-[1.05] max-w-3xl">
          Find the right treatment center, without the guesswork.
        </h1>
        <p className="mt-5 text-lg text-pine-100/90 max-w-xl">
          Search verified addiction, mental health, and behavioral health
          providers across California — by name, city, or ZIP code.
        </p>

        <div className="mt-10">
          <SearchBar />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full border border-pine-600 px-4 py-1.5 text-sm font-medium text-pine-50 hover:bg-pine-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-pine-100/80">
          <span>{count} California listings</span>
          <span className="text-pine-400">·</span>
          <span>Updated weekly</span>
          <span className="text-pine-400">·</span>
          <span>No cost to search</span>
        </div>
      </div>
    </section>
  );
}
