"use client";

import { useEffect, useState } from "react";
import { supabase, Checkin } from "@/lib/supabase";

export default function AdminPage() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCheckins() {
    setLoading(true);
    const { data } = await supabase
      .from("checkins")
      .select("*")
      .order("criado_em", { ascending: false });
    setCheckins(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCheckins();
    const channel = supabase
      .channel("checkins-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "checkins" }, (payload) => {
        setCheckins((prev) => [payload.new as Checkin, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const vagas = 40;
  const ocupadas = checkins.length;
  const livres = Math.max(0, vagas - ocupadas);
  const pct = Math.min(100, (ocupadas / vagas) * 100);

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: "#0d1117" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#e8470a] text-xs font-bold uppercase tracking-widest mb-1">Painel Admin</p>
            <h1 className="text-white text-2xl font-bold">AI Night · Check-ins</h1>
            <p className="text-gray-400 text-sm">6 de maio de 2026 · 18h · DO IT Hub</p>
          </div>
          <button onClick={fetchCheckins}
            className="text-xs text-gray-400 border border-gray-700 rounded-lg px-3 py-2 hover:border-[#e8470a] hover:text-white transition-all">
            ↻ Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Confirmados", value: ocupadas, color: "#e8470a" },
            { label: "Vagas livres", value: livres, color: "#22c55e" },
            { label: "Total vagas", value: vagas, color: "#6b7280" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background: "#161b22", border: "1px solid #21262d" }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="rounded-xl p-4 mb-6" style={{ background: "#161b22", border: "1px solid #21262d" }}>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Ocupação</span>
            <span>{pct.toFixed(0)}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "#21262d" }}>
            <div className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: pct >= 90 ? "#ef4444" : "#e8470a" }} />
          </div>
        </div>

        {/* List */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #21262d" }}>
          <div className="px-4 py-3 grid grid-cols-12 text-[10px] uppercase tracking-widest text-gray-500"
            style={{ background: "#161b22", borderBottom: "1px solid #21262d" }}>
            <span className="col-span-1">#</span>
            <span className="col-span-5">Nome</span>
            <span className="col-span-4">Telefone</span>
            <span className="col-span-2 text-right">Horário</span>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm" style={{ background: "#0d1117" }}>
              Carregando...
            </div>
          ) : checkins.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm" style={{ background: "#0d1117" }}>
              Nenhum check-in ainda.
            </div>
          ) : (
            checkins.map((c, i) => (
              <div key={c.id}
                className="px-4 py-3 grid grid-cols-12 text-sm items-center"
                style={{
                  background: i % 2 === 0 ? "#0d1117" : "#0f1318",
                  borderBottom: "1px solid #21262d",
                }}>
                <span className="col-span-1 text-gray-500 text-xs">{ocupadas - i}</span>
                <span className="col-span-5 text-white font-medium truncate">{c.nome}</span>
                <span className="col-span-4 text-gray-400 text-xs">{c.telefone}</span>
                <span className="col-span-2 text-right text-gray-500 text-xs">
                  {new Date(c.criado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Atualização em tempo real via Supabase Realtime
        </p>
      </div>
    </main>
  );
}
