import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { LoginForm } from "./../../components/auth/sign-in-form.container";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to landing
        </Link>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
