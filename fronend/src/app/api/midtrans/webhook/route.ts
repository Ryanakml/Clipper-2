import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "~/env";
import { db } from "~/server/db";

type MidtransStatus =
  | "capture"
  | "settlement"
  | "pending"
  | "deny"
  | "cancel"
  | "expire";
type PaymentStatus = "pending" | "paid" | "failed" | "expired";
type MidtransWebhookPayload = {
  order_id: string;
  transaction_status: MidtransStatus;
  fraud_status?: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
};

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

function parseWebhookPayload(data: unknown): MidtransWebhookPayload {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid Midtrans payload");
  }

  const record = data as Record<string, unknown>;
  if (
    typeof record.order_id !== "string" ||
    typeof record.status_code !== "string" ||
    typeof record.gross_amount !== "string" ||
    typeof record.signature_key !== "string" ||
    !isMidtransStatus(record.transaction_status)
  ) {
    throw new Error("Invalid Midtrans payload");
  }

  return {
    order_id: record.order_id,
    transaction_status: record.transaction_status,
    fraud_status:
      typeof record.fraud_status === "string" ? record.fraud_status : undefined,
    status_code: record.status_code,
    gross_amount: record.gross_amount,
    signature_key: record.signature_key,
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

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
): boolean {
  const serverKey = env.MIDTRANS_SERVER_KEY;
  const hash = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return hash === signatureKey;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
    } = parseWebhookPayload(body);

    // Verify signature
    const isValid = verifySignature(
      order_id,
      status_code,
      gross_amount,
      signature_key,
    );

    if (!isValid) {
      console.error("Invalid signature for order:", order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Find payment
    const payment = await db.payment.findFirst({
      where: { orderId: order_id },
    });

    if (!payment) {
      console.error("Payment not found:", order_id);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Normalize status
    const normalized = normalizeMidtransStatus(transaction_status, fraud_status);

    // Skip if status hasn't changed
    if (normalized === payment.status) {
      return NextResponse.json({ message: "Status unchanged" });
    }

    // Update payment and credits in transaction
    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: normalized,
          paidAt: normalized === "paid" ? new Date() : null,
        },
      });

      if (normalized === "paid" && payment.status !== "paid") {
        await tx.user.update({
          where: { id: payment.userId },
          data: {
            credits: { increment: payment.creditsPurchased },
          },
        });
      }
    });

    console.log(`Payment ${order_id} updated to ${normalized}`);

    return NextResponse.json({
      message: "Webhook processed successfully",
      status: normalized,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
