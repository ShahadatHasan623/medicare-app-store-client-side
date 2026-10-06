import React, { useState, useEffect } from "react";
import {
  FaUser, FaEnvelope, FaImage, FaSave, FaCrown,
  FaStore, FaEdit, FaTimes, FaCamera, FaIdBadge,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import { useRole } from "../../hooks/useRool";
import Swal from "sweetalert2";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { role, isLoadingRole } = useRole();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📥 ইউজারের ডিফল্ট ডাটা সেট করা
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || "",
        email: user.email || "",
        profilePic: user.photoURL || "",
      });
    }
  }, [user]);

  /* ⌨️ Modal open থাকলে ESC close + body scroll lock */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setIsModalOpen(false);
    if (isModalOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // ✏️ ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 প্রোফাইল আপডেট হ্যান্ডলার
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", { ...formData, role });
    setIsModalOpen(false);
    // ✅ translated Swal
    Swal.fire({
      title: t("successTitle"),
      text: t("successText"),
      icon: "success",
      confirmButtonColor: "#10b981",
      timer: 2000,
      timerProgressBar: true,
    });
    // এখানে backend/Firebase এর updateProfile API কল করতে হবে
  };

  // 🏅 Role Badge — ✅ translated
  const getRoleBadge = () => {
    if (role === "admin")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/30">
          <FaCrown className="text-[10px]" /> {t("roleAdmin")}
        </span>
      );
    if (role === "seller")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30">
          <FaStore className="text-[10px]" /> {t("roleSeller")}
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30">
        <FaUser className="text-[10px]" /> {t("roleUser")}
      </span>
    );
  };

  // ⏳ Loading state — ✅ translated
  if (isLoadingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
          <p className="text-sm font-semibold text-gray-500">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes modal-pop {
          0%   { transform: scale(.92) translateY(12px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-modal-pop { animation: modal-pop .25s cubic-bezier(.16,1,.3,1); }
        @keyframes fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in .2s ease-out; }
      `}</style>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-12">
        {/* 🌈 Background blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

        {/* 🪪 Profile Card */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-900/10 ring-1 ring-black/5">
          {/* Cover gradient */}
          <div className="relative h-28 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -left-6 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
              <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/20 blur-xl" />
            </div>
          </div>

          {/* 👤 Avatar */}
          <div className="relative -mt-14 flex flex-col items-center px-8 pb-8">
            <div className="group relative">
              <div className="rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[3px] shadow-xl shadow-emerald-500/25">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-100">
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt={formData.name || t("defaultName")}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-slate-400">
                      <FaUser className="text-5xl" />
                    </div>
                  )}
                </div>
              </div>

              {/* 📷 Camera badge */}
              <button
                onClick={() => setIsModalOpen(true)}
                aria-label={t("editProfile")}
                className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-white transition-all duration-300 hover:scale-110 hover:bg-emerald-600 active:scale-95"
              >
                <FaCamera className="text-xs" />
              </button>
            </div>

            {/* Name + Email */}
            <h1 className="mt-4 text-2xl font-black text-slate-800">
              {formData.name || t("defaultName")}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <FaEnvelope className="text-xs text-emerald-500" />
              {formData.email || "user@example.com"}
            </p>

            {/* Role badge */}
            <div className="mt-3">{getRoleBadge()}</div>

            {/* 📋 Info rows — ✅ translated labels */}
            <div className="mt-6 w-full space-y-2.5">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition hover:bg-slate-100/70">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                  <FaUser className="text-sm" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {t("fullName")}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {formData.name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition hover:bg-slate-100/70">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-600">
                  <FaEnvelope className="text-sm" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {t("emailAddress")}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {formData.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition hover:bg-slate-100/70">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                  <FaIdBadge className="text-sm" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {t("accountRole")}
                  </p>
                  <p className="truncate text-sm font-semibold capitalize text-slate-700">
                    {role || "user"}
                  </p>
                </div>
              </div>
            </div>

            {/* ✏️ Edit button — ✅ translated */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
            >
              <FaEdit className="transition-transform duration-300 group-hover:-rotate-12" />
              {t("editProfile")}
            </button>
          </div>
        </div>
      </div>

      {/* 🪟 Edit Modal — ✅ translated */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="animate-modal-pop relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <FaEdit /> {t("updateTitle")}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label={t("close")}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white transition hover:rotate-90 hover:bg-white/25 duration-300"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {/* 🖼️ Live preview */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2.5px]">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-slate-100">
                    {formData.profilePic ? (
                      <img
                        src={formData.profilePic}
                        alt={t("livePreview")}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                        onLoad={(e) => (e.target.style.display = "block")}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-slate-400">
                        <FaUser className="text-2xl" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {t("livePreview")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t("previewHint")}
                  </p>
                </div>
              </div>

              {/* Name input */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("fullName")}
                </span>
                <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 px-4 py-3 transition-all duration-300 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
                  <FaUser className="text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium outline-none"
                    placeholder={t("namePlaceholder")}
                  />
                </div>
              </label>

              {/* Profile Picture URL input */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("picUrlLabel")}
                </span>
                <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 px-4 py-3 transition-all duration-300 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
                  <FaImage className="text-gray-400" />
                  <input
                    type="url"
                    name="profilePic"
                    value={formData.profilePic}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium outline-none"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </label>

              {/* Buttons — ✅ translated */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 active:scale-95"
                >
                  <FaSave /> {t("saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProfile;