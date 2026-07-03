import Link from "next/link";

export const metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          Legal
        </p>
        <h1 className="font-display text-3xl font-medium text-ink mb-2">
          Terms of Use
        </h1>
        <p className="text-sm text-ink/50 mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-ink/80 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Agreement to terms</h2>
            <p>
              By accessing or using Sobrup, you agree to these Terms of Use.
              If you don't agree, please don't use the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">What Sobrup is</h2>
            <p>
              Sobrup is a directory of addiction treatment, behavioral
              health, and mental health facilities and licensed therapists
              in California. We are not a treatment provider, a medical
              professional, or an emergency service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Not medical advice</h2>
            <p>
              Nothing on Sobrup is medical advice or a recommendation of any
              specific provider. Listings, including free listings built
              from public data, are provided for informational purposes and
              may contain errors or become outdated. Always verify
              information directly with a provider before making treatment
              decisions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">If you're in crisis</h2>
            <p>
              Sobrup is not a crisis or emergency service. If you or someone
              you know is in crisis, call or text 988 to reach the Suicide
              &amp; Crisis Lifeline, available 24/7, or call 911.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Accounts</h2>
            <p>
              You need an account to claim a listing, submit a new listing,
              or manage a facility or practice profile. You're responsible
              for the accuracy of anything you submit and for keeping your
              account secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Claiming and submitting listings</h2>
            <p>
              When you claim a listing, you're representing that you're
              authorized to manage that facility's or practice's
              information. We review claims and new submissions by hand and
              may decline or remove any claim or listing at our discretion,
              including if we can't verify it or believe it's inaccurate,
              fraudulent, or violates these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Premium subscriptions</h2>
            <p>
              Premium listings are billed annually at the rate shown at the
              time of purchase. Subscription features may change over time.
              Cancellation and refund details will be provided once online
              billing is live.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Prohibited conduct</h2>
            <p>You agree not to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Claim a listing you're not authorized to manage</li>
              <li>Use the site to harass, defraud, or harm others</li>
              <li>Attempt to disrupt or gain unauthorized access to the site or its data</li>
              <li>Scrape or bulk-copy listings for a competing commercial purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Disclaimer of warranties</h2>
            <p>
              Sobrup is provided "as is." We don't guarantee that listings
              are accurate, complete, or current, or that any provider
              listed is licensed, qualified, or appropriate for your needs.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Sobrup is not liable
              for any damages arising from your use of the site or reliance
              on any listing, including decisions about treatment providers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Changes to these terms</h2>
            <p>
              We may update these terms from time to time. We'll update the
              "Last updated" date above when we do. Continued use of the
              site after a change means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Governing law</h2>
            <p>These terms are governed by the laws of the State of California.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink mb-3">Contact us</h2>
            <p>
              Questions about these terms? Reach out through our{" "}
              <Link href="/contact" className="text-pine-600 font-semibold hover:text-pine-700">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
