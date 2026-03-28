export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  totalCredit: number;
  usedCredit: number;
  remainingCredit: number;
}

export interface Player {
  id: string;
  name: string;
  category: "A" | "B" | "C";
  basePrice: number;
  role?: string;
  status: "UNSOLD" | "SOLD";
  teamId: string | null;
}

export interface Auction {
  id: string;
  playerId: string;
  currentBid: number;
  highestBidderId: string | null;
  status: "ONGOING" | "COMPLETED";
}
