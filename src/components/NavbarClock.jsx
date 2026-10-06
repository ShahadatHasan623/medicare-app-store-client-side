import React, { useState, useEffect } from "react";
import { FaSun, FaCloudSun, FaMoon } from "react-icons/fa";

const NavbarClock = () => {
  const [now, setNow] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  // ⏱️ প্রতি সেকেন্ডে আপডেট
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const hours24 = now.getHours();
  const ampm = hours24 >= 12 ? "PM" : "AM";
  const h = String(is24Hour ? hours24 : hours24 % 12 || 12).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  const fullDate = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  // 👋 Greeting icon
  const hour = hours24;
  const GreetIcon = hour < 5 ? FaMoon : hour < 12 ? FaSun : hour < 17 ? FaCloudSun : FaMoon;

  // ⭕ Mini seconds ring
  const r = 13;
  const C = 2 * Math.PI * r;
  const progress = now.getSeconds() / 60;

  return (
    <>
      <style>{`
        @keyframes nb-blink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .animate-nb-blink { animation: nb-blink 1s step-end infinite; }
        @keyframes nb-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(52, 211, 153, .3)); }
          50%      { filter: drop-shadow(0 0 10px rgba(52, 211, 153, .6)); }
        }
        .animate-nb-glow { animation: nb-glow 3s ease-in-out infinite; }
      `}</style>

      {/* 🌟 কার্ডের মতোই gradient border, কিন্তু pill shape */}
      <button
        type="button"
        onClick={() => setIs24Hour(!is24Hour)}
        title={`${fullDate}  •  Click to switch ${is24Hour ? "12-hour" : "24-hour"}`}
        className="relative hidden select-none items-center rounded-full bg-gradient-to-r from-emerald-400/60 via-teal-400/30 to-cyan-400/60 p-[1.5px] shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:shadow-emerald-600/30 active:scale-95 md:flex"
      >
        <div className="flex items-center gap-2 rounded-full bg-slate-900 py-1 pl-2.5 pr-1.5 text-white">
          <GreetIcon className="text-xs text-emerald-300" />

          {/* HH:MM — gradient digits + blinking colon */}
          <span className="animate-nb-glow font-mono text-sm font-bold tracking-wider tabular-nums">
            <span className="text-white">{h}</span>
            <span className="animate-nb-blink mx-0.5 text-emerald-400">:</span>
            <span className="text-white">{m}</span>
          </span>

          {!is24Hour && (
            <span className="text-[10px] font-bold text-emerald-400">{ampm}</span>
          )}

          {/* ⭕ ছোট seconds ring — কার্ডের মতোই */}
          <span className="relative hidden h-7 w-7 sm:block">
            <svg viewBox="0 0 32 32" className="h-7 w-7 -rotate-90">
              <circle cx="16" cy="16" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2.5" />
              <circle
                cx="16" cy="16" r={r} fill="none"
                stroke="url(#nbSecGrad)" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
              <defs>
                <linearGradient id="nbSecGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 grid place-items-center font-mono text-[9px] font-bold text-cyan-300 tabular-nums">
              {s}
            </span>
          </span>

          {/* 📅 ছোট ডেট (বড় স্ক্রিনে) */}
          <span className="hidden border-l border-white/15 pl-2 pr-1 text-[10px] font-semibold text-white/55 lg:inline">
            {months[now.getMonth()]} {now.getDate()}
          </span>
        </div>
      </button>
    </>
  );
};

export default NavbarClock;