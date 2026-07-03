import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Phone, Mail, Globe, ShieldCheck, Video, User } from "lucide-react";
import { getTherapistByPath, getAllTherapistPaths } from "@/lib/data/therapists";
import type { Metadata } from "next";

interface Params {
  state: string;
  city: string;
  therapist: string;
}

export async function generateStaticParams() {
  return getAllTherapistPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state, city, therapist: slug } = await params;
  const therapist = await getTherapistByPath(state, city, slug);
  if (!therapist) return {};

  const title = `${therapist.name} — ${therapist.licenseType}${therapist.city ? `, ${therapist.city}` : ""}`;
  const description = `${therapist.name}, ${therapist.licenseType}. Specialties: ${therapist.specialties.join(", ")}.`;

  return { title, description };
}

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80";

export default async function TherapistPage({ params }: { params: Promise<Params> }) {
  const { state, city, therapist: slug } = await params;
  const therapist = await getTherapistByPath(state, city, slug);
  if (!therapist) notFound();

  return (
    <div className="container-page py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink/60">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-pine-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/find-a-therapist" className="hover:text-pine-600">Find a Therapist</Link></li>
          <li>/</li>
          <li className="text-ink">{therapist.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-mist">
              <Image src={therapist.photoUrl ?? FALLBACK_PHOTO} alt="" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl font-medium text-ink">{therapist.name}</h1>
                {therapist.verified && (
                  <BadgeCheck className="h-5 w-5 text-pine-600" aria-label="Verified" />
                )}
              </div>
              <p className="mt-1 text-ink/60">{therapist.licenseType}</p>
              {therapist.city && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {therapist.address ? `${therapist.address}, ` : ""}{therapist.city}, {therapist.state} {therapist.zip}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {therapist.inPerson && (
              <span className="flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-ink/80">
                <User className="h-3.5 w-3.5" aria-hidden="true" /> In-person
              </span>
            )}
            {therapist.telehealth && (
              <span className="flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-ink/80">
                <Video className="h-3.5 w-3.5" aria-hidden="true" /> Telehealth
              </span>
            )}
            {therapist.acceptingNewClients && (
              <span className="rounded-full bg-pine-50 px-3 py-1.5 text-sm font-medium text-pine-700">
                Accepting new clients
              </span>
            )}
          </div>

          <h2 className="mt-10 font-display text-xl font-medium text-ink">About</h2>
          {therapist.isPremium ? (
            <>
              <p className="mt-3 text-ink/75 leading-relaxed max-w-2xl">{therapist.bio}</p>

              <h2 className="mt-10 font-display text-xl font-medium text-ink">Specialties</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {therapist.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-ink/80">
                    {s}
                  </span>
                ))}
              </div>

              <h2 className="mt-10 font-display text-xl font-medium text-ink">Insurance accepted</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {therapist.insuranceAccepted.map((i) => (
                  <li key={i} className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink/70">
                    {i}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-line bg-mist p-6">
              <p className="text-sm text-ink/70">
                A bio, specialties, insurance accepted, and a photo become
                visible once this listing is claimed and upgraded to Premium.
              </p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg font-medium text-ink mb-4">Contact</h2>
            <div className="space-y-3 text-sm">
              <a href={`tel:${therapist.phone}`} className="flex items-center gap-2 text-ink/80 hover:text-pine-600">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {therapist.phone}
              </a>
              <a href={`mailto:${therapist.email}`} className="flex items-center gap-2 text-ink/80 hover:text-pine-600">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {therapist.email}
              </a>
              {therapist.website && (
                <a href={therapist.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ink/80 hover:text-pine-600">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  Visit website
                </a>
              )}
            </div>

            <div className="mt-6 border-t border-line pt-6">
              {therapist.claimed ? (
                <p className="text-xs text-ink/50">This listing is managed by the therapist.</p>
              ) : (
                <>
                  <p className="text-sm text-ink/70 mb-3">Is this your practice?</p>
                  <Link
                    href={`/claim-therapist?therapist=${therapist.slug}`}
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
  );
}
