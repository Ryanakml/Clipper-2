import { redirect } from "next/navigation";
import { syncUserPayments } from "~/actions/midtrans";
import { BillingContent } from "~/components/dashboard/billing";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await syncUserPayments(session.user.id);

  const payments = await db.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return <BillingContent payments={payments} />;
}
