import React, { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import {
  FaQuestionCircle, FaEdit, FaPaperPlane, FaSpinner,
  FaComments, FaLightbulb, FaCheckCircle,
} from "react-icons/fa";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function FAQForm() {
  const axios = useAxios();
  const { t } = useTranslation();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const Q_MIN = 10;
  const Q_MAX = 200;
  const A_MAX = 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Validation — min length
    if (question.trim().length < Q_MIN) {
      Swal.fire({
        icon: "warning",
        text: t("questionMin", { min: Q_MIN }),
        confirmButtonColor: "#10b981",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("/faqs", { question, answer });

      Swal.fire({
        icon: "success",
        title: t("faqPublished"),
        text: t("faqPublishedText"),
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      });

      setQuestion("");
      setAnswer("");
    } catch (err) {
      console.error("Error submitting FAQ:", err);
      Swal.fire({
        icon: "error",
        title: t("faqFailed"),
        text: t("faqFailedText"),
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  /* 🎨 Shared input classes */
  const inputCls =
    "w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-emerald-400 focus:bg-transparent focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40";

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="mx-auto my-12 max-w-2xl px-4">
        <ReTitle title={t("faqFormDocTitle")} />

        <div className="animate-fade-up overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-emerald-900/10">
          {/* ================= 🌈 Gradient header ================= */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -left-6 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
              <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/20 blur-xl" />
            </div>

            <div className="relative flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
                <FaQuestionCircle className="text-xl" />
              </span>
              <div>
                <h2 className="text-lg font-black text-white sm:text-xl">
                  {t("faqFormHeading")}
                </h2>
                <p className="mt-0.5 text-xs text-white/75 sm:text-sm">
                  {t("faqFormSubtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* ================= 📝 Form ================= */}
          <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
            {/* Question input + counter */}
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  <FaEdit className="text-emerald-500" />
                  {t("faqQuestionLabel")} *
                </span>
                {/* 📏 Char counter */}
                <span
                  className={`text-[10px] font-bold tabular-nums ${
                    question.length > Q_MAX
                      ? "text-rose-500"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  {question.length}/{Q_MAX}
                </span>
              </span>
              <input
                type="text"
                maxLength={Q_MAX}
                placeholder={t("faqQuestionPlaceholder")}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={inputCls}
                required
              />
            </label>

            {/* Answer textarea + counter */}
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  <FaPaperPlane className="text-emerald-500" />
                  {t("faqAnswerLabel")} *
                </span>
                <span
                  className={`text-[10px] font-bold tabular-nums ${
                    answer.length > A_MAX
                      ? "text-rose-500"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  {answer.length}/{A_MAX}
                </span>
              </span>
              <textarea
                maxLength={A_MAX}
                placeholder={t("faqAnswerPlaceholder")}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                className={`${inputCls} resize-none`}
                required
              />
            </label>

            {/* ✨ Live preview — duto field fill korle dekhabe */}
            {(question.trim() || answer.trim()) && (
              <div className="animate-fade-up rounded-2xl bg-[var(--color-bg)] p-4 ring-1 ring-[var(--color-border)]">
                <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                  <FaCheckCircle className="text-emerald-500" />
                  {t("faqPreview")}
                </p>
                <div className="flex items-start gap-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-[11px] text-emerald-600">
                    Q
                  </span>
                  <p className="text-sm font-bold text-[var(--color-text)]">
                    {question.trim() || "—"}
                  </p>
                </div>
                {answer.trim() && (
                  <div className="mt-2.5 flex items-start gap-2.5 border-t border-dashed border-[var(--color-border)] pt-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-500/10 text-[11px] text-teal-600">
                      A
                    </span>
                    <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                      {answer.trim()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {t("processing")}
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  {t("faqPublishBtn")}
                </>
              )}
            </button>
          </form>
        </div>

        {/* 💡 Helper footer */}
        <p className="animate-fade-up mt-6 flex items-center justify-center gap-2 text-center text-sm text-[var(--color-muted)]">
          <FaLightbulb className="shrink-0 text-amber-400" />
          {t("faqTip")}
        </p>
      </div>
    </>
  );
}