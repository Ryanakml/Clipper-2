"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignUpFormValue } from "~/schemas/auth";
import { signUp } from "~/actions/auth";
import { signIn } from "next-auth/react";
import { SignupFormUI } from "./sign-up-form.ui";

export function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValue>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignUpFormValue) => {
    try {
      setIsSubmitting(true);

      const result = await signUp(data);
      if (!result.success) {
        throw new Error(result.error);
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignupFormUI
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
