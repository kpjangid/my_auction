"use client";

import { useMemo, useState } from "react";
import { Team } from "../services/types";
import { BidInput } from "./bid-input";

export function AuctionPanel({
  auctionId,
  highestBid,
  highestBidderId,
  teams,
  onBid,
  onEnd
}: {
  auctionId: string | null;
  highestBid: number;
  highestBidderId: string | null;
  teams: Team[];
  onBid: (payload: { teamId: string; amount: number }) => Promise<void>;
  onEnd: () => Promise<void>;
}): JSX.Element {
  const [teamId, setTeamId] = useState("");

  const leadingTeam = useMemo(() => teams.find((team) => team.id === highestBidderId)?.name || "No bids yet", [highestBidderId, teams]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">Live Auction</h2>
      <p className="mt-2 text-sm text-slate-300">Auction ID: {auctionId || "Not started"}</p>
      <p className="mt-1 text-lg text-emerald-300">Highest Bid: {highestBid}</p>
      <p className="text-sm text-slate-200">Leading Team: {leadingTeam}</p>

      <div className="mt-4">
        <select
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
          value={teamId}
          onChange={(event) => setTeamId(event.target.value)}
        >
          <option value="">Select team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name} (Balance: {team.remainingCredit})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <BidInput
          disabled={!auctionId || !teamId}
          onBid={(amount) => onBid({ teamId, amount })}
        />
      </div>

      <button
        onClick={onEnd}
        disabled={!auctionId}
        className="mt-4 rounded bg-rose-600 px-4 py-2 font-medium disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        End Auction
      </button>
    </div>
  );
}
