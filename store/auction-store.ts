"use client";

import { create } from "zustand";

interface AuctionStore {
  liveAuctionId: string | null;
  highestBid: number;
  highestBidderId: string | null;
  winnerTeamId: string | null;
  setAuction: (payload: { auctionId: string; highestBid: number; highestBidderId: string | null }) => void;
  setWinner: (teamId: string | null) => void;
}

export const useAuctionStore = create<AuctionStore>((set) => ({
  liveAuctionId: null,
  highestBid: 0,
  highestBidderId: null,
  winnerTeamId: null,
  setAuction: (payload) =>
    set({
      liveAuctionId: payload.auctionId,
      highestBid: payload.highestBid,
      highestBidderId: payload.highestBidderId,
      winnerTeamId: null
    }),
  setWinner: (teamId) => set({ winnerTeamId: teamId })
}));
