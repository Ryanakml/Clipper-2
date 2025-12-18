"use server";

import { hashedPassword } from "~/lib/auth";
import {
  signupSchema,
  type SignUpFormValue,
  forgotPasswordSchema,
  type ForgotPasswordValue,
  resetPasswordSchema,
  type ResetPasswordValue,
} from "~/schemas/auth";
import { db } from "~/server/db";
import { randomUUID } from "crypto";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function signUp(data: SignUpFormValue): Promise<ActionResult> {
  const validationResult = signupSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0]?.message ?? "Invalid",
    };
  }

  const { email, password } = validationResult.data;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists",
      };
    }

    const hashedPasswords = await hashedPassword(password);

    await db.user.create({
      data: {
        email,
        password: hashedPasswords,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to sign up:", error);
    return {
      success: false,
      error: "Failed to sign up",
    };
  }
}

export async function requestPasswordReset(
  data: ForgotPasswordValue,
): Promise<ActionResult> {
  const validationResult = forgotPasswordSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid email address",
    };
  }

  const { email } = validationResult.data;

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success to prevent email enumeration
      return { success: true };
    }

    const token = randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiration

    // Check if token exists for this user (identifier) and delete it if it does?
    // Actually, verificationToken uses identifier. We can have multiple tokens?
    // The schema says token is @unique.
    // Let's delete any existing token for this identifier to be clean, although schema allows multiple if tokens are different.
    // Better to just create.

    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // TODO: Send email with token
    console.log("----------------------------------------");
    console.log(`Password reset token for ${email}: ${token}`);
    console.log("----------------------------------------");

    return { success: true };
  } catch (error) {
    console.error("Failed to request password reset:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function resetPassword(
  data: ResetPasswordValue,
  token: string,
): Promise<ActionResult> {
  const validationResult = resetPasswordSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid password",
    };
  }

  const { password } = validationResult.data;

  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return { success: false, error: "Invalid token" };
    }

    if (verificationToken.expires < new Date()) {
      return { success: false, error: "Token expired" };
    }

    const existingUser = await db.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    const hashedPasswords = await hashedPassword(password);

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPasswords,
      },
    });

    await db.verificationToken.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
