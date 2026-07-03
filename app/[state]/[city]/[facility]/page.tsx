import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Phone, Globe, ShieldCheck } from "lucide-react";
import { getFacilityByPath, getAllFacilityPaths } from "@/lib/data/facilities";
import type { Metadata } from "next";

interface Params {
  state: string;
  city: string;
  facility: string;
}

export async function generateStaticParams() {
  return getAllFacilityPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state, city, facility: facilitySlug } = await params;
  const facility = await getFacilityByPath(state, city, facilitySlug);
  if (!facility) return {};

  const title = `${facility.name} — ${facility.city}, ${facility.state}`;
  const description = `${facility.name} in ${facility.city}, ${facility.state}. ${facility.treatmentTypes.join(", ")}. View contact info, insurance accepted, and treatment programs.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${facility.stateSlug}/${facility.citySlug}/${facility.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [facility.imageUrl],
    },
  };
}

export default async function FacilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { state, city, facility: facilitySlug } = await params;
  const facility = await getFacilityByPath(state, city, facilitySlug);
  if (!facility) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: facility.name,
    description: facility.description,
    image: facility.imageUrl,
    telephone: facility.phone,
    url: facility.website,
    address: {
      "@type": "PostalAddress",
      streetAddress: facility.address,
      addressLocality: facility.city,
      addressRegion: "CA",
      postalCode: facility.zip,
      addressCountry: "US",
    },
  };

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-script-component-in-head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative h-64 w-full sm:h-80">
        <Image
          src={facility.imageUrl}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
      </div>

      <div className="container-page">
        <nav aria-label="Breadcrumb" className="py-4 text-sm text-ink/60">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="hover:text-pine-600">Home</Link></li>
            <li>/</li>
            <li><Link href={`/${facility.stateSlug}`} className="hover:text-pine-600">{facility.state}</Link></li>
            <li>/</li>
            <li><Link href={`/${facility.stateSlug}/${facility.citySlug}`} className="hover:text-pine-600">{facility.city}</Link></li>
            <li>/</li>
            <li className="text-ink">{facility.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-medium text-ink">
                {facility.name}
              </h1>
              {facility.verified && (
                <span className="flex items-center gap-1.5 rounded-full bg-pine-50 px-3 py-1.5 text-sm font-semibold text-pine-700 shrink-0">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-ink/60">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {facility.address}, {facility.city}, {facility.state} {facility.zip}
            </p>

            {facility.isPremium ? (
              <>
                <div className="mt-6 flex flex-wrap gap-2">
                  {facility.treatmentTypes.map((t) => (
                    <span key={t} className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-ink/80">
                      {t}
                    </span>
                  ))}
                </div>

                <h2 className="mt-10 font-display text-xl font-medium text-ink">About</h2>
                <p className="mt-3 text-ink/75 leading-relaxed max-w-2xl">
                  {facility.description}
                </p>

                <h2 className="mt-10 font-display text-xl font-medium text-ink">Insurance accepted</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {facility.insuranceAccepted.map((i) => (
                    <li key={i} className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink/70">
                      {i}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-line bg-mist p-6">
                <p className="text-sm text-ink/70">
                  Treatment types, insurance accepted, photos, and a full
                  description become visible once this listing is claimed
                  and upgraded to Premium.
                </p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-lg font-medium text-ink mb-4">
                Contact
              </h2>
              <div className="space-y-3 text-sm">
                <a href={`tel:${facility.phone}`} className="flex items-center gap-2 text-ink/80 hover:text-pine-600">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {facility.phone}
                </a>
                {facility.website && (
                  <a href={facility.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ink/80 hover:text-pine-600">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    Visit website
                  </a>
                )}
              </div>

              <div className="mt-6 border-t border-line pt-6">
                {facility.claimed ? (
                  <p className="text-xs text-ink/50">
                    This listing is managed by the facility.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-ink/70 mb-3">
                      Are you affiliated with this facility?
                    </p>
                    <Link
                      href={`/claim?facility=${facility.slug}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-pine-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pine-700 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      Claim This Listing
                    </Link>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
