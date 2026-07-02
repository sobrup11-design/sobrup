import { Suspense } from "react";
import SignInForm from "@/components/SignInForm";

export const metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine-600 mb-2">
          Sign in
        </p>
        <h1 className="font-display text-3xl font-medium text-ink mb-2">
          Manage your listing
        </h1>
        <p className="text-ink/60 mb-8">
          We'll email you a link to sign in — no password needed.
        </p>

        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
