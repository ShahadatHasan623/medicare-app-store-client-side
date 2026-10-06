import React from "react";
import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import errorPage from "../assets/pageNotFound.json";
import { useTranslation } from "react-i18next";
import {
  FaHome, FaArrowLeft, FaCompass, FaStore, FaQuestionCircle,
} from "react-icons/fa";

const ErrorElement = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);

  // 🔗 Quick links — lost user ke help kore
  const quickLinks = [
    { name: t("home"), path: "/", icon: <FaHome /> },
    { name: t("shop"), path: "/shop", icon: <FaStore /> },
    { name: t("faq"), path: "/faq-list", icon: <FaQuestionCircle /> },
  ];

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-14px) rotate(3deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(30px, -40px) scale(1.1); }
          66%      { transform: translate(-25px, 25px) scale(0.92); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
        .animate-blob       { animation: blob 8s ease-in-out infinite; }
        .animate-fade-up    { animation: fade-up .6s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="relative flex min-h-screen select-none items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/70 to-cyan-50 px-4 py-10">
        {/* 🌈 Background blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-blob rounded-full bg-emerald-200/40 blur-3xl" />
        <div
          className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 animate-blob rounded-full bg-teal-200/40 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/4 h-64 w-64 animate-blob rounded-full bg-cyan-200/40 blur-3xl"
          style={{ animationDelay: "4s" }}
        />

        {/* 🎈 Floating decorative shapes */}
        <div className="animate-float-slow pointer-events-none absolute left-[12%] top-[20%] hidden h-12 w-12 rounded-2xl bg-emerald-400/20 ring-1 ring-emerald-300/40 backdrop-blur-sm lg:block" />
        <div
          className="animate-float-slow pointer-events-none absolute right-[15%] top-[30%] hidden h-8 w-8 rounded-full bg-cyan-400/25 ring-1 ring-cyan-300/40 lg:block"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="animate-float-slow pointer-events-none absolute bottom-[18%] left-[18%] hidden h-6 w-6 rounded-full bg-teal-400/25 ring-1 ring-teal-300/40 lg:block"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="animate-float-slow pointer-events-none absolute bottom-[25%] right-[12%] hidden h-10 w-10 rotate-12 rounded-xl bg-emerald-300/20 ring-1 ring-emerald-300/30 lg:block"
          style={{ animationDelay: "1s" }}
        />

        {/* 🃏 Main card */}
        <div className="animate-fade-up relative w-full max-w-xl overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-400/50 via-teal-400/20 to-cyan-400/50 p-[1.5px] shadow-2xl shadow-emerald-900/20">
          <div className="relative rounded-[27px] bg-white/90 px-6 py-10 text-center backdrop-blur-xl sm:px-10">
            {/* 🎬 Lottie animation */}
            <div className="mx-auto w-60 sm:w-72">
              <Lottie animationData={errorPage} loop={true} />
            </div>

            {/* 🔢 404 gradient number */}
            <p className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-5xl font-black tracking-[0.2em] text-transparent sm:text-6xl">
              404
            </p>

            {/* 📝 Title + description */}
            <h1 className="mt-2 text-2xl font-black text-slate-800 sm:text-3xl">
              {t("errorTitle")}
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500 sm:text-base">
              {t("errorDescription")}
            </p>

            {/* 🔘 Action buttons */}
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {/* Go Home — primary gradient */}
              <button
                onClick={handleGoHome}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/50 active:scale-95 sm:w-auto"
              >
                <FaHome className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                {t("goHome")}
              </button>

              {/* Go Back — outline glass */}
              <button
                onClick={handleGoBack}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/70 px-7 py-3 text-sm font-bold text-slate-600 ring-1 ring-slate-200 backdrop-blur transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:ring-emerald-300 active:scale-95 sm:w-auto"
              >
                <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                {t("goBack")}
              </button>
            </div>

            {/* Divider */}
            <div className="mx-auto my-7 h-px w-2/3 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* 🧭 Quick links — lost user ke path dekhay */}
            <div>
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                <FaCompass className="text-emerald-400" />
                {t("quickLinks")}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-700 hover:ring-emerald-300 active:scale-95"
                  >
                    {link.icon}
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorElement;