import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { SignUpForm } from "../../components/auth/sign-up-form.container";

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to landing
        </Link>
        <SignUpForm />
      </div>
    </div>
  );
}
