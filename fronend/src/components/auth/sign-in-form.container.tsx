"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginValue } from "~/schemas/auth";
import { LoginFormUI } from "./sign-in-form.ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValue>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValue) => {
    setError(null);

    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <LoginFormUI
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
