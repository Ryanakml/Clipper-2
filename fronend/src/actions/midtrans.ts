"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export type PriceId = "small" | "medium" | "large";
export type PaymentStatus = "pending" | "paid" | "failed" | "expired";
type MidtransStatus =
  | "capture"
  | "settlement"
  | "pending"
  | "deny"
  | "cancel"
  | "expire";
type MidtransStatusResponse = {
  transaction_status: MidtransStatus;
  fraud_status?: string;
};

const PRICE_CONFIG: Record<
  PriceId,
  { amount: number; credits: number; label: string }
> = {
  small: { amount: 150_000, credits: 50, label: "Small Credit Pack (50)" },
  medium: { amount: 399_000, credits: 150, label: "Medium Credit Pack (150)" },
  large: { amount: 1_199_000, credits: 500, label: "Large Credit Pack (500)" },
};

const SNAP_URL =
  env.NODE_ENV === "production"
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
const MIDTRANS_STATUS_BASE =
  env.NODE_ENV === "production"
    ? "https://api.midtrans.com/v2"
    : "https://api.sandbox.midtrans.com/v2";

const MIDTRANS_AUTH_HEADER = `Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`;
const STATUS_MAP: Record<MidtransStatus, PaymentStatus> = {
  capture: "paid",
  settlement: "paid",
  pending: "pending",
  deny: "failed",
  cancel: "failed",
  expire: "expired",
};
const MIDTRANS_STATUSES: MidtransStatus[] = [
  "capture",
  "settlement",
  "pending",
  "deny",
  "cancel",
  "expire",
];

function isMidtransStatus(value: unknown): value is MidtransStatus {
  return (
    typeof value === "string" &&
    MIDTRANS_STATUSES.includes(value as MidtransStatus)
  );
}

function parseMidtransStatusResponse(data: unknown): MidtransStatusResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid Midtrans status response");
  }

  const record = data as Record<string, unknown>;
  if (!isMidtransStatus(record.transaction_status)) {
    throw new Error("Invalid Midtrans transaction status");
  }

  return {
    transaction_status: record.transaction_status,
    fraud_status:
      typeof record.fraud_status === "string" ? record.fraud_status : undefined,
  };
}

function normalizeMidtransStatus(
  transactionStatus: MidtransStatus,
  fraudStatus?: string,
): PaymentStatus {
  if (transactionStatus === "capture" && fraudStatus === "challenge") {
    return "pending";
  }
  return STATUS_MAP[transactionStatus] ?? "pending";
}

export async function createMidtransTransaction(priceId: PriceId) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User session not found");
  }

  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { email: true, name: true },
  });

  const plan = PRICE_CONFIG[priceId];

  if (!plan) {
    throw new Error("Invalid priceId");
  }

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";

  const orderId = `clipper-${priceId}-${Date.now()}-${session.user.id.slice(0, 6)}`;

  const payment = await db.payment.create({
    data: {
      orderId,
      status: "pending",
      amount: plan.amount,
      creditsPurchased: plan.credits,
      priceId,
      userId: session.user.id,
    },
  });

  let redirectUrl: string | undefined;

  try {
    const response = await fetch(SNAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: MIDTRANS_AUTH_HEADER,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: plan.amount,
        },
        item_details: [
          {
            id: priceId,
            price: plan.amount,
            quantity: 1,
            name: plan.label,
          },
        ],
        customer_details: {
          email: user.email,
          first_name: user.name ?? user.email.split("@")[0],
        },
        callbacks: {
          finish: `${origin}/dashboard?payment=finished`,
        },
        // TAMBAHKAN INI:
        enabled_payments: [
          "credit_card",
          "bca_va",
          "bni_va",
          "bri_va",
          "permata_va",
          "other_va",
          "gopay",
          "shopeepay",
        ],
        // WEBHOOK ENDPOINT - GANTI SESUAI DOMAIN ANDA
        notification_url: `${origin}/api/midtrans/webhook`,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Midtrans Snap error: ${errorMessage}`);
    }

    const body = (await response.json()) as { redirect_url?: string };

    if (!body.redirect_url) {
      throw new Error("Failed to create Midtrans payment link");
    }

    redirectUrl = body.redirect_url;

    await db.payment.update({
      where: { id: payment.id },
      data: { snapRedirectUrl: redirectUrl },
    });
  } catch (error) {
    await db.payment
      .update({
        where: { id: payment.id },
        data: { status: "failed" },
      })
      .catch(() => {
        // best-effort; if this fails, surface the original error
      });

    throw error;
  }

  redirect(redirectUrl);
}

export async function syncUserPayments(userId: string) {
  console.log("=== SYNC USER PAYMENTS START ===");
  console.log("User ID:", userId);

  const pending = await db.payment.findMany({
    where: { userId, status: { in: ["pending", "failed"] } },
  });

  console.log(`Found ${pending.length} pending payments`);

  if (!pending.length) {
    console.log("No pending payments, exiting sync");
    return;
  }

  for (const payment of pending) {
    console.log("\n--- Processing payment ---");
    console.log("Order ID:", payment.orderId);
    console.log("Current Status:", payment.status);
    console.log("Amount:", payment.amount);
    console.log("Credits:", payment.creditsPurchased);

    try {
      console.log(`Fetching Midtrans status for ${payment.orderId}...`);

      const status = await fetchMidtransStatus(payment.orderId);

      console.log("Midtrans Response:", JSON.stringify(status, null, 2));
      console.log("Transaction Status:", status.transaction_status);
      console.log("Fraud Status:", status.fraud_status);

      const normalized = normalizeMidtransStatus(
        status.transaction_status,
        status.fraud_status,
      );

      console.log("Normalized Status:", normalized);

      if (normalized === payment.status) {
        console.log("Status unchanged, skipping update");
        continue;
      }

      console.log(`Updating payment from ${payment.status} to ${normalized}`);

      await db.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: normalized,
            paidAt: normalized === "paid" ? new Date() : null,
          },
        });

        console.log("Payment updated:", updatedPayment);

        if (normalized === "paid") {
          console.log(
            `Adding ${payment.creditsPurchased} credits to user ${payment.userId}`,
          );

          const updatedUser = await tx.user.update({
            where: { id: payment.userId },
            data: {
              credits: { increment: payment.creditsPurchased },
            },
          });

          console.log("User credits updated:", updatedUser.credits);
        }
      });

      console.log("✅ Payment sync successful");
    } catch (error) {
      console.error("❌ Failed to sync payment", payment.orderId);
      console.error("Error details:", error);
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "N/A",
      );
    }
  }

  console.log("\n=== SYNC USER PAYMENTS END ===");
}

async function fetchMidtransStatus(orderId: string) {
  const url = `${MIDTRANS_STATUS_BASE}/${orderId}/status`;

  console.log("Fetching from URL:", url);
  console.log("Auth Header:", MIDTRANS_AUTH_HEADER.substring(0, 20) + "...");

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: MIDTRANS_AUTH_HEADER,
    },
  });

  console.log("Response status:", response.status);
  console.log("Response OK:", response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(
      `Failed to fetch Midtrans status for ${orderId}: ${response.status} - ${errorText}`,
    );
  }

  const data: unknown = await response.json();
  return parseMidtransStatusResponse(data);
}
