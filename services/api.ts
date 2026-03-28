import { Auction, Player, Team } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(payload.message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTeams: () => request<Team[]>("/teams"),
  createTeam: (payload: { name: string; logoUrl: string; totalCredit: number }) =>
    request<Team>("/teams", { method: "POST", body: JSON.stringify(payload) }),
  getPlayers: (params?: { status?: string; category?: string; search?: string }) => {
    const search = new URLSearchParams(params as Record<string, string>).toString();
    return request<Player[]>(`/players${search ? `?${search}` : ""}`);
  },
  createPlayer: (payload: { name: string; category: string; basePrice: number; role?: string }) =>
    request<Player>("/players", { method: "POST", body: JSON.stringify(payload) }),
  startAuction: (playerId: string) =>
    request<Auction>("/auction/start", { method: "POST", body: JSON.stringify({ playerId }) }),
  placeBid: (payload: { auctionId: string; teamId: string; amount: number }) =>
    request("/auction/bid", { method: "POST", body: JSON.stringify(payload) }),
  endAuction: (auctionId: string) =>
    request("/auction/end", { method: "POST", body: JSON.stringify({ auctionId }) }),
  getAuction: (auctionId: string) => request<{ auction: Auction }>("/auction/" + auctionId)
};
