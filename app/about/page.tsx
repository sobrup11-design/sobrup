export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          About
        </p>
        <h1 className="font-display text-3xl font-medium text-ink mb-6">
          Finding care shouldn't be this hard
        </h1>

        <div className="space-y-6 text-ink/80 leading-relaxed">
          <p>
            Sobrup started with a simple observation: when someone is looking
            for addiction or mental health treatment — for themselves or for
            someone they love — the search itself is often the hardest part.
            Scattered directories, outdated listings, and pages that don't
            tell you what you actually need to know before you pick up the
            phone.
          </p>
          <p>
            We're building a directory that starts with the basics done
            right: verified providers, accurate contact information, and a
            search that actually helps you narrow down what fits — by
            location, treatment type, and insurance accepted.
          </p>
          <p>
            We're starting in California, with plans to expand state by
            state. Every facility and every therapist gets a free, accurate
            listing from day one — providers can claim their listing to keep
            it up to date, and upgrade if they want a fuller profile.
          </p>
          <p>
            If you're a provider and don't see your listing, or see one that
            needs fixing, we'd rather hear from you directly than have it
            sit wrong.
          </p>
        </div>
      </div>
    </div>
  );
}
