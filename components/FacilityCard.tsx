import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import { Facility } from "@/lib/types";

export default function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <Link
      href={`/${facility.stateSlug}/${facility.citySlug}/${facility.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:shadow-lg hover:border-pine-300"
    >
      <div className="relative h-44 w-full overflow-hidden bg-mist">
        <Image
          src={facility.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {facility.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-medium text-ink leading-snug">
            {facility.name}
          </h3>
          {facility.verified && (
            <BadgeCheck
              className="h-5 w-5 shrink-0 text-pine-600"
              aria-label="Verified listing"
            />
          )}
        </div>

        <p className="flex items-center gap-1 text-sm text-ink/60">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {facility.city}, {facility.state}
        </p>

        <p className="text-sm text-ink/70 line-clamp-2">{facility.description}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {facility.treatmentTypes.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full bg-pine-50 px-2.5 py-1 text-xs font-medium text-pine-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
