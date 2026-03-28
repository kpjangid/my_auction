"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AuctionPanel } from "../../components/auction-panel";
import { api } from "../../services/api";
import { useAuctionStore } from "../../store/auction-store";
import { useSocket } from "../../hooks/use-socket";

export default function AuctionPage(): JSX.Element {
  const queryClient = useQueryClient();
  useSocket();

  const [playerId, setPlayerId] = useState("");
  const liveAuctionId = useAuctionStore((state) => state.liveAuctionId);
  const highestBid = useAuctionStore((state) => state.highestBid);
  const highestBidderId = useAuctionStore((state) => state.highestBidderId);
  const winnerTeamId = useAuctionStore((state) => state.winnerTeamId);
  const setAuction = useAuctionStore((state) => state.setAuction);

  const teamsQuery = useQuery({ queryKey: ["teams"], queryFn: api.getTeams });
  const playersQuery = useQuery({ queryKey: ["players"], queryFn: () => api.getPlayers({ status: "UNSOLD" }) });

  const startAuctionMutation = useMutation({
    mutationFn: api.startAuction,
    onSuccess: (auction) => {
      setAuction({
        auctionId: auction.id,
        highestBid: auction.currentBid,
        highestBidderId: auction.highestBidderId
      });
    }
  });

  const bidMutation = useMutation({
    mutationFn: api.placeBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    }
  });

  const endAuctionMutation = useMutation({
    mutationFn: api.endAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
    }
  });

  const winnerName = useMemo(
    () => teamsQuery.data?.find((team) => team.id === winnerTeamId)?.name || null,
    [teamsQuery.data, winnerTeamId]
  );

  return (
    <section>
      <h1 className="text-2xl font-bold">Live Auction</h1>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">Start Auction</h2>
          <select
            className="mt-3 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={playerId}
            onChange={(event) => setPlayerId(event.target.value)}
          >
            <option value="">Select player</option>
            {playersQuery.data?.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.basePrice})
              </option>
            ))}
          </select>
          <button
            className="mt-3 rounded bg-emerald-600 px-4 py-2"
            disabled={!playerId}
            onClick={() => startAuctionMutation.mutate(playerId)}
          >
            Start
          </button>
        </div>

        <AuctionPanel
          auctionId={liveAuctionId}
          highestBid={highestBid}
          highestBidderId={highestBidderId}
          teams={teamsQuery.data || []}
          onBid={async ({ teamId, amount }) => {
            if (!liveAuctionId) return;
            await bidMutation.mutateAsync({ auctionId: liveAuctionId, teamId, amount });
          }}
          onEnd={async () => {
            if (!liveAuctionId) return;
            await endAuctionMutation.mutateAsync(liveAuctionId);
          }}
        />
      </div>

      {winnerName && (
        <p className="mt-5 rounded bg-emerald-500/20 p-3 text-emerald-200">
          Winner announced: {winnerName}
        </p>
      )}
    </section>
  );
}
