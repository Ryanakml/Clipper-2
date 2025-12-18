import type { VariantProps } from "class-variance-authority";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createMidtransTransaction,
  type PaymentStatus,
  type PriceId,
  syncUserPayments,
} from "~/actions/midtrans";
import { Button } from "~/components/ui/button";
import type { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: VariantProps<typeof buttonVariants>["variant"];
  isPopular?: boolean;
  savePercentage?: string;
  priceId: PriceId;
}

const statusColors: Record<PaymentStatus, string> = {
  paid: "bg-green-100 text-green-700 ring-1 ring-green-200",
  pending: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  failed: "bg-red-100 text-red-700 ring-1 ring-red-200",
  expired: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

const plans: PricingPlan[] = [
  {
    title: "Small Pack",
    price: "Rp150.000",
    description: "Paket hemat untuk coba-coba atau user baru",
    features: ["50 credits", "Tidak ada masa kadaluarsa", "Pembayaran aman via Midtrans"],
    buttonText: "Bayar dengan Midtrans",
    buttonVariant: "outline",
    priceId: "small",
  },
  {
    title: "Medium Pack",
    price: "Rp399.000",
    description: "Nilai terbaik untuk podcaster reguler",
    features: ["150 credits", "Tidak ada masa kadaluarsa", "Pembayaran aman via Midtrans"],
    buttonText: "Bayar dengan Midtrans",
    buttonVariant: "default",
    isPopular: true,
    savePercentage: "Hemat lebih banyak",
    priceId: "medium",
  },
  {
    title: "Large Pack",
    price: "Rp1.199.000",
    description: "Untuk studio atau agensi yang butuh banyak quota",
    features: ["500 credits", "Tidak ada masa kadaluarsa", "Pembayaran aman via Midtrans"],
    buttonText: "Bayar dengan Midtrans",
    buttonVariant: "outline",
    isPopular: false,
    savePercentage: "Bonus terbanyak",
    priceId: "large",
  },
];

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        plan.isPopular && "border-primary border-2",
      )}
    >
      {plan.isPopular && (
        <div className="bg-primary text-primary-foreground absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap">
          Most Popular
        </div>
      )}
      <CardHeader className="flex-1">
        <CardTitle>{plan.title}</CardTitle>
        <div className="text-4xl font-bold">{plan.price} </div>
        {plan.savePercentage && (
          <p className="text-sm font-medium text-green-600">
            {plan.savePercentage}
          </p>
        )}
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="text-muted-foreground space-y-2 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckIcon className="text-primary size-4" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <form
          action={createMidtransTransaction.bind(null, plan.priceId)}
          className="w-full"
        >
          <Button variant={plan.buttonVariant} className="w-full" type="submit">
            {plan.buttonText}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

function PaymentStatusPill({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        statusColors[status],
      )}
    >
      {status === "paid" ? "Berhasil" : status === "pending" ? "Pending" : status === "expired" ? "Expired" : "Gagal"}
    </span>
  );
}

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

  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto flex flex-col space-y-8 px-4 py-12">
      <div className="relative flex items-center justify-center gap-4">
        <Button
          className="absolute top-0 left-0"
          variant="outline"
          size="icon"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Top up credits via Midtrans
          </h1>
          <p className="text-muted-foreground">
            Pembayaran diproses lewat Midtrans Snap (sandbox). Setelah selesai,
            kamu akan diarahkan kembali ke dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.title} plan={plan} />
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="mb-4 text-lg font-semibold">How credits work</h3>
        <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
          <li>1 credit = 1 menit processing podcast</li>
          <li>Kira-kira 1 clip per 5 menit audio/video</li>
          <li>Credits tidak pernah kadaluarsa</li>
          <li>Durasi lebih panjang akan mengurangi credits lebih banyak</li>
          <li>Pembelian ini one-time, bukan langganan</li>
        </ul>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Riwayat pembayaran</h3>
          <span className="text-xs text-muted-foreground">
            Menampilkan 10 transaksi terakhir
          </span>
        </div>

        {payments.length === 0 ? (
          <p className="text-muted-foreground mt-3 text-sm">
            Belum ada transaksi. Lakukan pembayaran pertama kamu untuk melihat
            riwayat di sini.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border-border bg-background/50 flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {payment.creditsPurchased} credits • Rp
                    {payment.amount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatter.format(payment.createdAt)} • {payment.orderId}
                  </p>
                </div>
                <PaymentStatusPill status={payment.status as PaymentStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
