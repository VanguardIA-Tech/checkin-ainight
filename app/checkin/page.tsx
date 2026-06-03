"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import CarteirinhaCard from "./_components/CarteirinhaCard";

type Step = "form" | "success" ;

export default function CheckinPage() {
  const [step, setStep] = useState<Step>("form");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nomeConfirmado, setNomeConfirmado] = useState("");
  const [numeroCredencial, setNumeroCredencial] = useState(0);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
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
      const { count } = await supabase
        .from("checkins")
        .select("*", { count: "exact", head: true });

      const { error: insertError } = await supabase.from("checkins").insert({
        nome: nome.trim(),
        telefone: `+55 ${telefone}`,
      });

      if (insertError) throw insertError;

      setNumeroCredencial(Date.now() + 1);
      setNomeConfirmado(nome.trim());
      setStep("success");
    } catch {
      setError("Ops! Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <main className="min-h-screen px-2 py-6 md:py-10">
        <CarteirinhaCard nome={nomeConfirmado} numero={numeroCredencial} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10 md:py-14">
      <div className="flex items-center gap-5 mb-8">
        <Image
          src="/logo-vanguardia.png"
          alt="VanguardIA"
          width={140}
          height={32}
          priority
          style={{ height: 32, width: "auto", filter: "brightness(0) invert(1)" }}
        />
        <span
          style={{
            width: 1,
            height: 28,
            background:
              "linear-gradient(180deg,transparent,var(--ai-cyan),transparent)",
          }}
        />
        <Image
          src="/logo-doit-hub.png"
          alt="DO IT Hub"
          width={90}
          height={36}
          priority
          style={{ height: 36, width: "auto", filter: "brightness(0) invert(1)" }}
        />
      </div>

      <h1
        className="font-black text-center mb-2"
        style={{
          fontSize: 30,
          letterSpacing: 5,
          lineHeight: 1,
          backgroundImage:
            "linear-gradient(90deg,#fff 0%,var(--ai-cyan) 50%,var(--ai-gold) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        AI&nbsp;NIGHT
      </h1>
      <p
        className="text-[10px] uppercase tracking-[3px] mb-8 text-center"
        style={{ color: "var(--ai-muted)" }}
      >
        Confirme sua presença · Belém · DO IT Hub · 2026
      </p>

      <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-8">
        {[
          {
            icon: "📅",
            label: "DATA",
            value: "3 de julho de 2026",
            wide: false,
          },
          { icon: "🕕", label: "HORÁRIO", value: "18h", wide: false },
          {
            icon: "📍",
            label: "LOCAL",
            value: "DO IT Hub · Tv Avertano Rocha, 192, Campina, Belém",
            wide: true,
          },
          { icon: "🎟️", label: "ACESSO", value: "Gratuito", wide: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-3 flex gap-2 items-start backdrop-blur-md${
              item.wide ? " col-span-2" : ""
            }`}
            style={{
              background: "var(--ai-bg-glass)",
              border: "1px solid var(--ai-line)",
            }}
          >
            <span className="text-base mt-0.5">{item.icon}</span>
            <div>
              <p
                className="text-[9px] uppercase tracking-[2px] mb-0.5"
                style={{ color: "var(--ai-muted)" }}
              >
                {item.label}
              </p>
              <p className="text-white text-xs font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="w-full max-w-md rounded-2xl p-6 md:p-8 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid var(--ai-line)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-6 h-0.5"
            style={{ background: "var(--ai-cyan)" }}
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[3px]"
            style={{ color: "var(--ai-cyan)" }}
          >
            Confirme sua presença
          </p>
        </div>
        <h2 className="text-white text-2xl font-bold mb-6">
          Garanta sua carteirinha do AI Night
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-[10px] uppercase tracking-[2px] mb-1.5"
              style={{ color: "var(--ai-muted)" }}
            >
              Nome Completo
            </label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "var(--ai-muted)" }}
              >
                👤
              </span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como devemos te chamar?"
                className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid var(--ai-line)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--ai-cyan)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--ai-line)")
                }
              />
            </div>
          </div>

          <div>
            <label
              className="block text-[10px] uppercase tracking-[2px] mb-1.5"
              style={{ color: "var(--ai-muted)" }}
            >
              WhatsApp / Celular
            </label>
            <div className="flex gap-2">
              <div
                className="rounded-xl px-3 flex items-center text-white text-sm font-semibold flex-shrink-0"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid var(--ai-line)",
                }}
              >
                +55
              </div>
              <div className="relative flex-1">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: "var(--ai-muted)" }}
                >
                  📱
                </span>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  placeholder="(91) 9 0000-0000"
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all"
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid var(--ai-line)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--ai-cyan)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--ai-line)")
                  }
                />
              </div>
            </div>
          </div>

          {error && (
            <p
              className="text-xs rounded-lg px-3 py-2"
              style={{
                color: "#fca5a5",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-white font-bold text-sm uppercase tracking-[1px] transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: loading
                ? "linear-gradient(135deg, #1d36c0, #1aa3c9)"
                : "linear-gradient(135deg, var(--ai-blue), var(--ai-cyan))",
              boxShadow: "0 8px 20px rgba(39,71,255,0.3)",
            }}
          >
            {loading ? "Confirmando..." : "Confirmar e gerar carteirinha"}
          </button>
        </form>

        <p
          className="text-xs text-center mt-4 flex items-center justify-center gap-1"
          style={{ color: "var(--ai-muted)" }}
        >
          <span>🔒</span> Seus dados ficam protegidos. Sem spam, sem ligação fria.
        </p>
      </div>

      <p
        className="mt-8 text-xs text-center"
        style={{ color: "var(--ai-muted)" }}
      >
        VanguardIA × DO IT Hub · Belém, PA
      </p>
    </main>
  );
}
