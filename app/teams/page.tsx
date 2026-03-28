"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { TeamCard } from "../../components/team-card";
import { api } from "../../services/api";

export default function TeamsPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [totalCredit, setTotalCredit] = useState(1000);

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: api.getTeams
  });

  const createTeamMutation = useMutation({
    mutationFn: api.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setName("");
      setLogoUrl("");
      setTotalCredit(1000);
    }
  });

  function onSubmit(event: FormEvent): void {
    event.preventDefault();
    createTeamMutation.mutate({ name, logoUrl, totalCredit });
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">Teams</h1>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-4">
        <input className="rounded border border-slate-700 bg-slate-950 p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded border border-slate-700 bg-slate-950 p-2" placeholder="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
        <input
          className="rounded border border-slate-700 bg-slate-950 p-2"
          type="number"
          placeholder="Wallet"
          value={totalCredit}
          onChange={(e) => setTotalCredit(Number(e.target.value))}
        />
        <button className="rounded bg-sky-600 px-4 py-2">Create Team</button>
      </form>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {teamsQuery.data?.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </section>
  );
}
