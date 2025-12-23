import type { VariantProps } from "class-variance-authority";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import Link from "next/link";

import {
  createMidtransTransaction,
  type PaymentStatus,
  type PriceId,
} from "~/actions/midtrans";
import { Badge } from "~/components/ui/badge";
import { Button, type buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

type PricingPlan = {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: VariantProps<typeof buttonVariants>["variant"];
  isPopular?: boolean;
  savePercentage?: string;
  priceId: PriceId;
};

type BillingPayment = {
  id: string;
  creditsPurchased: number;
  amount: number;
  orderId: string;
  status: PaymentStatus | string;
  createdAt: Date;
};

const plans: PricingPlan[] = [
  {
    title: "Small Pack",
    price: "Rp15.000",
    description: "Paket hemat untuk coba-coba atau user baru",
    features: [
      "50 credits",
      "Tidak ada masa kadaluarsa",
      "Pembayaran aman via Midtrans",
    ],
    buttonText: "Bayar dengan Midtrans",
    buttonVariant: "outline",
    priceId: "small",
  },
  {
    title: "Medium Pack",
    price: "Rp39.000",
    description: "Nilai terbaik untuk podcaster reguler",
    features: [
      "150 credits",
      "Tidak ada masa kadaluarsa",
      "Pembayaran aman via Midtrans",
    ],
    buttonText: "Bayar dengan Midtrans",
    buttonVariant: "default",
    isPopular: true,
    savePercentage: "Hemat lebih banyak",
    priceId: "medium",
  },
  {
    title: "Large Pack",
    price: "Rp119.000",
    description: "Untuk studio atau agensi yang butuh banyak quota",
    features: [
      "500 credits",
      "Tidak ada masa kadaluarsa",
      "Pembayaran aman via Midtrans",
    ],
    buttonText: "Bayar dengan Midtrans",
    buttonVariant: "outline",
    isPopular: false,
    savePercentage: "Bonus terbanyak",
    priceId: "large",
  },
];

export function BillingContent({ payments }: { payments: BillingPayment[] }) {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Credits & top up
          </h1>
          <p className="text-muted-foreground text-sm">
            Beli credits lewat Midtrans Snap. Pembayaran satu kali, bukan
            langganan otomatis.
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-2 size-4" />
            Kembali ke dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Paket credits</CardTitle>
          <CardDescription>
            Pilih paket sesuai kebutuhan. Credits tidak pernah kadaluarsa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.title} plan={plan} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cara kerja credits</CardTitle>
          <CardDescription>
            Ringkasan singkat supaya kamu tahu apa yang dibeli.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            <li>1 credit = 1 menit pemrosesan podcast</li>
            <li>Kurang lebih 1 clip per 5 menit audio/video</li>
            <li>Credits tidak pernah kadaluarsa</li>
            <li>Durasi lebih panjang akan mengurangi credits lebih banyak</li>
            <li>Pembelian ini one-time, bukan langganan</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle>Riwayat pembayaran</CardTitle>
            <CardDescription>10 transaksi terakhir kamu.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Belum ada transaksi. Lakukan pembayaran pertama untuk melihat
              riwayat di sini.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pembelian</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.creditsPurchased} credits · Rp
                        {payment.amount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.orderId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatter.format(payment.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{plan.title}</CardTitle>
          {plan.isPopular ? (
            <Badge variant="secondary" className="px-2.5">
              Best value
            </Badge>
          ) : null}
        </div>
        <div className="text-3xl font-semibold">{plan.price}</div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          Termasuk
        </p>
        <ul className="space-y-2 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckIcon className="text-muted-foreground size-4" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-0">
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

function PaymentStatusBadge({ status }: { status: PaymentStatus | string }) {
  const normalized = (status ?? "pending") as PaymentStatus;

  const copy =
    normalized === "paid"
      ? "Berhasil"
      : normalized === "pending"
        ? "Pending"
        : normalized === "expired"
          ? "Expired"
          : "Gagal";

  const tone: Record<PaymentStatus, string> = {
    paid: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    expired: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", tone[normalized] ?? tone.pending)}
    >
      {copy}
    </Badge>
  );
}
