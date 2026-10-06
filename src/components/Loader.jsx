import React from "react";
import { useTranslation } from "react-i18next"; 

const Loader = () => {
  const { t } = useTranslation(); 

  return (
    <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/70 to-cyan-50">
      {/* ✨ Custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(40px, -60px) scale(1.15); }
          66%      { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes progress-slide {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
        .animate-blob          { animation: blob 8s ease-in-out infinite; }
        .animate-spin-reverse  { animation: spin-reverse 2.2s linear infinite; }
        .animate-float-y       { animation: float-y 3s ease-in-out infinite; }
        .animate-progress-slide{ animation: progress-slide 1.5s ease-in-out infinite; }
      `}</style>

      {/* 🌈 Background decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-blob rounded-full bg-emerald-200/40 blur-3xl" />
      <div
        className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 animate-blob rounded-full bg-teal-200/40 blur-3xl"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 animate-blob rounded-full bg-cyan-200/40 blur-3xl"
        style={{ animationDelay: '4s' }}
      />

      {/* ⚙️ Spinner core */}
      <div className="relative flex h-40 w-40 items-center justify-center">
        {/* বেস রিং */}
        <div className="absolute inset-0 rounded-full border-[3px] border-emerald-100" />

        {/* বাইরের ঘোরা রিং */}
        <div
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-r-emerald-500/60 border-t-emerald-500"
          style={{ animationDuration: '1.6s' }}
        />

        {/* ভেতরের রিং — উল্টো দিকে ঘোরে */}
        <div className="absolute inset-4 animate-spin-reverse rounded-full border-[3px] border-transparent border-b-teal-400/60 border-l-teal-400" />

        {/* Ripple glow */}
        <div className="absolute h-20 w-20 animate-ping rounded-full bg-emerald-400/20" />
        <div
          className="absolute h-20 w-20 animate-ping rounded-full border-2 border-emerald-400/40"
          style={{ animationDelay: '0.7s' }}
        />

        {/* মাঝের কার্ড + হার্টবিট আইকন */}
        <div className="animate-float-y relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl shadow-emerald-200/70 ring-1 ring-emerald-100">
          <svg
            className="h-9 w-9 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
      </div>

      {/* 🔤 ব্র্যান্ড + লোডিং টেক্সট */}
      <div className="relative z-10 mt-10 text-center">
        <h1 className="text-3xl font-black tracking-[0.15em] text-slate-800">
          MEDI
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            CARE
          </span>
        </h1>

        {/* ✅ translated loading text */}
        <p className="mt-3 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          {t("loadingInventory")}
          <span className="ml-2 inline-flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </span>
        </p>

        {/* 📊 Indeterminate progress bar */}
        <div className="relative mx-auto mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-emerald-100/80">
          <div className="animate-progress-slide h-full w-2/5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
        </div>
      </div>
    </div>
  );
};

export default Loader;