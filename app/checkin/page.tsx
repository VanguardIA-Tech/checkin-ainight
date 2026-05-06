"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Step = "form" | "success" | "full";

export default function CheckinPage() {
  const [step, setStep] = useState<Step>("form");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nomeConfirmado, setNomeConfirmado] = useState("");

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return value;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nome.trim() || nome.trim().length < 3) {
      setError("Por favor, insira seu nome completo.");
      return;
    }
    const digits = telefone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Por favor, insira um número de celular válido.");
      return;
    }

    setLoading(true);
    try {
      // Check current count
      const { count } = await supabase
        .from("checkins")
        .select("*", { count: "exact", head: true });

      const MAX_VAGAS = parseInt(process.env.NEXT_PUBLIC_MAX_VAGAS ?? "40");
      if (count !== null && count >= MAX_VAGAS) {
        setStep("full");
        return;
      }

      const { error: insertError } = await supabase.from("checkins").insert({
        nome: nome.trim(),
        telefone: `+55 ${telefone}`,
      });

      if (insertError) throw insertError;

      setNomeConfirmado(nome.trim().split(" ")[0]);
      setStep("success");
    } catch {
      setError("Ops! Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "#0d1117" }}>
        <div className="w-full max-w-md rounded-2xl p-8 text-center flex flex-col items-center gap-6"
          style={{ background: "#161b22", border: "1px solid #21262d" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "rgba(232,71,10,0.15)", border: "2px solid #e8470a" }}>
            ✓
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">
              Presença confirmada!
            </h1>
            <p className="text-gray-400">
              Olá, <span className="text-white font-semibold">{nomeConfirmado}</span>! Você está na lista.
            </p>
          </div>
          <div className="w-full rounded-xl p-4 text-left space-y-2"
            style={{ background: "#0d1117", border: "1px solid #21262d" }}>
            <p className="text-gray-400 text-sm flex gap-2">
              <span>📅</span> <span>Quarta-feira, 6 de maio de 2026</span>
            </p>
            <p className="text-gray-400 text-sm flex gap-2">
              <span>🕕</span> <span>18h</span>
            </p>
            <p className="text-gray-400 text-sm flex gap-2">
              <span>📍</span> <span>DO IT Hub — Rua Avertano Rocha, 192, Campina, Belém</span>
            </p>
          </div>
          <p className="text-gray-500 text-xs">
            Até logo! Nos vemos às 18h no DO IT Hub. 🚀
          </p>
        </div>
      </main>
    );
  }

  if (step === "full") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "#0d1117" }}>
        <div className="w-full max-w-md rounded-2xl p-8 text-center flex flex-col items-center gap-6"
          style={{ background: "#161b22", border: "1px solid #21262d" }}>
          <div className="text-4xl">😔</div>
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Vagas esgotadas</h1>
            <p className="text-gray-400">
              As 40 vagas do AI Night já foram preenchidas. Fique de olho nos próximos eventos!
            </p>
          </div>
          <p className="text-gray-500 text-xs">
            Vanguardia × DO IT Hub · Belém, PA
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#0d1117" }}>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-white font-bold text-base tracking-widest uppercase">VANGUARDIA</span>
        <span className="text-[#e8470a] font-bold">×</span>
        <span className="text-white font-bold text-base tracking-widest uppercase">IT HUB</span>
      </div>

      {/* Event banner */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-8">
        {[
          { icon: "📅", label: "DATA", value: "6 de maio de 2026" },
          { icon: "🕕", label: "HORÁRIO", value: "18h" },
          { icon: "📍", label: "LOCAL", value: "DO IT Hub · Belém" },
          { icon: "🎟️", label: "ACESSO", value: "Gratuito · 40 vagas" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-3 flex gap-2 items-start"
            style={{ background: "#161b22", border: "1px solid #21262d" }}>
            <span className="text-base mt-0.5">{item.icon}</span>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-white text-xs font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="w-full max-w-md rounded-2xl p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, #161b22 0%, #1a1f2e 100%)", border: "1px solid #21262d" }}>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-0.5" style={{ background: "#e8470a" }} />
          <p className="text-[#e8470a] text-[10px] font-bold uppercase tracking-widest">Confirme sua presença</p>
        </div>
        <h2 className="text-white text-2xl font-bold mb-1">Garanta sua vaga</h2>
        <p className="text-gray-400 text-sm mb-6">
          Preencha em 30 segundos e confirme sua presença no AI Night.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
              Nome Completo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">👤</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como devemos te chamar?"
                className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 transition-all"
                style={{
                  background: "#0d1117",
                  border: "1px solid #21262d",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#e8470a")}
                onBlur={(e) => (e.target.style.borderColor = "#21262d")}
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
              WhatsApp / Celular
            </label>
            <div className="flex gap-2">
              <div className="rounded-xl px-3 flex items-center text-gray-300 text-sm font-semibold flex-shrink-0"
                style={{ background: "#0d1117", border: "1px solid #21262d" }}>
                +55
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">📱</span>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  placeholder="(91) 9 0000-0000"
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  style={{ background: "#0d1117", border: "1px solid #21262d" }}
                  onFocus={(e) => (e.target.style.borderColor = "#e8470a")}
                  onBlur={(e) => (e.target.style.borderColor = "#21262d")}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs rounded-lg px-3 py-2"
              style={{ background: "rgba(239,68,68,0.1)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-white font-bold text-sm transition-all active:scale-95 disabled:opacity-60"
            style={{ background: loading ? "#c93d09" : "#e8470a" }}>
            {loading ? "Confirmando..." : "Quero minha vaga →"}
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-4 flex items-center justify-center gap-1">
          <span>🔒</span> Seus dados ficam protegidos. Sem spam, sem ligação fria.
        </p>
      </div>
    </main>
  );
}
