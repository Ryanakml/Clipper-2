import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import { SignupImage } from "./sign-up-image";

type SignupFormUIProps = {
  register: any;
  errors: any;
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
};

export function SignupFormUI({
  register,
  errors,
  isSubmitting,
  onSubmit,
  className,
}: SignupFormUIProps & { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email below to create your account
                </p>
              </div>

              {/* EMAIL */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* PASSWORD + CONFIRM (UI ONLY) */}
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input type="password" {...register("password")} />
                </Field>
                <Field>
                  <FieldLabel>Confirm</FieldLabel>
                  <Input type="password" />
                </Field>
              </Field>

              {errors.password && (
                <FieldDescription className="text-destructive">
                  {errors.password.message}
                </FieldDescription>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Create Account"}
              </Button>

              <FieldSeparator>Or continue with</FieldSeparator>

              {/* OAuth buttons (UI ONLY) */}
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  Apple
                </Button>
                <Button variant="outline" type="button">
                  Google
                </Button>
                <Button variant="outline" type="button">
                  Meta
                </Button>
              </div>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* SIDE IMAGE */}
          <div className="bg-muted relative hidden md:block">
            <SignupImage />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
