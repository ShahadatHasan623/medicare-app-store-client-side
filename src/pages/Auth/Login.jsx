import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Login.json";
import {
  FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight,
  FaShieldAlt, FaTruck, FaHeadset,
} from "react-icons/fa";
import GoogleLogin from "./soicalLogin/GoogleLogin";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { signIn, resetPass } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const from = location.state?.from?.pathname || "/";

  /* 🎨 Input — light + dark variants */
  const inputCls = (field) =>
    `w-full rounded-2xl border-2 py-3.5 pl-11 pr-4 text-base font-medium outline-none transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 sm:text-sm ${
      focusedField === field
        ? "border-emerald-400 ring-4 ring-emerald-100 bg-white dark:bg-slate-800 dark:ring-emerald-900/40"
        : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
    }`;

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: t("fillAllFields"),
        confirmButtonColor: "#10b981",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      Swal.fire({
        icon: "success",
        title: t("loginSuccess"),
        text: t("loginSuccessText"),
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
      navigate(from);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: t("loginFailed"),
        text: err.message || "Something went wrong",
        confirmButtonColor: "#10b981",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    const email = emailRef.current.value;
    if (!email) {
      Swal.fire({
        icon: "info",
        title: t("enterEmailFirst"),
        confirmButtonColor: "#10b981",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
      return;
    }
    try {
      await resetPass(email);
      Swal.fire({
        icon: "success",
        title: "📧 " + t("resetSent"),
        confirmButtonColor: "#10b981",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.message,
        confirmButtonColor: "#10b981",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
    }
  };

  const trustItems = [
    { icon: <FaShieldAlt />, text: "Genuine Medicines" },
    { icon: <FaTruck />, text: "Fast Delivery" },
    { icon: <FaHeadset />, text: "24/7 Support" },
  ];

  /* 🌗 Swal dark helper — beshirbhag Swal e reuse */
  const swalDark = () => ({
    background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
    color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
  });

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(30px, -40px) scale(1.1); }
          66%      { transform: translate(-25px, 25px) scale(0.92); }
        }
        .animate-fade-up { animation: fade-up .6s cubic-bezier(.16,1,.3,1) both; }
        .animate-blob    { animation: blob 8s ease-in-out infinite; }
      `}</style>

      {/* 🌗 Page bg — dark: slate-950 gradient */}
      <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/60 to-cyan-50 p-3 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
        <ReTitle title={t("loginDocTitle")} />

        {/* 🌈 Blobs — dark e emerald glow */}
        <div className="animate-blob pointer-events-none absolute -left-24 -top-24 h-52 w-52 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10 sm:h-80 sm:w-80" />
        <div
          className="animate-blob pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10 sm:h-96 sm:w-96"
          style={{ animationDelay: "2s" }}
        />

        {/* ================= 🃏 Main card ================= */}
        <div className="animate-fade-up relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400/50 via-teal-400/20 to-cyan-400/50 p-[1.5px] shadow-2xl shadow-emerald-900/20 dark:shadow-black/40 md:flex-row md:rounded-[28px]">
          <div className="flex flex-col overflow-hidden rounded-[22px] bg-white transition-colors duration-300 dark:bg-slate-900 md:flex-row md:rounded-[27px]">

            {/* ================= 🎨 Left panel — dark/light dutoi gradient (already dark) ================= */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-5 sm:p-7 md:w-1/2 md:p-10">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

              <div className="relative mb-4 text-center md:mb-6">
                <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">
                  Medi
                  <span className="bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                    Care
                  </span>
                </h1>
                <p className="mt-1 text-xs font-semibold text-white/70 sm:mt-2 sm:text-sm">
                  {t("brandTagline")}
                </p>
              </div>

              <Lottie
                loop={true}
                animationData={loginAnimation}
                className="relative w-full max-w-[180px] drop-shadow-2xl sm:max-w-[240px] md:max-w-sm"
              />

              <div className="relative mt-4 flex w-full max-w-xs gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-8 md:grid md:grid-cols-1 md:gap-2.5 md:overflow-visible md:pb-0">
                {trustItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur transition-all duration-300 hover:bg-white/15 md:gap-3 md:rounded-2xl md:px-4 md:py-2.5"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/15 text-xs md:h-8 md:w-8 md:text-sm">
                      {item.icon}
                    </span>
                    <span className="whitespace-nowrap text-[11px] font-semibold text-white/85 md:text-sm">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= 📝 Right: Form — 🌗 dark variants ================= */}
            <div className="flex-1 p-5 sm:p-8 md:p-12">
              <div className="mb-6 text-center md:mb-8 md:text-left">
                <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white sm:text-2xl md:text-3xl">
                  {t("loginWelcome")} 👋
                </h2>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm md:text-base">
                  {t("loginSubtitle")}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
                {/* 📧 Email */}
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("emailLabel")}
                  </span>
                  <div className="relative">
                    <FaEnvelope
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 sm:text-base ${
                        focusedField === "email"
                          ? "text-emerald-500"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <input
                      ref={emailRef}
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className={inputCls("email")}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </label>

                {/* 🔒 Password */}
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("passwordLabel")}
                  </span>
                  <div className="relative">
                    <FaLock
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 sm:text-base ${
                        focusedField === "password"
                          ? "text-emerald-500"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <input
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      className={`${inputCls("password")} pr-12`}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-slate-400 transition-colors hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  <span className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 sm:text-[11px]">
                    🔒 {t("passwordHint")}
                  </span>
                </label>

                {/* Forgot */}
                <div className="-mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="px-1 py-1.5 text-sm font-bold text-emerald-600 underline-offset-2 transition-all hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {t("forgotPassword")}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
                      {t("signingIn")}
                    </>
                  ) : (
                    <>
                      {t("signIn")}
                      <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Divider — dark variant */}
                <div className="flex items-center gap-4 py-1">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200 dark:via-slate-700 dark:to-slate-700" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                    {t("orDivider")}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200 dark:via-slate-700 dark:to-slate-700" />
                </div>

                <GoogleLogin />

                <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400 sm:pt-3">
                  {t("noAccount")}{" "}
                  <NavLink
                    to="/signup"
                    className="group inline-flex items-center gap-1 font-black text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    <span className="underline-offset-2 group-hover:underline">
                      {t("createAccount")}
                    </span>
                    <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;