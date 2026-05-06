"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  nome: string;
  numero: number;
};

const CARD_W = 1050;
const CARD_H = 660;

export default function CarteirinhaCard({ nome, numero }: Props) {
  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");
  const [fotoDataUrl, setFotoDataUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const credencial = `AIN-2026-${String(numero).padStart(3, "0")}`;
  const nomeUpper = (nome || "SEU NOME AQUI").toUpperCase();
  const empresaShow = empresa.trim() || "Convidado(a)";
  const cargoShow = cargo.trim() || "Convidado(a) AI Night";

  useEffect(() => {
    function adjust() {
      if (!stageRef.current) return;
      const padding = 32;
      const avail = stageRef.current.clientWidth - padding;
      const next = avail < CARD_W ? avail / CARD_W : 1;
      setScale(next);
    }
    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, []);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFotoDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function downloadPNG() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "transparent",
      });
      const safe = (nome || "AI-Night").replace(/[^a-zA-Z0-9]+/g, "_");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Carteirinha_AI_Night_${safe}.png`;
      a.click();
    } catch (err) {
      console.error(err);
      alert(
        'Não foi possível gerar o PNG aqui — use "Imprimir / PDF" pra gerar o arquivo.'
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Personalização */}
      <div
        className="max-w-[1100px] mx-auto mb-6 rounded-2xl p-5 backdrop-blur-md no-print"
        style={{ background: "var(--ai-bg-glass)", border: "1px solid var(--ai-line)" }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-[2px] mb-3"
          style={{ color: "var(--ai-cyan)" }}
        >
          Personalize sua credencial (opcional)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1.5">
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
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span
              className="text-[10px] font-medium uppercase tracking-[1px]"
              style={{ color: "var(--ai-muted)" }}
            >
              Cargo / Função
            </span>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              maxLength={40}
              placeholder="Ex: Diretor(a) de Inovação"
              className="rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid var(--ai-line)",
                color: "var(--ai-text)",
              }}
            />
          </label>
          <div className="flex flex-col gap-1.5">
            <span
              className="text-[10px] font-medium uppercase tracking-[1px]"
              style={{ color: "var(--ai-muted)" }}
            >
              Foto (opcional)
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-[1px] transition-all"
              style={{
                background: "rgba(57,211,255,0.12)",
                border: "1px solid rgba(57,211,255,0.4)",
                color: "var(--ai-cyan)",
              }}
            >
              {fotoDataUrl ? "✓ Trocar foto" : "📷 Carregar foto"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={downloadPNG}
            disabled={downloading}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[1px] transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, var(--ai-orange), var(--ai-gold))",
              color: "#0a0a0a",
            }}
          >
            {downloading ? "Gerando..." : "⬇ Baixar PNG"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[1px] text-white transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--ai-blue), var(--ai-cyan))",
            }}
          >
            🖨 Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Stage onde a carteirinha vive */}
      <div
        ref={stageRef}
        className="flex justify-center items-start py-2 print-only-stage"
        style={{ minHeight: CARD_H * scale + 40 }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: CARD_W,
            height: CARD_H,
          }}
        >
          <div
            ref={cardRef}
            className="ai-card relative overflow-hidden text-[var(--ai-text)]"
            style={{
              width: CARD_W,
              height: CARD_H,
              borderRadius: 24,
              boxShadow:
                "0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset",
              background:
                "radial-gradient(700px 400px at 20% 0%, rgba(39,71,255,0.45), transparent 60%), radial-gradient(700px 500px at 100% 100%, rgba(255,122,0,0.30), transparent 55%), linear-gradient(135deg,#001529 0%,#02132e 45%,#02080f 100%)",
            }}
          >
            <CardLayers />

            {/* Header */}
            <div
              className="relative flex items-center justify-between"
              style={{
                height: 120,
                padding: "0 36px",
                background:
                  "linear-gradient(120deg, rgba(2,8,24,0.65), rgba(2,8,24,0.25)), linear-gradient(135deg,#01122c 0%,#062045 60%,#0a2a64 100%)",
                borderBottom: "2px solid rgba(57,211,255,0.4)",
                zIndex: 1,
              }}
            >
              <div className="flex items-center gap-3.5">
                <Image
                  src="/logo-vanguardia.png"
                  alt="VanguardIA"
                  width={180}
                  height={42}
                  priority
                  style={{ height: 46, width: "auto", filter: "brightness(0) invert(1)" }}
                />
              </div>
              <div className="text-center flex-1">
                <div
                  className="font-black"
                  style={{
                    fontSize: 36,
                    letterSpacing: 6,
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
                </div>
                <div
                  className="mt-1.5 uppercase font-medium"
                  style={{
                    fontSize: 11,
                    letterSpacing: 4,
                    color: "var(--ai-muted)",
                  }}
                >
                  CREDENCIAL OFICIAL{" "}
                  <b style={{ color: "var(--ai-cyan)", fontWeight: 700 }}>·</b> Belém · DO IT
                  HUB <b style={{ color: "var(--ai-cyan)", fontWeight: 700 }}>·</b> 2026
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo-doit-hub.png"
                  alt="DO IT Hub"
                  width={120}
                  height={50}
                  priority
                  style={{ height: 50, width: "auto", filter: "brightness(0) invert(1)" }}
                />
              </div>
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
              className="relative grid"
              style={{
                gridTemplateColumns: "90px 230px 1fr 250px",
                height: CARD_H - 120 - 56,
                zIndex: 1,
              }}
            >
              {/* Side rail */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg,#02091a,#03152f)",
                  borderRight: "1px solid var(--ai-line)",
                }}
              >
                <span
                  className="font-extrabold uppercase"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: 16,
                    letterSpacing: 8,
                    color: "var(--ai-cyan)",
                  }}
                >
                  AI · NIGHT
                </span>
                <span
                  className="absolute"
                  style={{
                    top: 14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--ai-cyan)",
                    boxShadow: "0 0 12px var(--ai-cyan)",
                    animation: "ai-pulse 1.6s infinite",
                  }}
                />
                <span
                  className="absolute"
                  style={{
                    bottom: 14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--ai-orange)",
                    boxShadow: "0 0 12px var(--ai-orange)",
                  }}
                />
              </div>

              {/* Photo column */}
              <div
                className="flex flex-col items-center gap-3"
                style={{ padding: "22px 0 22px 22px" }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 200,
                    height: 240,
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
                      style={{
                        color: "var(--ai-muted)",
                        fontSize: 12,
                        letterSpacing: 1,
                        textAlign: "center",
                        padding: "0 10px",
                      }}
                    >
                      📸 Adicione sua foto
                    </span>
                  )}
                  <Corner pos="tl" />
                  <Corner pos="tr" />
                  <Corner pos="bl" />
                  <Corner pos="br" />
                </div>
                <div
                  className="flex items-center gap-2.5 w-full"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(57,211,255,0.18),rgba(255,122,0,0.18))",
                    border: "1px solid rgba(57,211,255,0.45)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    color: "var(--ai-cyan)",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                    <path d="M3 12h2M19 12h2M12 3v2M12 19v2" />
                  </svg>
                  <div className="flex flex-col" style={{ lineHeight: 1.05 }}>
                    <span
                      className="font-black"
                      style={{
                        fontSize: 15,
                        letterSpacing: 2,
                        backgroundImage:
                          "linear-gradient(90deg,var(--ai-cyan),var(--ai-gold))",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      AI&nbsp;NIGHT
                    </span>
                    <small
                      style={{
                        fontSize: 9,
                        letterSpacing: 1.2,
                        color: "var(--ai-muted)",
                        textTransform: "uppercase",
                        marginTop: 3,
                      }}
                    >
                      Pioneiro(a) da IA · 2026
                    </small>
                  </div>
                </div>
              </div>

              {/* Info column */}
              <div
                className="flex flex-col gap-3"
                style={{ padding: "22px 24px" }}
              >
                <div
                  className="uppercase"
                  style={{
                    fontSize: 11,
                    letterSpacing: 2.5,
                    color: "var(--ai-muted)",
                    borderBottom: "1px solid var(--ai-line)",
                    paddingBottom: 8,
                  }}
                >
                  A <b style={{ color: "var(--ai-cyan)" }}>VanguardIA</b> &amp;{" "}
                  <b style={{ color: "var(--ai-cyan)" }}>DO IT Hub</b> credenciam:
                </div>
                <div
                  className="font-extrabold text-white break-words"
                  style={{
                    fontSize: 30,
                    lineHeight: 1.1,
                    letterSpacing: 1,
                    textShadow: "0 0 20px rgba(57,211,255,0.25)",
                    minHeight: 70,
                  }}
                >
                  {nomeUpper}
                </div>
                <div>
                  <div
                    className="uppercase"
                    style={{
                      fontSize: 11,
                      letterSpacing: 2.5,
                      color: "var(--ai-muted)",
                      marginTop: 4,
                    }}
                  >
                    Representando
                  </div>
                  <div
                    className="font-bold"
                    style={{
                      fontSize: 18,
                      color: "var(--ai-gold)",
                      letterSpacing: 1,
                      minHeight: 24,
                    }}
                  >
                    {empresaShow}
                  </div>
                </div>
                <div>
                  <div
                    className="uppercase"
                    style={{
                      fontSize: 11,
                      letterSpacing: 2.5,
                      color: "var(--ai-muted)",
                      marginTop: 4,
                    }}
                  >
                    Função
                  </div>
                  <div
                    className="font-semibold text-white"
                    style={{ fontSize: 14, letterSpacing: 0.5, minHeight: 18 }}
                  >
                    {cargoShow}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    fontSize: 12,
                    color: "#cfe2ff",
                    lineHeight: 1.5,
                    borderLeft: "3px solid var(--ai-cyan)",
                    padding: "8px 12px",
                    background: "rgba(57,211,255,0.06)",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <b style={{ color: "var(--ai-cyan)" }}>Habilitado(a)</b> a participar do AI
                  Night — uma noite onde inteligência humana e artificial caminham juntas para
                  construir o futuro dos negócios.
                </div>
              </div>

              {/* Perks column */}
              <div
                className="flex flex-col gap-2"
                style={{
                  padding: "22px 22px 22px 22px",
                  borderLeft: "1px dashed rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="uppercase font-bold"
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    color: "var(--ai-orange)",
                    borderBottom: "1px solid rgba(255,122,0,0.3)",
                    paddingBottom: 6,
                    marginBottom: 4,
                  }}
                >
                  ★ Acessos &amp; Habilidades
                </div>
                <Perk
                  index={0}
                  title="AUDITÓRIO DO IT HUB"
                  sub="Acesso a todas as palestras"
                  icon={
                    <path d="M12 2l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 9l6-1z" />
                  }
                />
                <Perk
                  index={1}
                  title="NETWORKING PREMIUM"
                  sub="Conexões estratégicas"
                  icon={
                    <>
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-1a8 8 0 0116 0v1" />
                    </>
                  }
                />
                <Perk
                  index={2}
                  title="IMERSÃO EM IA"
                  sub="Cases reais de aplicação"
                  icon={<path d="M3 12h4l3-9 4 18 3-9h4" />}
                />
                <Perk
                  index={3}
                  title="DEMOS & AGENTES"
                  sub="IA aplicada ao vivo"
                  icon={
                    <>
                      <rect x="4" y="4" width="16" height="16" rx="3" />
                      <path d="M9 9h6v6H9z" />
                      <path d="M2 10h2M2 14h2M20 10h2M20 14h2M10 2v2M14 2v2M10 20v2M14 20v2" />
                    </>
                  }
                />
                <Perk
                  index={4}
                  title="INSIGHTS EXCLUSIVOS"
                  sub="Tendências & novidades"
                  icon={<path d="M13 2L3 14h7l-1 8 10-12h-7z" />}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              className="absolute left-0 right-0 grid items-center"
              style={{
                bottom: 0,
                height: 56,
                gridTemplateColumns: "1fr 1fr 1fr auto",
                gap: 14,
                padding: "0 36px",
                background:
                  "linear-gradient(180deg,rgba(2,8,24,0.4),rgba(2,8,24,0.95))",
                borderTop: "2px solid rgba(57,211,255,0.4)",
                zIndex: 2,
              }}
            >
              <FootCell label="Nº Credencial" mono>
                <span style={{ color: "var(--ai-cyan)" }}>AIN</span>
                {credencial.replace("AIN", "")}
              </FootCell>
              <FootCell label="Data do Evento" mono>
                06 / 05 / <span style={{ color: "var(--ai-cyan)" }}>2026</span>
              </FootCell>
              <FootCell label="Local" mono>
                DO IT HUB <span style={{ color: "var(--ai-cyan)" }}>·</span> Belém/PA
              </FootCell>
              <div
                className="flex items-center gap-2.5"
                style={{ paddingLeft: 14, borderLeft: "1px solid var(--ai-line)" }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background:
                      "conic-gradient(from 0deg, var(--ai-cyan), var(--ai-blue), var(--ai-orange), var(--ai-cyan))",
                  }}
                >
                  <div
                    className="absolute"
                    style={{ inset: 3, borderRadius: "50%", background: "#01122c" }}
                  />
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#39d3ff"
                    strokeWidth="2.4"
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <path d="M12 2l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span
                    className="uppercase"
                    style={{ fontSize: 8, letterSpacing: 1.5, color: "var(--ai-muted)" }}
                  >
                    Selo Oficial
                  </span>
                  <span
                    className="font-extrabold"
                    style={{ fontSize: 11, color: "var(--ai-gold)", letterSpacing: 1 }}
                  >
                    AI NIGHT
                  </span>
                </div>
              </div>
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
            </div>
          </div>
        </div>
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
          backgroundSize: "28px 28px",
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
    width: 14,
    height: 14,
    border: "2px solid var(--ai-cyan)",
  };
  const variants: Record<typeof pos, React.CSSProperties> = {
    tl: { top: 6, left: 6, borderRight: 0, borderBottom: 0 },
    tr: { top: 6, right: 6, borderLeft: 0, borderBottom: 0 },
    bl: { bottom: 6, left: 6, borderRight: 0, borderTop: 0 },
    br: { bottom: 6, right: 6, borderLeft: 0, borderTop: 0 },
  };
  return <span style={{ ...base, ...variants[pos] }} />;
}

function Perk({
  index,
  title,
  sub,
  icon,
}: {
  index: number;
  title: string;
  sub: string;
  icon: React.ReactNode;
}) {
  const isOrange = index % 2 === 1;
  return (
    <div
      className="flex items-center gap-2.5"
      style={{
        padding: "6px 0",
        borderBottom: "1px dashed rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: isOrange
            ? "linear-gradient(135deg,rgba(255,122,0,0.15),rgba(255,122,0,0.05))"
            : "linear-gradient(135deg,rgba(57,211,255,0.15),rgba(57,211,255,0.05))",
          border: isOrange
            ? "1px solid rgba(255,122,0,0.4)"
            : "1px solid rgba(57,211,255,0.4)",
          color: isOrange ? "var(--ai-orange)" : "var(--ai-cyan)",
        }}
      >
        <svg
          width="16"
          height="16"
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
      <div
        className="font-semibold text-white"
        style={{ fontSize: 11, lineHeight: 1.2, letterSpacing: 0.3 }}
      >
        {title}
        <small
          className="block font-normal"
          style={{
            color: "var(--ai-muted)",
            fontSize: 9.5,
            marginTop: 1,
            letterSpacing: 0.5,
          }}
        >
          {sub}
        </small>
      </div>
    </div>
  );
}

function FootCell({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="uppercase"
        style={{ fontSize: 9, letterSpacing: 2, color: "var(--ai-muted)" }}
      >
        {label}
      </span>
      <span
        className="font-bold text-white"
        style={{
          fontSize: 13,
          letterSpacing: 0.5,
          fontFamily: mono ? "var(--font-jetbrains-mono), monospace" : undefined,
        }}
      >
        {children}
      </span>
    </div>
  );
}
