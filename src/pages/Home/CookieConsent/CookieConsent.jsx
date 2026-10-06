import { useState, useEffect } from "react";
import {
  FaCookieBite, FaCheck, FaTimes, FaCog, FaShieldAlt,
  FaChartBar, FaLock, FaExternalLinkAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // 🎬 thori delay — page load animation er por ashe
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
    if (consent === "accepted") enableAnalytics();
  }, []);

  const enableAnalytics = () => {
    // 📊 ekhane Google Analytics / gtag init korun
    console.log("✅ Analytics enabled");
  };

  const disableAnalytics = () => {
    console.log("❌ Analytics disabled");
  };

  /* 🎬 slide-down dismiss animation */
  const dismiss = (after) => {
    setIsLeaving(true);
    setTimeout(() => {
      setShowBanner(false);
      setIsLeaving(false);
      after?.();
    }, 300);
  };

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted");
    dismiss(() => {
      enableAnalytics();
      toast.success(t("cookieAccepted"), { autoClose: 2500 });
    });
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", "rejected");
    dismiss(() => {
      disableAnalytics();
      toast.info(t("cookieRejected"), { autoClose: 2500 });
    });
  };

  const handleSaveCustomize = () => {
    localStorage.setItem(
      "cookieConsent",
      analyticsAllowed ? "accepted" : "rejected"
    );
    dismiss(() => {
      analyticsAllowed ? enableAnalytics() : disableAnalytics();
      toast.success(t("cookieAccepted"), { autoClose: 2500 });
    });
  };

  if (!showBanner) return null;

  /* 🎚️ Toggle switch component */
  const Toggle = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        checked
          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
          : "bg-white/20"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes cookie-slide-up {
          from { transform: translateY(120%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes cookie-slide-down {
          from { transform: translateY(0); opacity: 1; }
          to   { transform: translateY(120%); opacity: 0; }
        }
        @keyframes cookie-wobble {
          0%, 100% { transform: rotate(-8deg); }
          50%      { transform: rotate(8deg); }
        }
        .animate-cookie-up   { animation: cookie-slide-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-cookie-down { animation: cookie-slide-down .3s ease-in both; }
        .animate-cookie-wobble { animation: cookie-wobble 2.5s ease-in-out infinite; }
      `}</style>

      <div
        className={`fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5 ${
          isLeaving ? "animate-cookie-down" : "animate-cookie-up"
        }`}
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* 🌈 Top gradient line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

          {!customizeOpen ? (
            /* ================= 🍪 Main view ================= */
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              {/* 🍪 Icon — wobbling */}
              <div className="flex shrink-0 items-center gap-4 sm:block">
                <span className="animate-cookie-wobble grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                  <FaCookieBite className="text-2xl" />
                </span>
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h3 className="flex items-center gap-2 text-base font-black text-white sm:text-lg">
                  {t("cookieTitle")}
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/25">
                    <FaShieldAlt className="text-[8px]" /> GDPR
                  </span>
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60 sm:text-sm">
                  {t("cookieText")}{" "}
                  <a
                    href="/cookie-policy"
                    className="inline-flex items-center gap-1 font-bold text-emerald-400 underline-offset-2 transition hover:underline"
                  >
                    {t("cookiePolicyLink")}
                    <FaExternalLinkAlt className="text-[9px]" />
                  </a>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:flex-col sm:items-stretch">
                <button
                  onClick={handleAcceptAll}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 active:scale-95 sm:flex-none"
                >
                  <FaCheck className="text-xs" />
                  {t("acceptAll")}
                </button>
                <div className="flex flex-1 gap-2.5 sm:flex-none">
                  <button
                    onClick={handleRejectAll}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white/70 ring-1 ring-white/15 transition-all duration-300 hover:bg-white/15 hover:text-white active:scale-95"
                  >
                    <FaTimes className="text-xs" />
                    {t("rejectAll")}
                  </button>
                  <button
                    onClick={() => setCustomizeOpen(true)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white/70 ring-1 ring-white/15 transition-all duration-300 hover:bg-white/15 hover:text-white active:scale-95"
                  >
                    <FaCog className="text-xs" />
                    {t("customize")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= ⚙️ Customize view ================= */
            <div className="p-5 sm:p-6">
              {/* Header */}
              <div className="mb-1 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-emerald-400 ring-1 ring-white/15">
                    <FaCog />
                  </span>
                  <h3 className="text-base font-black text-white sm:text-lg">
                    {t("customizeTitle")}
                  </h3>
                </div>
                <button
                  onClick={() => setCustomizeOpen(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/60 transition hover:rotate-90 hover:bg-white/20 hover:text-white duration-300"
                  aria-label="Back"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
              <p className="mb-5 text-xs leading-relaxed text-white/60 sm:text-sm">
                {t("customizeText")}
              </p>

              {/* 🍪 Essential — always on */}
              <div className="mb-3 flex items-center gap-3.5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <FaLock className="text-sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">
                    {t("essentialCookies")}
                  </p>
                  <p className="text-xs text-white/50">{t("essentialCookiesDesc")}</p>
                </div>
                <Toggle checked onChange={() => {}} disabled />
              </div>

              {/* 📊 Analytics — toggleable */}
              <div className="mb-5 flex items-center gap-3.5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition-colors hover:bg-white/10">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <FaChartBar className="text-sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">
                    {t("analyticsCookies")}
                  </p>
                  <p className="text-xs text-white/50">{t("analyticsCookiesDesc")}</p>
                </div>
                <Toggle checked={analyticsAllowed} onChange={setAnalyticsAllowed} />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={handleSaveCustomize}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 active:scale-95"
                >
                  <FaCheck className="text-xs" />
                  {t("savePreferences")}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white/70 ring-1 ring-white/15 transition-all duration-300 hover:bg-white/15 hover:text-white active:scale-95"
                >
                  <FaTimes className="text-xs" />
                  {t("rejectAll")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}