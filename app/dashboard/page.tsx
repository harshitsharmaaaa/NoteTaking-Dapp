"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import Link from "next/link";

export default function Dashboard() {
  const wallet = useWallet();
  const router = useRouter();
  const { loadNotes } = useNotes();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet.connected) {
      router.push("/");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const result = await loadNotes();
        setNotes(result);
      } catch {
        console.error("Failed to load notes");
      }
      setLoading(false);
    })();
  }, [wallet.connected, router, loadNotes]);

  const truncatedAddress = wallet.publicKey
    ? `${wallet.publicKey.toBase58().slice(0, 4)}...${wallet.publicKey.toBase58().slice(-4)}`
    : "";

  const recentNotes = notes
    .sort(
      (a, b) => b.account.lastUpdated.toNumber() - a.account.lastUpdated.toNumber(),
    )
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back
            </h1>
            <p className="mt-1 text-muted-foreground">
              Connected as{" "}
              <span className="font-mono text-sm text-primary">
                {truncatedAddress}
              </span>
            </p>
          </div>
          <Link
            href="/notes"
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover"
          >
            + New Note
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-border-hover">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? (
                    <span className="inline-block h-6 w-12 animate-pulse rounded bg-card-hover" />
                  ) : (
                    notes.length
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-border-hover">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Activity</p>
                <p className="text-sm font-medium text-foreground">
                  {loading
                    ? "Loading..."
                    : notes.length > 0
                      ? new Date(
                          Math.max(
                            ...notes.map((n) =>
                              n.account.lastUpdated.toNumber(),
                            ),
                          ) * 1000,
                        ).toLocaleDateString()
                      : "No activity"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-border-hover sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-sm font-medium text-foreground">
                  Solana Devnet
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Notes
            </h2>
            {notes.length > 0 && (
              <Link
                href="/notes"
                className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                View all →
              </Link>
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-xl border border-border bg-card p-5"
                  >
                    <div className="mb-3 h-5 w-3/4 rounded bg-card-hover" />
                    <div className="h-4 w-1/2 rounded bg-card-hover" />
                  </div>
                ))
              : recentNotes.length > 0
                ? recentNotes.map((note: any) => (
                    <Link
                      key={note.publicKey.toBase58()}
                      href="/notes"
                      className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-border-hover hover:bg-card-hover"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {note.account.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {note.account.content}
                      </p>
                      <p className="mt-3 text-xs text-muted">
                        Updated{" "}
                        {new Date(
                          note.account.lastUpdated.toNumber() * 1000,
                        ).toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                : !loading && (
                    <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
                      <p className="text-muted-foreground">
                        No notes yet. Create your first note to get started!
                      </p>
                      <Link
                        href="/notes"
                        className="mt-4 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover"
                      >
                        Create Note
                      </Link>
                    </div>
                  )}
          </div>
        </div>
      </div>
    </div>
  );
}
