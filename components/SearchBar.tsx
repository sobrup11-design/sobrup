"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/browse${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-canvas p-3 shadow-xl sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        <Search className="h-5 w-5 shrink-0 text-ink/40" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Facility name, city, or ZIP code"
          aria-label="Search treatment facilities"
          className="w-full bg-transparent py-3 text-base text-ink placeholder:text-ink/40 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-pine-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pine-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
