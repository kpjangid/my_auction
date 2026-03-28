"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PlayerCard } from "../../components/player-card";
import { api } from "../../services/api";

type StatusFilter = "ALL" | "SOLD" | "UNSOLD";
type CategoryFilter = "ALL" | "A" | "B" | "C";

export default function PlayersPage(): JSX.Element {
  const queryClient = useQueryClient();

  // ── Form state ──────────────────────────────────────────
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"A" | "B" | "C">("A");
  const [role, setRole] = useState("");
  const [basePrice, setBasePrice] = useState(100);

  // ── Filter / search state ────────────────────────────────
  const [search, setSearch] = useState("e");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");

  // ── Pagination state ─────────────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── Data fetching ────────────────────────────────────────
  // Always fetch all players on mount; pass search only when non-empty
  const playersQuery = useQuery({
    queryKey: ["players", search],
    queryFn: () => api.getPlayers({ search: search || undefined }),
  });

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: api.getTeams,
  });

  const createPlayerMutation = useMutation({
    mutationFn: api.createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setName("");
      setRole("");
      setBasePrice(100);
    },
  });

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [search, pageSize, statusFilter, categoryFilter]);

  // ── Derived data ─────────────────────────────────────────
  const teamIdToName = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teamsQuery.data || []) {
      map.set(team.id, team.name);
    }
    return map;
  }, [teamsQuery.data]);

  // Apply client-side filters on top of the server search result
  const filteredPlayers = useMemo(() => {
    let list = playersQuery.data || [];

    if (statusFilter !== "ALL") {
      list = list.filter((p) => p.status === statusFilter);
    }

    if (categoryFilter !== "ALL") {
      list = list.filter((p) => p.category === categoryFilter);
    }

    return list;
  }, [playersQuery.data, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(start, start + pageSize);
  }, [filteredPlayers, currentPage, pageSize]);

  function onSubmit(event: FormEvent): void {
    event.preventDefault();
    createPlayerMutation.mutate({ name, category, basePrice, role });
  }

  // ── Status filter button helper ──────────────────────────
  function StatusBtn({ value, label }: { value: StatusFilter; label: string }) {
    const active = statusFilter === value;
    const colors: Record<StatusFilter, string> = {
      ALL:    active ? "bg-slate-600 text-white"          : "bg-slate-800 text-slate-400 hover:bg-slate-700",
      UNSOLD: active ? "bg-sky-600 text-white"            : "bg-slate-800 text-slate-400 hover:bg-slate-700",
      SOLD:   active ? "bg-emerald-600 text-white"        : "bg-slate-800 text-slate-400 hover:bg-slate-700",
    };
    return (
      <button
        type="button"
        onClick={() => setStatusFilter(value)}
        className={`rounded px-3 py-1 text-sm font-medium transition-colors ${colors[value]}`}
      >
        {label}
      </button>
    );
  }

  // ── Category filter button helper ────────────────────────
  function CatBtn({ value }: { value: CategoryFilter }) {
    const active = categoryFilter === value;
    return (
      <button
        type="button"
        onClick={() => setCategoryFilter(value)}
        className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
          active
            ? "bg-violet-600 text-white"
            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
        }`}
      >
        {value === "ALL" ? "All" : `Cat ${value}`}
      </button>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">Players</h1>

      {/* ── Add player form ── */}
      <form
        onSubmit={onSubmit}
        className="mt-4 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-5"
      >
        <input
          className="rounded border border-slate-700 bg-slate-950 p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="rounded border border-slate-700 bg-slate-950 p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value as "A" | "B" | "C")}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <input
          className="rounded border border-slate-700 bg-slate-950 p-2"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="number"
          className="rounded border border-slate-700 bg-slate-950 p-2"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
        />
        <button className="rounded bg-sky-600 px-4 py-2">Add Player</button>
      </form>

      {/* ── Search + Filters bar ── */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
        {/* Search */}
        <input
          className="w-full rounded border border-slate-700 bg-slate-950 p-2"
          placeholder="Search players by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mr-1">Status</span>
            <StatusBtn value="ALL"    label="All"    />
            <StatusBtn value="UNSOLD" label="Unsold" />
            <StatusBtn value="SOLD"   label="Sold"   />
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-700" />

          {/* Category filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mr-1">Category</span>
            <CatBtn value="ALL" />
            <CatBtn value="A" />
            <CatBtn value="B" />
            <CatBtn value="C" />
          </div>

          {/* Active filter summary */}
          {(statusFilter !== "ALL" || categoryFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => { setStatusFilter("ALL"); setCategoryFilter("ALL"); }}
              className="ml-auto text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Results count + pagination controls ── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm">
        <div className="text-slate-300">
          Showing{" "}
          <span className="font-semibold text-slate-100">{filteredPlayers.length}</span>{" "}
          {filteredPlayers.length !== (playersQuery.data || []).length && (
            <span className="text-slate-500">
              of {(playersQuery.data || []).length}{" "}
            </span>
          )}
          players
        </div>

        <div className="flex items-center gap-3">
          <label className="text-slate-300">
            Page size{" "}
            <select
              className="ml-2 rounded border border-slate-700 bg-slate-950 px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded bg-slate-800 px-3 py-1 disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="text-slate-200">
              Page <span className="font-semibold">{currentPage}</span> / {totalPages}
            </span>
            <button
              type="button"
              className="rounded bg-slate-800 px-3 py-1 disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Player grid ── */}
      {playersQuery.isLoading ? (
        <p className="mt-8 text-center text-slate-400">Loading players…</p>
      ) : pagedPlayers.length === 0 ? (
        <p className="mt-8 text-center text-slate-400">
          No players match the current filters.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {pagedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              soldToTeamName={player.teamId ? teamIdToName.get(player.teamId) ?? null : null}
            />
          ))}
        </div>
      )}
    </section>
  );
}