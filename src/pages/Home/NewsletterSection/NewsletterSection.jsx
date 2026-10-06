import React, { useState } from "react";
import {
  FaEnvelopeOpenText, FaPaperPlane, FaSpinner, FaCheckCircle,
  FaExclamationCircle, FaBell, FaGift, FaShieldAlt, FaTimes,
} from "react-icons/fa";
import useAxios from "../../../hooks/useAxios";
import { useTranslation } from "react-i18next";

export default function NewsletterSubscription() {
  const axios = useAxios();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // success / error / loading
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false); // 🎉 success screen

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // 🛡️ Validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage(t("invalidEmail"));
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await axios.post("/newsletter/subscribe", { email });
      if (res.data?.success) {
        setStatus("success");
        setIsSubscribed(true); // 🎉 success view switch
        setEmail("");
      } else {
        setStatus("error");
        setMessage(res.data?.message || t("subscribeFailed"));
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || t("serverError"));
    }
  };

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes envelope-float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50%      { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes confetti-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-up      { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-envelope-float { animation: envelope-float 3.5s ease-in-out infinite; }
        .animate-confetti-pop { animation: confetti-pop .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <section
        className="mx-auto my-20 max-w-3xl px-4 lg:px-0"
        data-aos="zoom-out-left"
        aria-label="Newsletter subscription"
      >
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-2xl shadow-emerald-900/25">
          <div className="relative overflow-hidden rounded-[30px] bg-slate-900 px-6 py-10 sm:px-10 sm:py-12">
            {/* 🌫️ Decorative glows */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

            {isSubscribed ? (
              /* ================= 🎉 Success state ================= */
              <div className="animate-fade-up relative flex flex-col items-center gap-4 py-6 text-center">
                <span className="animate-confetti-pop grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-xl shadow-emerald-500/40">
                  <FaCheckCircle className="text-4xl" />
                </span>
                <h2 className="text-2xl font-black text-white sm:text-3xl">
                  {t("subscribedTitle")}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                  {t("subscribedText")}
                </p>
                <button
                  onClick={() => setIsSubscribed(false)}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-bold text-white ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 active:scale-95"
                >
                  <FaEnvelopeOpenText className="text-xs" />
                  {t("newsletterHeading")}
                </button>
              </div>
            ) : (
              /* ================= 📝 Subscribe view ================= */
              <div className="relative">
                {/* 📬 Floating envelope icon */}
                <div className="animate-envelope-float mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[24px] bg-gradient-to-br from-emerald-400/40 via-teal-400/20 to-cyan-400/40 p-[2px] shadow-2xl shadow-emerald-500/25">
                  <div className="grid h-full w-full place-items-center rounded-[22px] bg-slate-900">
                    <FaEnvelopeOpenText className="text-3xl text-emerald-400" />
                  </div>
                </div>

                {/* Header */}
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {t("newsletterHeading")}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                    {t("newsletterSubtitle")}
                  </p>
                </div>

                {/* 📮 Email form — pill input + gradient button */}
                <form
                  onSubmit={handleSubscribe}
                  className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row"
                >
                  <div className="relative flex-1">
                    <FaEnvelopeOpenText className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40" />
                    <input
                      type="email"
                      placeholder={t("newsletterPlaceholder")}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") {
                          setStatus("");
                          setMessage("");
                        }
                      }}
                      className={`w-full rounded-2xl border-2 bg-white/5 py-3.5 pl-11 pr-10 text-sm font-medium text-white outline-none backdrop-blur transition-all duration-300 placeholder:text-white/40 ${
                        status === "error"
                          ? "border-rose-400/60 focus:border-rose-400"
                          : "border-white/15 focus:border-emerald-400"
                      }`}
                      aria-label={t("newsletterPlaceholder")}
                    />
                    {email && (
                      <button
                        type="button"
                        onClick={() => setEmail("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 transition hover:text-white"
                        aria-label="Clear"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/50 active:scale-95 disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t("subscribing")}
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        {t("subscribeBtn")}
                      </>
                    )}
                  </button>
                </form>

                {/* ⚠️ Error message */}
                {status === "error" && message && (
                  <p className="animate-fade-up mx-auto mt-4 flex max-w-lg items-center justify-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-300">
                    <FaExclamationCircle className="shrink-0" />
                    {message}
                  </p>
                )}

                {/* 🛡️ Trust row */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 border-t border-white/10 pt-6">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
                    <FaShieldAlt className="text-[10px] text-emerald-400" />
                    {t("noSpam")}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
                    <FaGift className="text-[10px] text-amber-400" />
                    {t("specialOffer")}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
                    <FaBell className="text-[10px] text-cyan-400" />
                    {t("freeDeliveryNote")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}