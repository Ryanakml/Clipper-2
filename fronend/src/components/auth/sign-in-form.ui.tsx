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

type LoginFormUIProps = {
  register: any;
  errors: any;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
};

export function LoginFormUI({
  register,
  errors,
  isSubmitting,
  error,
  onSubmit,
}: LoginFormUIProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <FieldGroup>
              {/* HEADER */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-bold">Log in to your account</h1>
                <p className="text-muted-foreground text-sm">
                  Welcome back! Please enter your details.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-destructive/15 text-destructive rounded-md p-3 text-center text-sm">
                  {error}
                </div>
              )}

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

              {/* PASSWORD */}
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" {...register("password")} />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {/* SUBMIT */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>

              <FieldSeparator>Or continue with</FieldSeparator>

              {/* OAUTH (UI ONLY) */}
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
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a
          href="/terms-of-service"
          className="hover:text-foreground underline underline-offset-4"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy-policy"
          className="hover:text-foreground underline underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
