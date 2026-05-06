"use client";

import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default function QRPage() {
  const [checkinUrl, setCheckinUrl] = useState(
    process.env.NEXT_PUBLIC_CHECKIN_URL ?? "https://checkin.vanguardiagrupo.com.br/checkin"
  );

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_CHECKIN_URL) {
      setCheckinUrl(`${window.location.origin}/checkin`);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#0d1117" }}>

      {/* Logos */}
      <div className="flex items-center gap-6 mb-10">
        <span className="text-white font-bold text-2xl tracking-widest uppercase">AI NIGHT</span>
      </div>

      {/* Event info */}
      <div className="grid grid-cols-2 gap-4 mb-10 w-full max-w-sm">
        {[
          { icon: "📅", label: "Data", value: "6 de maio de 2026", wide: false },
          { icon: "🕕", label: "Horário", value: "18h", wide: false },
          { icon: "📍", label: "Local", value: "DO IT Hub · Tv Avertano Rocha, 192, Campina, Belém", wide: true },
          { icon: "🎟️", label: "Acesso", value: "Gratuito", wide: false },
        ].map((item) => (
          <div key={item.label}
            className={`rounded-xl p-4 flex gap-3 items-start${item.wide ? " col-span-2" : ""}`}
            style={{ background: "#161b22", border: "1px solid #21262d" }}>
            <span className="text-base mt-0.5">{item.icon}</span>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-white text-sm font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code card */}
      <div className="rounded-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm"
        style={{ background: "#161b22", border: "2px solid #e8470a" }}>
        <p className="text-[#e8470a] text-xs font-bold uppercase tracking-widest">Check-in</p>
        <h1 className="text-white text-2xl font-bold text-center">Aponte a câmera</h1>
        <p className="text-gray-400 text-sm text-center -mt-2">e confirme sua presença no AI Night</p>

        <div className="bg-white rounded-xl p-4">
          <QRCode
            value={checkinUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#0d1117"
          />
        </div>

        <p className="text-gray-500 text-xs text-center break-all">{checkinUrl}</p>
      </div>

      <p className="mt-8 text-gray-500 text-xs text-center">
        AI Night · Vanguardia × DO IT Hub · Belém, PA
      </p>
    </main>
  );
}
