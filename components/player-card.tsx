import { Player } from "../services/types";

export function PlayerCard({
  player,
  soldToTeamName
}: {
  player: Player;
  soldToTeamName?: string | null;
}): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{player.name}</h3>
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            player.status === "SOLD" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
          }`}
        >
          {player.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-300">Category: {player.category}</p>
      <p className="text-sm text-slate-300">Role: {player.role || "N/A"}</p>
      <p className="text-sm font-medium text-sky-300">Base Price: {player.basePrice}</p>
      {player.status === "SOLD" && (
        <p className="mt-2 text-sm text-emerald-200">
          Sold to: <span className="font-semibold">{soldToTeamName || "Unknown team"}</span>
        </p>
      )}
    </div>
  );
}
