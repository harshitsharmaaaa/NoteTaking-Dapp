"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: "Create Notes",
    desc: "Write and store notes on the Solana blockchain — immutable and always accessible.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "You Own It",
    desc: "Only your wallet controls your notes. No servers, no third parties, no compromises.",
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Lightning Fast",
    desc: "Powered by Solana's high-performance blockchain for near-instant transaction confirmations.",
    gradient: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
];

const techBadges = ["Solana", "Anchor", "React", "Next.js", "TypeScript", "Rust"];

export default function Home() {
  const wallet = useWallet();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fullText = "Your notes, powered by the Solana blockchain.";

  useEffect(() => {
    if (wallet.connected) {
      router.push("/dashboard");
    }
  }, [wallet.connected, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 35);
    const cursorInterval = setInterval(() => {
      setShowCursor((c) => !c);
    }, 530);
    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [mounted]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Deep space gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_100%,rgba(139,92,246,0.08),transparent)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_0%_100%,rgba(59,130,246,0.06),transparent)]" />

      {/* Grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glowing orbs with parallax */}
      <div
        className="pointer-events-none fixed -top-48 -right-48 h-[500px] w-[500px] animate-breathe rounded-full bg-primary/10 blur-[120px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
        }}
      />
      <div
        className="pointer-events-none fixed -bottom-48 -left-48 h-[400px] w-[400px] animate-breathe rounded-full bg-secondary/10 blur-[100px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
          animationDelay: "2s",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-1/3 right-1/4 h-[300px] w-[300px] animate-breathe rounded-full bg-blue-500/8 blur-[80px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * 10}px)`,
          animationDelay: "4s",
        }}
      />

      {/* Floating geometric shapes */}
      <div
        className="pointer-events-none fixed top-[15%] left-[8%] h-16 w-16 animate-spin-slow rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm"
        style={{ animationDuration: "30s" }}
      />
      <div
        className="pointer-events-none fixed top-[25%] right-[12%] h-12 w-12 animate-spin-slower rounded-full border border-secondary/20 bg-secondary/5 backdrop-blur-sm"
        style={{ animationDuration: "25s" }}
      />
      <div
        className="pointer-events-none fixed bottom-[30%] left-[15%] h-10 w-10 animate-spin-slow rounded-lg border border-blue-400/20 bg-blue-400/5 backdrop-blur-sm"
        style={{ animationDuration: "20s", transform: "rotate(45deg)" }}
      />
      <div
        className="pointer-events-none fixed bottom-[20%] right-[20%] h-14 w-14 animate-spin-slower rounded-2xl border border-purple-400/20 bg-purple-400/5 backdrop-blur-sm"
        style={{ animationDuration: "35s" }}
      />
      <div
        className="pointer-events-none fixed top-[50%] left-[5%] h-8 w-8 animate-spin-slow rounded-full border border-violet-400/20 bg-violet-400/5 backdrop-blur-sm"
        style={{ animationDuration: "18s" }}
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-20">
        {/* Logo with glow */}
        <div
          className="animate-reveal"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          <div className="group relative mb-6">
            <div className="absolute -inset-4 animate-ping-slow rounded-2xl bg-primary/20" />
            <div className="absolute -inset-2 animate-pulse-glow rounded-2xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-4xl font-bold text-white shadow-2xl shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50">
              N
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* Title with staggered letter reveal */}
        <h1 className="animate-reveal text-center text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <span className="inline-block">
            {"Notes ".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-[letter-in_0.6s_ease-out_both]"
                style={{ animationDelay: `${0.5 + i * 0.06}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          {"DApp".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block animate-[letter-in_0.6s_ease-out_both]"
              style={{ animationDelay: `${0.86 + i * 0.06}s` }}
            >
              {char}
            </span>
          ))}
          </span>
          <span className="inline-block bg-gradient-to-r from-primary via-secondary to-blue-400 bg-clip-text text-transparent"
            style={{ backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }}
          >
          </span>
        </h1>

        {/* Tagline */}
        <div
          className="mt-2 flex flex-wrap items-center justify-center gap-2"
          style={{ animation: "fade-in 0.8s ease-out both", animationDelay: "1.2s" }}
        >
          {["Decentralized", "Secure", "On-Chain"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Typewriter subtitle */}
        <p
          className="mt-6 h-7 max-w-lg text-center text-lg text-muted-foreground"
          style={{ animation: "fade-in 0.8s ease-out both", animationDelay: "1.5s" }}
        >
          {typedText}
          <span
            className={`ml-0.5 inline-block h-5 w-[2px] bg-primary align-text-bottom transition-opacity ${
              showCursor ? "opacity-100" : "opacity-0"
            }`}
          />
        </p>

        {/* CTA button */}
        <div
          style={{ animation: "reveal 0.8s ease-out both", animationDelay: "1.8s" }}
          className="relative mt-10"
        >
          <div className="absolute -inset-1 animate-ping-slow rounded-xl bg-primary/20" />
          <div className="absolute -inset-2 animate-pulse-glow rounded-xl" />
          <div className="relative">
            <WalletMultiButton />
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-20 flex items-center gap-4 text-xs uppercase tracking-widest text-muted"
          style={{ animation: "fade-in 0.8s ease-out both", animationDelay: "2.2s" }}
        >
          <div className="h-px w-12 bg-border" />
          <span>Why Notes DApp</span>
          <div className="h-px w-12 bg-border" />
        </div>

        {/* Feature cards */}
        <div className="mt-8 grid w-full gap-5 sm:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative animate-slide-up overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-border-hover hover:bg-card hover:shadow-2xl hover:shadow-primary/5"
              style={{
                animationDelay: `${2.5 + i * 0.2}s`,
                animationFillMode: "both",
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative z-10">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconColor} bg-background/50 ring-1 ring-border transition-all duration-500 group-hover:scale-110 group-hover:ring-primary/30`}
                >
                  <div className="transition-transform duration-500 group-hover:animate-[icon-bounce_0.6s_ease-in-out]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-foreground transition-colors duration-500 group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-muted-foreground/80">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack badges */}
        <div
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
          style={{ animation: "fade-in 1s ease-out both", animationDelay: "3.5s" }}
        >
          <span className="text-xs text-muted">Built with</span>
          {techBadges.map((badge, i) => (
            <span
              key={badge}
              className="animate-slide-up rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:text-primary"
              style={{ animationDelay: `${3.8 + i * 0.1}s`, animationFillMode: "both" }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Footer */}
        <p
          className="mt-12 text-xs text-muted"
          style={{ animation: "fade-in 1s ease-out both", animationDelay: "4.5s" }}
        >
          Connect your Phantom wallet to get started
        </p>
      </div>
    </div>
  );
}
