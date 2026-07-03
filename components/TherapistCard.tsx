import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, MapPin, Phone, Video, User } from "lucide-react";
import { Therapist } from "@/lib/types";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80";

export default function TherapistCard({ therapist }: { therapist: Therapist }) {
  const locationLabel = therapist.city
    ? `${therapist.city}, ${therapist.state}`
    : "Telehealth";

  return (
    <Link
      href={
        therapist.stateSlug && therapist.citySlug
          ? `/therapist/${therapist.stateSlug}/${therapist.citySlug}/${therapist.slug}`
          : "#"
      }
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:shadow-lg hover:border-pine-300"
    >
      <div className="relative h-40 w-full overflow-hidden bg-mist">
        <Image
          src={therapist.isPremium && therapist.photoUrl ? therapist.photoUrl : FALLBACK_PHOTO}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {therapist.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-medium text-ink leading-snug">
            {therapist.name}
          </h3>
          {therapist.verified && (
            <BadgeCheck className="h-5 w-5 shrink-0 text-pine-600" aria-label="Verified listing" />
          )}
        </div>

        <p className="text-sm text-ink/60">{therapist.licenseType}</p>

        <p className="flex items-center gap-1 text-sm text-ink/60">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {locationLabel}
        </p>

        {therapist.phone && (
          <p className="flex items-center gap-1 text-sm text-ink/60">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {therapist.phone}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-1.5">
          {therapist.inPerson && (
            <span className="flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink/70">
              <User className="h-3 w-3" aria-hidden="true" /> In-person
            </span>
          )}
          {therapist.telehealth && (
            <span className="flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink/70">
              <Video className="h-3 w-3" aria-hidden="true" /> Telehealth
            </span>
          )}
        </div>

        {therapist.isPremium ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {therapist.specialties.slice(0, 2).map((s) => (
              <span key={s} className="rounded-full bg-pine-50 px-2.5 py-1 text-xs font-medium text-pine-700">
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-xs text-ink/40">
            Full profile available once claimed &amp; upgraded
          </p>
        )}
      </div>
    </Link>
  );
}
