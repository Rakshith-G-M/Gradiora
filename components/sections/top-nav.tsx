"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/onboarding", label: "Profile" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/interview", label: "Interview" },
  { href: "/report", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a18]/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold sm:text-base">
          <BrainCircuit className="h-5 w-5 text-secondary" />
          <span>Gradiora AI</span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-2 py-1.5 text-xs text-white/70 transition hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm",
                pathname === link.href && "bg-white/10 text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
