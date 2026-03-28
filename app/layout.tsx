import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "Player Auction System",
  description: "Live player auction management"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="mx-auto min-h-screen max-w-6xl p-6">
            <nav className="mb-6 flex gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
              <Link href="/">Dashboard</Link>
              <Link href="/teams">Teams</Link>
              <Link href="/players">Players</Link>
              <Link href="/auction">Auction</Link>
            </nav>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
