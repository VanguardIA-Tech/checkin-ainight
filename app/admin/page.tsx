"use client";

export const dynamic = "force-dynamic";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCheckins();
    const channel = supabase
      .channel("checkins-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "checkins" },
        (payload) => {
          setCheckins((prev) => [payload.new as Checkin, ...prev]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const vagas = parseInt(process.env.NEXT_PUBLIC_MAX_VAGAS ?? "200");
  const ocupadas = checkins.length;
  const livres = Math.max(0, vagas - ocupadas);
  const pct = Math.min(100, (ocupadas / vagas) * 100);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[3px] mb-1"
              style={{ color: "var(--ai-cyan)" }}
            >
              Painel Admin
            </p>
            <h1
              className="text-white font-extrabold"
              style={{
                fontSize: 26,
                letterSpacing: 1,
              }}
            >
              AI Night · Check-ins
            </h1>
            <p className="text-sm" style={{ color: "var(--ai-muted)" }}>
              6 de maio de 2026 · 18h · DO IT Hub
            </p>
          </div>
          <button
            onClick={fetchCheckins}
            className="text-xs rounded-lg px-3 py-2 transition-all"
            style={{
              color: "var(--ai-muted)",
              border: "1px solid var(--ai-line)",
              background: "var(--ai-bg-glass)",
            }}
          >
            ↻ Atualizar
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Confirmados", value: ocupadas, color: "var(--ai-cyan)" },
            { label: "Vagas livres", value: livres, color: "var(--ai-gold)" },
            { label: "Total vagas", value: vagas, color: "var(--ai-muted)" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center backdrop-blur-md"
              style={{
                background: "var(--ai-bg-glass)",
                border: "1px solid var(--ai-line)",
              }}
            >
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p
                className="text-xs mt-1 uppercase tracking-[1.5px]"
                style={{ color: "var(--ai-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-4 mb-6 backdrop-blur-md"
          style={{
            background: "var(--ai-bg-glass)",
            border: "1px solid var(--ai-line)",
          }}
        >
          <div
            className="flex justify-between text-xs mb-2"
            style={{ color: "var(--ai-muted)" }}
          >
            <span className="uppercase tracking-[1.5px]">Ocupação</span>
            <span style={{ color: "var(--ai-cyan)", fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              {pct.toFixed(0)}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background:
                  pct >= 90
                    ? "linear-gradient(90deg, var(--ai-orange), #ef4444)"
                    : "linear-gradient(90deg, var(--ai-cyan), var(--ai-orange))",
              }}
            />
          </div>
        </div>

        <div
          className="rounded-xl overflow-hidden backdrop-blur-md"
          style={{
            border: "1px solid var(--ai-line)",
            background: "var(--ai-bg-glass)",
          }}
        >
          <div
            className="px-4 py-3 grid grid-cols-12 text-[10px] uppercase tracking-[2px]"
            style={{
              color: "var(--ai-muted)",
              borderBottom: "1px solid var(--ai-line)",
              background: "rgba(0,0,0,0.25)",
            }}
          >
            <span className="col-span-1">#</span>
            <span className="col-span-5">Nome</span>
            <span className="col-span-4">Telefone</span>
            <span className="col-span-2 text-right">Horário</span>
          </div>

          {loading ? (
            <div
              className="px-4 py-8 text-center text-sm"
              style={{ color: "var(--ai-muted)" }}
            >
              Carregando...
            </div>
          ) : checkins.length === 0 ? (
            <div
              className="px-4 py-8 text-center text-sm"
              style={{ color: "var(--ai-muted)" }}
            >
              Nenhum check-in ainda.
            </div>
          ) : (
            checkins.map((c, i) => (
              <div
                key={c.id}
                className="px-4 py-3 grid grid-cols-12 text-sm items-center transition-colors hover:bg-white/[0.04]"
                style={{
                  borderBottom: "1px solid var(--ai-line)",
                }}
              >
                <span
                  className="col-span-1 text-xs"
                  style={{
                    color: "var(--ai-cyan)",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  {String(ocupadas - i).padStart(3, "0")}
                </span>
                <span className="col-span-5 text-white font-medium truncate">
                  {c.nome}
                </span>
                <span
                  className="col-span-4 text-xs"
                  style={{ color: "var(--ai-muted)" }}
                >
                  {c.telefone}
                </span>
                <span
                  className="col-span-2 text-right text-xs"
                  style={{
                    color: "var(--ai-muted)",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  {new Date(c.criado_em).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--ai-muted)" }}
        >
          Atualização em tempo real via Supabase Realtime
        </p>
      </div>
    </main>
  );
}
