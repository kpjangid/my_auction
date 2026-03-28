"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuctionStore } from "../store/auction-store";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function useSocket(): void {
  const setAuction = useAuctionStore((state) => state.setAuction);
  const setWinner = useAuctionStore((state) => state.setWinner);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("auction:started", (auction) => {
      setAuction({
        auctionId: auction.id,
        highestBid: auction.currentBid,
        highestBidderId: auction.highestBidderId
      });
    });

    socket.on("auction:bidPlaced", (payload) => {
      setAuction({
        auctionId: payload.auctionId,
        highestBid: payload.currentBid,
        highestBidderId: payload.highestBidderId
      });
    });

    socket.on("auction:ended", (payload) => {
      setWinner(payload.winnerTeamId);
    });

    return () => {
      socket.disconnect();
    };
  }, [setAuction, setWinner]);
}
