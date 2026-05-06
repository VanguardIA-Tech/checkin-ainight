"use client";

import QRCode from "react-qr-code";

const CHECKIN_URL = process.env.NEXT_PUBLIC_CHECKIN_URL ?? "https://checkin-ainight.vercel.app/checkin";

export default function QRPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#0d1117" }}>

      {/* Logos */}
      <div className="flex items-center gap-6 mb-10">
        <span className="text-white font-bold text-xl tracking-widest uppercase">VANGUARDIA</span>
        <span className="text-[#e8470a] font-bold text-2xl">×</span>
        <span className="text-white font-bold text-xl tracking-widest uppercase">IT HUB</span>
      </div>

      {/* Event info */}
      <div className="grid grid-cols-2 gap-4 mb-10 w-full max-w-sm">
        <div className="rounded-xl p-4 flex gap-3 items-start" style={{ background: "#161b22", border: "1px solid #21262d" }}>
          <span className="text-[#e8470a] text-lg mt-0.5">📅</span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Data</p>
            <p className="text-white text-sm font-semibold">6 de maio de 2026</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex gap-3 items-start" style={{ background: "#161b22", border: "1px solid #21262d" }}>
          <span className="text-[#e8470a] text-lg mt-0.5">🕕</span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Horário</p>
            <p className="text-white text-sm font-semibold">18h</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex gap-3 items-start" style={{ background: "#161b22", border: "1px solid #21262d" }}>
          <span className="text-[#e8470a] text-lg mt-0.5">📍</span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Local</p>
            <p className="text-white text-sm font-semibold">DO IT Hub</p>
          </div>
        </div>
        <div className="rounded-xl p-4 flex gap-3 items-start" style={{ background: "#161b22", border: "1px solid #21262d" }}>
          <span className="text-[#e8470a] text-lg mt-0.5">🎟️</span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Acesso</p>
            <p className="text-white text-sm font-semibold">Gratuito · 40 vagas</p>
          </div>
        </div>
      </div>

      {/* QR Code card */}
      <div className="rounded-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm"
        style={{ background: "#161b22", border: "2px solid #e8470a" }}>
        <p className="text-[#e8470a] text-xs font-bold uppercase tracking-widest">Check-in</p>
        <h1 className="text-white text-2xl font-bold text-center">Aponte a câmera</h1>
        <p className="text-gray-400 text-sm text-center -mt-2">e confirme sua presença no AI Night</p>

        <div className="bg-white rounded-xl p-4">
          <QRCode
            value={CHECKIN_URL}
            size={200}
            bgColor="#ffffff"
            fgColor="#0d1117"
          />
        </div>

        <p className="text-gray-500 text-xs text-center break-all">{CHECKIN_URL}</p>
      </div>

      <p className="mt-8 text-gray-500 text-xs text-center">
        AI Night · Vanguardia × DO IT Hub · Belém, PA
      </p>
    </main>
  );
}
