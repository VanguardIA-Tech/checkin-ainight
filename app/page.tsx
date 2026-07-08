"use client";

export const dynamic = "force-dynamic";

import QRCode from "react-qr-code";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { useToday } from "@/lib/useToday";
import { formatLongDate } from "@/lib/date";

export default function QRPage() {
  const [checkinUrl, setCheckinUrl] = useState(
    process.env.NEXT_PUBLIC_CHECKIN_URL ??
      "https://checkin.vanguardiagrupo.com.br/checkin"
  );
  const today = useToday();
  const dataLabel = today ? formatLongDate(today) : "—";

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_CHECKIN_URL) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckinUrl(`${window.location.origin}/checkin`);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-5 mb-8">
        <Image
          src="/logo-vanguardia.png"
          alt="VanguardIA"
          width={170}
          height={40}
          priority
          style={{ height: 40, width: "auto", filter: "brightness(0) invert(1)" }}
        />
        <span
          style={{
            width: 1,
            height: 36,
            background:
              "linear-gradient(180deg,transparent,var(--ai-cyan),transparent)",
          }}
        />
        <Image
          src="/logo-doit-hub.png"
          alt="DO IT Hub"
          width={110}
          height={44}
          priority
          style={{ height: 44, width: "auto", filter: "brightness(0) invert(1)" }}
        />
      </div>

      <h1
        className="font-black text-center mb-2"
        style={{
          fontSize: 38,
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
      </h1>
      <p
        className="text-[10px] uppercase tracking-[4px] mb-8 text-center"
        style={{ color: "var(--ai-muted)" }}
      >
        CREDENCIAL OFICIAL · Belém · DO IT HUB · 2026
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-sm">
        {[
          { icon: Calendar, label: "DATA", value: dataLabel, wide: false },
          { icon: Clock, label: "HORÁRIO", value: "18h", wide: false },
          {
            icon: MapPin,
            label: "LOCAL",
            value: "DO IT Hub · Tv Avertano Rocha, 192, Campina, Belém",
            wide: true,
          },
          { icon: Ticket, label: "ACESSO", value: "Gratuito", wide: false },
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
            <item.icon
              size={18}
              strokeWidth={2.25}
              className="mt-0.5 flex-shrink-0"
              style={{ color: "var(--ai-cyan)" }}
            />
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
        className="rounded-2xl p-7 flex flex-col items-center gap-4 w-full max-w-sm backdrop-blur-md"
        style={{
          background: "var(--ai-bg-glass)",
          border: "2px solid rgba(57,211,255,0.5)",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.4), 0 0 0 4px rgba(57,211,255,0.08)",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[3px]"
          style={{ color: "var(--ai-cyan)" }}
        >
          Check-in
        </p>
        <h2 className="text-white text-2xl font-bold text-center -mt-1">
          Aponte a câmera
        </h2>
        <p
          className="text-sm text-center -mt-2"
          style={{ color: "var(--ai-muted)" }}
        >
          e gere sua carteirinha do AI Night
        </p>

        <div
          className="rounded-xl p-4"
          style={{ background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
        >
          <QRCode
            value={checkinUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#001529"
          />
        </div>

        <p
          className="text-xs text-center break-all"
          style={{ color: "var(--ai-muted)" }}
        >
          {checkinUrl}
        </p>
      </div>

      <p
        className="mt-8 text-xs text-center"
        style={{ color: "var(--ai-muted)" }}
      >
        AI Night · VanguardIA × DO IT Hub · Belém, PA
      </p>
    </main>
  );
}
