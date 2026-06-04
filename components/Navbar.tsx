"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { connected } = useWallet();
  const pathname = usePathname();

  if (!connected) return null;

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/notes", label: "My Notes" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold text-foreground transition-colors hover:text-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              N
            </span>
            Notes DApp
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-card-hover hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <WalletMultiButton />
      </div>
    </nav>
  );
}
