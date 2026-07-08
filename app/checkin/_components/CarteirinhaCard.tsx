"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, Camera, Check, ImageOff, Sparkles, Star } from "lucide-react";
import { useToday } from "@/lib/useToday";
import { formatShortDateParts } from "@/lib/date";

type Props = {
  nome: string;
  numero: number;
};

export default function CarteirinhaCard({ nome, numero }: Props) {
  const [empresa, setEmpresa] = useState("");
  const [fotoDataUrl, setFotoDataUrl] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const credencial = `AIN-2026-${String(numero).padStart(3, "0")}`;
  const nomeUpper = (nome || "SEU NOME AQUI").toUpperCase();
  const empresaShow = empresa.trim() || "Convidado(a)";

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFotoDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  if (generated) {
    return (
      <div className="w-full flex flex-col items-center px-3 pb-10">
        <button
          onClick={() => setGenerated(false)}
          className="self-start mb-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[2px] px-3 py-2 rounded-lg transition-colors hover:bg-white/[0.06]"
          style={{
            color: "var(--ai-muted)",
            background: "var(--ai-bg-glass)",
            border: "1px solid var(--ai-line)",
          }}
        >
          <ArrowLeft size={13} /> Editar
        </button>

        <Card
          nome={nomeUpper}
          empresa={empresaShow}
          credencial={credencial}
          fotoDataUrl={fotoDataUrl}
        />

        <p
          className="inline-flex items-center justify-center gap-1.5 w-full text-[11px] uppercase tracking-[2px] mt-6 text-center"
          style={{ color: "var(--ai-muted)" }}
        >
          <Camera size={13} /> Tire um print e poste · #AINight
        </p>
      </div>
    );
  }

  const primeiroNome = (nome || "").trim().split(" ")[0] || "convidado(a)";

  return (
    <div className="w-full max-w-md mx-auto px-3">
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 28,
              height: 28,
              background: "rgba(57,211,255,0.18)",
              border: "1px solid rgba(57,211,255,0.5)",
              color: "var(--ai-cyan)",
              fontSize: 13,
            }}
          >
            <Check size={14} strokeWidth={3} />
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-[2px]"
            style={{ color: "var(--ai-cyan)" }}
          >
            Presença confirmada
          </span>
        </div>
        <h1
          className="text-white font-extrabold"
          style={{ fontSize: "clamp(20px, 5.5vw, 24px)", lineHeight: 1.15 }}
        >
          Bem-vindo(a),{" "}
          <span style={{ color: "var(--ai-gold)" }}>
            {primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1)}
          </span>
          .
        </h1>
        <p
          className="text-sm mt-2"
          style={{ color: "var(--ai-muted)" }}
        >
          Personalize sua carteirinha e gere pra postar nas redes.
        </p>
      </div>

      <div
        className="rounded-2xl p-4 backdrop-blur-md mb-5"
        style={{
          background: "var(--ai-bg-glass)",
          border: "1px solid var(--ai-line)",
        }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-[2px] mb-3"
          style={{ color: "var(--ai-cyan)" }}
        >
          Personalize sua credencial (opcional)
        </h2>

        <label className="flex flex-col gap-1.5 mb-3">
          <span
            className="text-[10px] font-medium uppercase tracking-[1px]"
            style={{ color: "var(--ai-muted)" }}
          >
            Empresa / Organização
          </span>
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            maxLength={36}
            placeholder="Ex: VanguardIA"
            className="rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid var(--ai-line)",
              color: "var(--ai-text)",
            }}
            suppressHydrationWarning
          />
        </label>

        <div className="flex flex-col gap-1.5 mb-4">
          <span
            className="text-[10px] font-medium uppercase tracking-[1px]"
            style={{ color: "var(--ai-muted)" }}
          >
            Foto (opcional)
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-[1px] transition-all"
            style={{
              background: "rgba(57,211,255,0.12)",
              border: "1px solid rgba(57,211,255,0.4)",
              color: "var(--ai-cyan)",
            }}
          >
            {fotoDataUrl ? (
              <>
                <Check size={14} /> Trocar foto
              </>
            ) : (
              <>
                <Camera size={14} /> Carregar foto
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="hidden"
          />
        </div>

        <button
          type="button"
          onClick={() => setGenerated(true)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm uppercase tracking-[1.5px] active:scale-[0.98] transition-transform"
          style={{
            background:
              "linear-gradient(135deg, var(--ai-orange), var(--ai-gold))",
            color: "#0a0a0a",
            boxShadow: "0 8px 24px rgba(255,122,0,0.35)",
          }}
        >
          <Sparkles size={16} /> Gerar carteira
        </button>
      </div>

      <Card
        nome={nomeUpper}
        empresa={empresaShow}
        credencial={credencial}
        fotoDataUrl={fotoDataUrl}
      />
    </div>
  );
}

function Card({
  nome,
  empresa,
  credencial,
  fotoDataUrl,
}: {
  nome: string;
  empresa: string;
  credencial: string;
  fotoDataUrl: string | null;
}) {
  const today = useToday();
  const { dia, mes, ano } = today
    ? formatShortDateParts(today)
    : { dia: "--", mes: "--", ano: "----" };

  return (
    <div
      className="ai-card relative overflow-hidden text-white mx-auto"
      style={{
        width: "100%",
        maxWidth: 480,
        borderRadius: 22,
        boxShadow:
          "0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset",
        background:
          "radial-gradient(700px 400px at 20% 0%, rgba(39,71,255,0.45), transparent 60%), radial-gradient(700px 500px at 100% 100%, rgba(255,122,0,0.30), transparent 55%), linear-gradient(135deg,#001529 0%,#02132e 45%,#02080f 100%)",
      }}
    >
      <CardLayers />

      {/* Header */}
      <div
        className="relative z-10"
        style={{
          padding: "18px 22px 14px",
          borderBottom: "2px solid rgba(57,211,255,0.4)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <Image
            src="/logo-vanguardia.png"
            alt="VanguardIA"
            width={120}
            height={26}
            priority
            style={{
              height: 22,
              width: "auto",
              filter: "brightness(0) invert(1)",
              opacity: 0.95,
            }}
          />
          <Image
            src="/logo-doit-hub.png"
            alt="DO IT Hub"
            width={70}
            height={28}
            priority
            style={{
              height: 28,
              width: "auto",
              filter: "brightness(0) invert(1)",
              opacity: 0.95,
            }}
          />
        </div>
        <h1
          className="font-black text-center"
          style={{
            fontSize: "clamp(28px, 9vw, 40px)",
            letterSpacing: "0.2em",
            lineHeight: 1,
            backgroundImage:
              "linear-gradient(90deg,#fff 0%,var(--ai-cyan) 50%,var(--ai-gold) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 0 30px rgba(57,211,255,0.3)",
          }}
        >
          AI&nbsp;NIGHT
        </h1>
        <p
          className="text-center mt-1.5 uppercase font-medium"
          style={{
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "var(--ai-muted)",
          }}
        >
          CREDENCIAL OFICIAL · BELÉM · DO IT HUB · 2026
        </p>
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: -2,
            height: 2,
            background:
              "linear-gradient(90deg,transparent,var(--ai-cyan) 30%,var(--ai-orange) 70%,transparent)",
            filter: "blur(1px)",
          }}
        />
      </div>

      {/* Body */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ padding: "20px 22px 14px", gap: 14 }}
      >
        {/* Photo */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "min(58%, 200px)",
            aspectRatio: "5 / 6",
            borderRadius: 14,
            overflow: "hidden",
            background:
              "linear-gradient(135deg,rgba(57,211,255,0.18),rgba(255,122,0,0.18))",
            border: "2px solid rgba(57,211,255,0.5)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.5), 0 0 0 4px rgba(57,211,255,0.1)",
          }}
        >
          {fotoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoDataUrl}
              alt="Foto do participante"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              className="flex flex-col items-center gap-1.5"
              style={{
                color: "var(--ai-muted)",
                fontSize: 11,
                letterSpacing: 0.5,
                textAlign: "center",
                padding: "0 10px",
              }}
            >
              <ImageOff size={20} />
              Sem foto
            </span>
          )}
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
        </div>

        {/* Selo "Pioneiro IA" */}
        <div
          className="flex items-center gap-2"
          style={{
            background:
              "linear-gradient(135deg,rgba(57,211,255,0.18),rgba(255,122,0,0.18))",
            border: "1px solid rgba(57,211,255,0.45)",
            borderRadius: 999,
            padding: "5px 14px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ai-cyan)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span
            className="font-black"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.2em",
              backgroundImage:
                "linear-gradient(90deg,var(--ai-cyan),var(--ai-gold))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PIONEIRO(A) DA IA · 2026
          </span>
        </div>

        {/* Intro */}
        <p
          className="text-center uppercase"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            color: "var(--ai-muted)",
            marginTop: -2,
          }}
        >
          A <b style={{ color: "var(--ai-cyan)" }}>VanguardIA</b> &amp;{" "}
          <b style={{ color: "var(--ai-cyan)" }}>DO IT Hub</b> credenciam:
        </p>

        {/* Name */}
        <h2
          className="font-black text-white text-center break-words"
          style={{
            fontSize: "clamp(22px, 7vw, 32px)",
            lineHeight: 1.05,
            letterSpacing: 0.5,
            textShadow: "0 0 24px rgba(57,211,255,0.3)",
            marginTop: -6,
          }}
        >
          {nome}
        </h2>

        {/* Empresa */}
        <div className="text-center" style={{ marginTop: -4 }}>
          <p
            className="uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.25em",
              color: "var(--ai-muted)",
            }}
          >
            Representando
          </p>
          <p
            className="font-bold"
            style={{
              fontSize: 16,
              color: "var(--ai-gold)",
              letterSpacing: 0.5,
              lineHeight: 1.2,
            }}
          >
            {empresa}
          </p>
        </div>

        {/* Tagline */}
        <div
          className="w-full"
          style={{
            fontSize: 11,
            color: "#cfe2ff",
            lineHeight: 1.45,
            borderLeft: "3px solid var(--ai-cyan)",
            padding: "8px 12px",
            background: "rgba(57,211,255,0.06)",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <b style={{ color: "var(--ai-cyan)" }}>Habilitado(a)</b> a participar
          do AI Night — uma noite onde inteligência humana e artificial caminham
          juntas para construir o futuro dos negócios.
        </div>

        {/* Perks 2x2 */}
        <div className="w-full">
          <p
            className="flex items-center gap-1.5 uppercase font-bold mb-2"
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--ai-orange)",
              borderBottom: "1px solid rgba(255,122,0,0.3)",
              paddingBottom: 5,
            }}
          >
            <Star size={12} /> Acessos &amp; Habilidades
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Perk
              tone="cyan"
              title="AUDITÓRIO"
              sub="Palestras"
              icon={
                <path d="M12 2l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 9l6-1z" />
              }
            />
            <Perk
              tone="orange"
              title="NETWORKING"
              sub="Conexões"
              icon={
                <>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-1a8 8 0 0116 0v1" />
                </>
              }
            />
            <Perk
              tone="cyan"
              title="IMERSÃO IA"
              sub="Cases reais"
              icon={<path d="M3 12h4l3-9 4 18 3-9h4" />}
            />
            <Perk
              tone="orange"
              title="INSIGHTS"
              sub="Tendências"
              icon={<path d="M13 2L3 14h7l-1 8 10-12h-7z" />}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="relative z-10 grid items-center"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          padding: "10px 18px 14px",
          background:
            "linear-gradient(180deg,rgba(2,8,24,0.4),rgba(2,8,24,0.95))",
          borderTop: "2px solid rgba(57,211,255,0.4)",
        }}
      >
        <div
          className="absolute left-0 right-0"
          style={{
            top: -2,
            height: 2,
            background:
              "linear-gradient(90deg,transparent,var(--ai-orange) 30%,var(--ai-cyan) 70%,transparent)",
            filter: "blur(1px)",
          }}
        />
        <FootCell label="Credencial" align="left">
          <span style={{ color: "var(--ai-cyan)" }}>AIN</span>
          {credencial.replace("AIN", "")}
        </FootCell>
        <FootCell label="Data" align="center">
          {dia}/{mes}/<span style={{ color: "var(--ai-cyan)" }}>{ano}</span>
        </FootCell>
        <FootCell label="Local" align="right">
          DO IT <span style={{ color: "var(--ai-cyan)" }}>·</span> Belém
        </FootCell>
      </div>
    </div>
  );
}

function CardLayers() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, #000 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, #000 60%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(2px 2px at 12% 22%, rgba(57,211,255,0.9), transparent 60%), radial-gradient(2px 2px at 88% 18%, rgba(255,181,71,0.9), transparent 60%), radial-gradient(2px 2px at 70% 80%, rgba(57,211,255,0.7), transparent 60%), radial-gradient(2px 2px at 25% 75%, rgba(255,122,0,0.7), transparent 60%), radial-gradient(1.5px 1.5px at 50% 30%, rgba(255,255,255,0.7), transparent 60%)",
        }}
      />
    </>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 12,
    height: 12,
    border: "2px solid var(--ai-cyan)",
  };
  const variants: Record<typeof pos, React.CSSProperties> = {
    tl: { top: 5, left: 5, borderRight: 0, borderBottom: 0 },
    tr: { top: 5, right: 5, borderLeft: 0, borderBottom: 0 },
    bl: { bottom: 5, left: 5, borderRight: 0, borderTop: 0 },
    br: { bottom: 5, right: 5, borderLeft: 0, borderTop: 0 },
  };
  return <span style={{ ...base, ...variants[pos] }} />;
}

function Perk({
  tone,
  title,
  sub,
  icon,
}: {
  tone: "cyan" | "orange";
  title: string;
  sub: string;
  icon: React.ReactNode;
}) {
  const isCyan = tone === "cyan";
  const ringColor = isCyan ? "rgba(57,211,255,0.4)" : "rgba(255,122,0,0.4)";
  const fillStart = isCyan
    ? "rgba(57,211,255,0.15)"
    : "rgba(255,122,0,0.15)";
  const fillEnd = isCyan ? "rgba(57,211,255,0.05)" : "rgba(255,122,0,0.05)";
  const accent = isCyan ? "var(--ai-cyan)" : "var(--ai-orange)";

  return (
    <div
      className="flex items-center gap-2"
      style={{
        padding: "6px 8px",
        borderRadius: 10,
        background: `linear-gradient(135deg, ${fillStart}, ${fillEnd})`,
        border: `1px solid ${ringColor}`,
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: "rgba(0,0,0,0.35)",
          color: accent,
          border: `1px solid ${ringColor}`,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </div>
      <div className="min-w-0">
        <p
          className="font-bold text-white truncate"
          style={{ fontSize: 10.5, letterSpacing: 0.4, lineHeight: 1.15 }}
        >
          {title}
        </p>
        <p
          className="truncate"
          style={{
            fontSize: 9,
            color: "var(--ai-muted)",
            letterSpacing: 0.4,
            marginTop: 1,
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

function FootCell({
  label,
  align,
  children,
}: {
  label: string;
  align: "left" | "center" | "right";
  children: React.ReactNode;
}) {
  const textAlign = align;
  return (
    <div className="flex flex-col" style={{ textAlign }}>
      <span
        className="uppercase"
        style={{
          fontSize: 8,
          letterSpacing: "0.25em",
          color: "var(--ai-muted)",
        }}
      >
        {label}
      </span>
      <span
        className="font-bold text-white"
        style={{
          fontSize: 11,
          letterSpacing: 0.5,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          marginTop: 2,
        }}
      >
        {children}
      </span>
    </div>
  );
}
