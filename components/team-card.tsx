import { Team } from "../services/types";
import { WalletDisplay } from "./wallet-display";

export function TeamCard({ team }: { team: Team }): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-2 flex items-center gap-3">
        {team.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={team.logoUrl} alt={team.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-700" />
        )}
        <h3 className="text-lg font-semibold">{team.name}</h3>
      </div>
      <WalletDisplay total={team.totalCredit} used={team.usedCredit} remaining={team.remainingCredit} />
    </div>
  );
}
