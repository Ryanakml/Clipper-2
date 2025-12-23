// components/theme-switcher.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-8 w-8"
      aria-label="Toggle theme"
    >
      <span className={mounted ? "" : "opacity-0"}>
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
    </Button>
  );
}
