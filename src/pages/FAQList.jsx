import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaQuestionCircle, FaSearch, FaChevronDown, FaExclamationTriangle,
  FaRedo, FaComment, FaRegComments, FaTimes,
} from "react-icons/fa";
import useAxios from "../hooks/useAxios";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function FAQAccordionMUI() {
  const axios = useAxios();
  const { t } = useTranslation();

  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const { data: faqs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axios.get("/faqs");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  /* 🔍 Search filter */
  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q)
    );
  }, [faqs, search]);

  /* 🔀 Toggle accordion */
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /* 💀 Skeleton */
  if (isLoading)
    return (
      <section className="mx-auto my-16 max-w-4xl px-4 sm:px-5">
        <div className="mb-4 h-10 w-80 mx-auto animate-pulse rounded-2xl bg-slate-300/40" />
        <div className="mx-auto mb-10 h-4 w-56 animate-pulse rounded-full bg-slate-300/30" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-300/25" />
          ))}
        </div>
      </section>
    );

  /* ⚠️ Error */
  if (isError)
    return (
      <section className="mx-auto my-16 max-w-4xl px-4">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">{t("faqLoadError")}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> {t("retry")}
          </button>
        </div>
      </section>
    );

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes answer-slide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up      { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-answer-slide { animation: answer-slide .3s ease-out; }
      `}</style>

      <section
        className="mx-auto my-16 max-w-4xl px-4 sm:px-5"
        aria-label="Frequently asked questions"
      >
        <ReTitle title={t("faqPageDocTitle")} />

        {/* ================= 📝 Header ================= */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <h2 className="flex flex-wrap items-center justify-center gap-3 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
              <FaQuestionCircle className="text-lg" />
            </span>
            <span style={{ color: "var(--color-primary)" }}>
              {t("faqHeading")}
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-transparent to-emerald-500" />
            <p className="text-sm text-[var(--color-muted)] sm:text-base">
              {t("faqSubtitle")}
            </p>
            <span className="h-[3px] w-10 rounded-full bg-gradient-to-l from-transparent to-emerald-500" />
          </div>
        </div>

        {/* ================= 🔍 Search bar ================= */}
        {faqs.length > 0 && (
          <div className="animate-fade-up mb-8 flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("faqSearch")}
                className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-11 pr-10 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 transition hover:text-rose-500"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Count chip */}
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25">
              <FaRegComments className="text-[10px]" />
              {filteredFaqs.length} {t("faqsCount")}
            </span>
          </div>
        )}

        {/* ================= 📋 Accordion list ================= */}
        {faqs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
              <FaQuestionCircle className="text-2xl" />
            </span>
            <p className="font-semibold text-[var(--color-muted)]">
              {t("noFaqsFound")}
            </p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-500/10 text-slate-400">
              <FaSearch className="text-xl" />
            </span>
            <p className="font-semibold text-[var(--color-muted)]">
              {t("noFaqMatch")}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq._id || index}
                  className={`animate-fade-up overflow-hidden rounded-2xl border bg-[var(--color-surface)] shadow-md shadow-black/5 transition-all duration-300 ${
                    isOpen
                      ? "border-emerald-400/50 shadow-lg shadow-emerald-900/10"
                      : "border-[var(--color-border)] hover:border-emerald-400/30 hover:shadow-lg"
                  }`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* 🎯 Question button */}
                  <button
                    onClick={() => toggle(index)}
                    className="flex w-full items-center gap-3.5 px-4 py-4 text-left transition-colors duration-300 hover:bg-emerald-500/5 sm:px-5 sm:py-5"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    {/* Q badge — gradient, open hole filled */}
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black transition-all duration-300 ${
                        isOpen
                          ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}
                    >
                      Q{index + 1}
                    </span>

                    {/* Question text */}
                    <span className="flex-1 text-sm font-bold leading-snug text-[var(--color-text)] sm:text-base">
                      {faq.question}
                    </span>

                    {/* Chevron — rotate on open */}
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-emerald-500 text-white"
                          : "bg-[var(--color-bg)] text-[var(--color-muted)]"
                      }`}
                    >
                      <FaChevronDown />
                    </span>
                  </button>

                  {/* 💬 Answer — conditional with slide animation */}
                  {isOpen && (
                    <div
                      id={`faq-panel-${index}`}
                      className="animate-answer-slide border-t border-dashed border-[var(--color-border)] px-4 py-4 sm:px-5"
                    >
                      <div className="flex items-start gap-3.5">
                        {/* A badge */}
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-500/10 text-xs font-black text-teal-600">
                          A
                        </span>
                        <p className="flex-1 text-sm leading-relaxed text-[var(--color-muted)] sm:text-[15px]">
                          {faq.answer}
                        </p>
                      </div>

                      {/* 💬 Helpful hint */}
                      <p className="mt-3 flex items-center gap-1.5 pl-[52px] text-[11px] font-semibold text-[var(--color-muted)]">
                        <FaComment className="text-[10px] text-emerald-500" />
                        {t("faqSubtitle")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}