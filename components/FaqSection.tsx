import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/lib/faq";

export default function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-20 max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
        FAQ
      </p>
      <h2 className="font-display text-2xl font-medium text-ink mb-6">
        Frequently asked questions
      </h2>

      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {items.map((item) => (
          <details key={item.question} className="group px-6 py-4 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink marker:content-none">
              {item.question}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-2 text-sm text-ink/70 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
