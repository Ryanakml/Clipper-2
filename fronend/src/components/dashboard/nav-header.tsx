"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { signOut } from "next-auth/react";
import AppThemeSwitcher from "../theme-switcher";

const NavHeader = ({ credits, email }: { credits: number; email: string }) => {
  return (
    <header className="sticky top-0 z-10 flex justify-center border-b border-white/[0.08] bg-[#0d0d14]/90 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between px-4 py-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-[10px] bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-lg shadow-violet-500/25">
            <Scissors className="size-4 text-slate-950" strokeWidth={2.8} />
          </div>
          <div className="font-sans text-lg font-semibold tracking-[-0.04em] text-white">
            clipper<span className="text-violet-300">.ai</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <AppThemeSwitcher />

            <Badge
              variant="secondary"
              className="h-8 border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200"
            >
              {credits} credits
            </Badge>

            {/* <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs font-medium"
            >
              <Link href="/dashboard/billing">Buy Credits</Link>
            </Button> */}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
              >
                <Avatar>
                  <AvatarFallback>{email.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p className="text-muted-foreground text-xs">{email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">Tagihan</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ redirectTo: "/" })}
                className="text-destructive cursor-pointer"
              >
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;
