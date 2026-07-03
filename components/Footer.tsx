import Link from "next/link";

const columns = [
  {
    title: "Find Treatment",
    links: [
      { label: "Drug Rehab", href: "/browse?type=Drug%20Rehab" },
      { label: "Alcohol Rehab", href: "/browse?type=Alcohol%20Rehab" },
      { label: "Detox Centers", href: "/browse?type=Detox" },
      { label: "Mental Health", href: "/browse?type=Mental%20Health" },
      { label: "Find a Therapist", href: "/find-a-therapist" },
    ],
  },
  {
    title: "Browse",
    links: [
      { label: "By State", href: "/states" },
      { label: "Featured Facilities", href: "/browse?featured=true" },
      { label: "Resources & Blog", href: "/blog" },
    ],
  },
  {
    title: "Providers",
    links: [
      { label: "Claim Your Listing", href: "/for-providers" },
      { label: "Premium Membership", href: "/for-providers" },
      { label: "List Your Practice", href: "/for-therapists" },
      { label: "Provider Sign In", href: "/sign-in" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-mist mt-24">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl font-semibold text-pine-800">
              sobrup
            </span>
            <p className="mt-3 text-sm text-ink/60 max-w-xs">
              A nationwide directory helping people find trusted addiction and
              mental health treatment providers.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/60 hover:text-pine-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-ink/50">
            © {new Date().getFullYear()} Sobrup. All rights reserved.
          </p>
          <p className="text-xs text-ink/50 max-w-lg">
            If you or someone you know is in crisis, call or text 988 to reach
            the Suicide &amp; Crisis Lifeline, available 24/7.
          </p>
        </div>
      </div>
    </footer>
  );
}
