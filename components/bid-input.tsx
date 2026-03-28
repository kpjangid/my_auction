"use client";

import { useState } from "react";

export function BidInput({
  onBid,
  disabled
}: {
  onBid: (amount: number) => Promise<void>;
  disabled?: boolean;
}): JSX.Element {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function submitBid(): Promise<void> {
    setLoading(true);
    try {
      await onBid(amount);
      setAmount(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="number"
        className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
        placeholder="Bid amount"
      />
      <button
        onClick={submitBid}
        disabled={disabled || loading || amount <= 0}
        className="rounded bg-sky-600 px-4 py-2 font-medium disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {loading ? "Placing..." : "Bid"}
      </button>
    </div>
  );
}
