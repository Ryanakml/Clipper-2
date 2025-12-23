import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import NavHeader from "~/components/dashboard/nav-header";
import { Toaster } from "~/components/ui/sonner";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, email: true },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col" suppressHydrationWarning>
      <NavHeader credits={user.credits} email={user.email} />
      <main className="container mx-auto flex-1 py-6">{children}</main>
      <Toaster />
    </div>
  );
}
