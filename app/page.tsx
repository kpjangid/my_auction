import Link from "next/link";

export default function DashboardPage(): JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Player Auction Dashboard</h1>
      <p className="text-slate-300">Manage teams, players, wallets, and live bidding in one place.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/teams" className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          Teams
        </Link>
        <Link href="/players" className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          Players
        </Link>
        <Link href="/auction" className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          Live Auction
        </Link>
      </div>
    </section>
  );
}
