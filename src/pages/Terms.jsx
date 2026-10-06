import React, { useState, useEffect } from "react";
import {
  FaFileContract, FaInfoCircle, FaBookOpen, FaUserShield,
  FaCreditCard, FaSyncAlt, FaCheckCircle, FaFileSignature,
} from "react-icons/fa";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

/* 📜 Terms sections — icon + gradient per section */
const termsContent = [
  {
    title: "Introduction",
    icon: <FaInfoCircle />,
    gradient: "from-emerald-500 to-teal-500",
    text: "Welcome to our website. By using our services, you agree to the following terms and conditions. Please read them carefully before using any part of this platform.",
  },
  {
    title: "Use of Content",
    icon: <FaBookOpen />,
    gradient: "from-cyan-500 to-blue-500",
    text: "All content on this site is for informational purposes only and should not replace professional medical advice. Always consult a qualified healthcare provider before making decisions about your health.",
  },
  {
    title: "Privacy",
    icon: <FaUserShield />,
    gradient: "from-violet-500 to-purple-500",
    text: "We respect your privacy and handle your data according to our privacy policy. Your personal information is never sold to third parties and is protected with industry-standard security measures.",
  },
  {
    title: "Purchases & Payments",
    icon: <FaCreditCard />,
    gradient: "from-amber-500 to-orange-500",
    text: "Any purchase made on this site is subject to our payment and refund policies. Prices are subject to change, and orders may be cancelled if stock is unavailable or payment cannot be verified.",
  },
  {
    title: "Changes to Terms",
    icon: <FaSyncAlt />,
    gradient: "from-rose-500 to-red-500",
    text: "We may update these terms from time to time. Users will be notified of changes on this page. Continued use of the site after changes constitutes acceptance of the new terms.",
  },
];

export default function Terms() {
  const { t } = useTranslation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("acceptedTerms") === "true") {
      setAcceptedTerms(true);
    }
  }, []);

  /* 📜 Scroll progress + active section tracking */
  useEffect(() => {
    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setReadProgress(Math.min(progress, 100));

      let current = 0;
      termsContent.forEach((_, idx) => {
        const el = document.getElementById(`terms-section-${idx}`);
        if (el && el.getBoundingClientRect().top < 200) current = idx;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem("acceptedTerms", "true");
    setAcceptedTerms(true);
  };

  const jumpTo = (idx) => {
    document.getElementById(`terms-section-${idx}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        {/* 🌈 Scroll progress bar */}
        <div className="sticky top-0 z-40 h-1 w-full">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-[width] duration-150"
            style={{ width: `${readProgress}%` }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/25">
              <FaFileSignature className="text-xs" />
              {t("termsLastUpdated")}: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </span>
            <h1 className="flex flex-wrap items-center justify-center gap-3 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 sm:h-14 sm:w-14">
                <FaFileContract className="text-xl sm:text-2xl" />
              </span>
              <span style={{ color: "var(--color-primary)" }}>
                {t("termsHeading")}
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)] sm:text-base">
              {t("termsSubtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row">
            {/* ================= 📑 Sticky TOC (desktop) ================= */}
            <aside className="hidden lg:block lg:w-64 lg:shrink-0">
              <div className="sticky top-24 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-lg shadow-black/5">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {t("privacyReadProgress")}: {Math.round(readProgress)}%
                </p>
                <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-emerald-500/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-150"
                    style={{ width: `${readProgress}%` }}
                  />
                </div>

                <nav className="space-y-1">
                  {termsContent.map((section, idx) => (
                    <button
                      key={idx}
                      onClick={() => jumpTo(idx)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-300 ${
                        activeSection === idx
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "text-[var(--color-muted)] hover:bg-emerald-500/5 hover:text-emerald-600"
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[9px] font-black transition-all ${
                          activeSection === idx
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ================= 📄 Content ================= */}
            <main className="min-w-0 flex-1">
              <div className="space-y-5">
                {termsContent.map((section, idx) => (
                  <section
                    key={idx}
                    id={`terms-section-${idx}`}
                    className="animate-fade-up group scroll-mt-24 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md shadow-black/5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/10"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex items-center gap-4 border-b border-dashed border-[var(--color-border)] p-5">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${section.gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                      >
                        {section.icon}
                      </span>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                          Section {String(idx + 1).padStart(2, "0")}
                        </p>
                        <h2 className="text-lg font-black text-[var(--color-text)] sm:text-xl">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <p className="px-5 py-4 text-sm leading-relaxed text-[var(--color-muted)] sm:text-[15px]">
                      {section.text}
                    </p>
                  </section>
                ))}
              </div>

              {/* ✅ Accepted indicator */}
              {acceptedTerms && (
                <div className="animate-fade-up mt-8 flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500/10 py-4 text-sm font-bold text-emerald-600 ring-1 ring-emerald-500/25">
                  <FaCheckCircle />
                  {t("termsAccepted")}
                </div>
              )}

              <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
                © {new Date().getFullYear()} MediCare · {t("termsHeading")}
              </p>
            </main>
          </div>
        </div>

        {/* ================= 📝 Accept banner ================= */}
        {!acceptedTerms && (
          <div
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 p-4 shadow-2xl backdrop-blur-lg"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="flex items-start gap-2.5 text-center text-xs leading-relaxed text-[var(--color-text)] sm:text-left sm:text-sm">
                <FaFileSignature className="mt-0.5 shrink-0 text-emerald-500" />
                {t("acceptBannerTerms")}
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <a
                  href="/terms"
                  className="text-sm font-bold text-[var(--color-primary)] underline-offset-2 transition hover:underline"
                >
                  {t("readTerms")}
                </a>
                <button
                  onClick={handleAcceptTerms}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 active:scale-95"
                >
                  <FaCheckCircle className="text-xs" />
                  {t("acceptTerms")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}