import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import GoogleLogin from "./soicalLogin/GoogleLogin";
import signUpLottie from "../../assets/register.json";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import {
  FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaImage,
  FaUserTag, FaArrowRight, FaCheck, FaSpinner, FaInfoCircle,
} from "react-icons/fa";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { createUser, updateProfileUser } = useAuth();
  const [photourl, setPhotoUrl] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const axiosUser = useAxios();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* 🌗 Swal dark helper */
  const swalDark = () => ({
    background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
    color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
    confirmButtonColor: "#10b981",
  });

  const onSubmit = async (data) => {
    const { email, password, name, role } = data;

    try {
      await createUser(email, password);

      const userInfo = {
        email,
        name: name,
        role,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      await axiosUser.post("/users", userInfo);

      const userProfile = {
        displayName: name,
        photoURL: photourl || "https://i.ibb.co/0y7VvYb/default-avatar.png",
      };
      await updateProfileUser(userProfile);

      Swal.fire({
        icon: "success",
        title: t("signupSuccess"),
        text: t("signupSuccessText"),
        timer: 2000,
        timerProgressBar: true,
        ...swalDark(),
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: t("signupError"),
        text: err.message,
        ...swalDark(),
      });
    }
  };

  const handleImageChange = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setImgUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    const imageUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_key
    }`;

    try {
      const res = await axios.post(imageUrl, formData);
      if (res.data?.success) {
        setPhotoUrl(res.data.data.url);
      } else {
        Swal.fire({ icon: "error", text: t("imageUploadFail"), ...swalDark() });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire({ icon: "error", text: t("imageUploadFail"), ...swalDark() });
    } finally {
      setImgUploading(false);
    }
  };

  /* 🎨 Input classes — light + dark, focus-aware */
  const inputCls = (field) =>
    `w-full rounded-2xl border-2 py-3.5 pl-11 pr-4 text-base font-medium outline-none transition-all duration-300 sm:text-sm ${
      errors[field]
        ? "border-rose-400 bg-rose-50/40 dark:border-rose-500/60 dark:bg-rose-500/10"
        : focusedField === field
        ? "border-emerald-400 bg-white ring-4 ring-emerald-100 dark:bg-slate-800 dark:ring-emerald-900/40"
        : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
    }`;

  const inputPlainCls = (field) =>
    `w-full rounded-2xl border-2 py-3.5 px-4 text-base font-medium outline-none transition-all duration-300 sm:text-sm ${
      errors[field]
        ? "border-rose-400 bg-rose-50/40 dark:border-rose-500/60 dark:bg-rose-500/10"
        : focusedField === field
        ? "border-emerald-400 bg-white ring-4 ring-emerald-100 dark:bg-slate-800 dark:ring-emerald-900/40"
        : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
    }`;

  const errorCls = "mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-500";

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

      {/* 🌗 Page bg — dark ready */}
      <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/60 to-cyan-50 p-3 py-8 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
        <ReTitle title={t("signupDocTitle")} />

        {/* 🌈 Blobs */}
        <div className="animate-blob pointer-events-none absolute -left-24 -top-24 h-52 w-52 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10 sm:h-80 sm:w-80" />
        <div
          className="animate-blob pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10 sm:h-96 sm:w-96"
          style={{ animationDelay: "2s" }}
        />

        {/* ================= 🃏 Main card — Login er sathe matching ================= */}
        <div className="animate-fade-up relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400/50 via-teal-400/20 to-cyan-400/50 p-[1.5px] shadow-2xl shadow-emerald-900/20 dark:shadow-black/40 md:flex-row md:rounded-[28px]">
          <div className="flex flex-col overflow-hidden rounded-[22px] bg-white dark:bg-slate-900 md:flex-row md:rounded-[27px]">

            {/* ================= 🎨 Left: Branding + Lottie ================= */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-5 sm:p-7 md:w-1/2 md:p-10">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

              {/* Brand */}
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

              {/* 🎬 Lottie — mobile e-o dekhabe (age hidden chilo) */}
              <Lottie
                animationData={signUpLottie}
                loop={true}
                className="relative w-full max-w-[160px] drop-shadow-2xl sm:max-w-[220px] md:h-96 md:max-w-sm"
              />

              {/* ✨ Signup benefit chips */}
              <div className="relative mt-4 hidden w-full max-w-xs flex-col gap-2.5 md:flex">
                {["100% Genuine Medicines", "Track Your Orders", "Seller Dashboard"].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur transition-all duration-300 hover:bg-white/15"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 text-sm">
                      <FaCheck />
                    </span>
                    <span className="text-sm font-semibold text-white/85">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= 📝 Right: Form ================= */}
            <div className="flex-1 p-5 sm:p-8 md:p-12">
              <div className="mb-6 text-center md:mb-8 md:text-left">
                <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white sm:text-2xl md:text-3xl">
                  {t("signupWelcome")} ✨
                </h2>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm md:text-base">
                  {t("signupSubtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                {/* 👤 Name */}
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("nameLabel")} *
                  </span>
                  <div className="relative">
                    <FaUser
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 sm:text-base ${
                        focusedField === "name" ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      placeholder={t("namePlaceholder")}
                      className={inputCls("name")}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {errors.name && (
                    <p className={errorCls}>
                      <FaInfoCircle /> {t("nameRequired")}
                    </p>
                  )}
                </label>

                {/* 🖼️ Photo upload — custom styled */}
                <div>
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("photoLabel")}
                  </span>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed p-3 transition-all duration-300 ${
                      photourl
                        ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10"
                        : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                    }`}
                  >
                    {/* Preview / icon */}
                    {photourl ? (
                      <img
                        src={photourl}
                        alt="Preview"
                        className="h-12 w-12 rounded-xl object-cover ring-2 ring-emerald-400"
                      />
                    ) : (
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        {imgUploading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaImage />
                        )}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-700 dark:text-slate-200">
                        {imgUploading
                          ? t("photoUploading")
                          : photourl
                          ? t("photoUploaded")
                          : t("photoLabel")}
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                        {t("photoHint")}
                      </span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 📧 Email */}
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("emailLabel")} *
                  </span>
                  <div className="relative">
                    <FaEnvelope
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 sm:text-base ${
                        focusedField === "email" ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      placeholder={t("emailPlaceholder")}
                      className={inputCls("email")}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {errors.email && (
                    <p className={errorCls}>
                      <FaInfoCircle /> {t("emailRequired")}
                    </p>
                  )}
                </label>

                {/* 🔒 Password */}
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("passwordLabel")} *
                  </span>
                  <div className="relative">
                    <FaLock
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 sm:text-base ${
                        focusedField === "password" ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: true,
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                      })}
                      placeholder={t("passwordPlaceholder")}
                      className={`${inputCls("password")} pr-12`}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-slate-400 transition-colors hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  {errors.password?.type === "required" && (
                    <p className={errorCls}>
                      <FaInfoCircle /> {t("passwordRequired")}
                    </p>
                  )}
                  {errors.password?.type === "pattern" && (
                    <p className={errorCls}>
                      <FaInfoCircle /> {t("passwordRule")}
                    </p>
                  )}
                </label>

                {/* 👥 Role — radio cards (NEW!) */}
                <div>
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("roleLabel")} *
                  </span>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {[
                      { value: "user", label: t("roleUser"), icon: <FaUser /> },
                      { value: "seller", label: t("roleSeller"), icon: <FaUserTag /> },
                    ].map((r) => (
                      <label key={r.value} className="cursor-pointer">
                        <input
                          type="radio"
                          value={r.value}
                          {...register("role", { required: true })}
                          defaultChecked={r.value === "user"}
                          className="peer sr-only"
                        />
                        <div className="flex items-center gap-2.5 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 transition-all duration-300 peer-checked:border-emerald-400 peer-checked:bg-emerald-50 peer-checked:ring-4 peer-checked:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800/60 dark:peer-checked:bg-emerald-500/10 dark:peer-checked:ring-emerald-900/40">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-500 transition peer-checked:bg-emerald-500 peer-checked:text-white dark:bg-slate-700">
                            {r.icon}
                          </span>
                          <span className="text-[11px] font-bold leading-tight text-slate-600 dark:text-slate-300 sm:text-xs">
                            {r.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.role && (
                    <p className={errorCls}>
                      <FaInfoCircle /> {t("roleLabel")}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={imgUploading}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-70"
                >
                  {imgUploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {t("photoUploading")}
                    </>
                  ) : (
                    <>
                      {t("registerBtn")}
                      <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-1">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200 dark:via-slate-700 dark:to-slate-700" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                    {t("orDivider")}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200 dark:via-slate-700 dark:to-slate-700" />
                </div>

                <GoogleLogin />

                {/* Login link */}
                <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400 sm:pt-3">
                  {t("haveAccount")}{" "}
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-1 font-black text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    <span className="underline-offset-2 group-hover:underline">
                      {t("loginLink")}
                    </span>
                    <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;