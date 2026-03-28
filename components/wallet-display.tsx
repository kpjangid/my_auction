export function WalletDisplay({
  total,
  used,
  remaining
}: {
  total: number;
  used: number;
  remaining: number;
}): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div className="rounded bg-slate-800 p-2">Total: {total}</div>
      <div className="rounded bg-slate-800 p-2">Used: {used}</div>
      <div className="rounded bg-slate-800 p-2 text-emerald-300">Remain: {remaining}</div>
    </div>
  );
}
