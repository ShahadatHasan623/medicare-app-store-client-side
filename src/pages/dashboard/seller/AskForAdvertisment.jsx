import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import {
  FaAd, FaPlus, FaImage, FaPills, FaFileAlt, FaEye, FaEyeSlash,
  FaTimes, FaCheckCircle, FaHourglassHalf, FaBoxOpen, FaExclamationTriangle, FaRedo,
  FaPaperPlane,
} from "react-icons/fa";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function AskForAdvertisement() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: "",
    medicineImage: "",
    description: "",
  });

  /* ================= ✅ LOGIC — preserved ================= */
  const fetchSellerAds = async (sellerEmail) => {
    const res = await axiosSecure.get(`/advertisements/seller/${sellerEmail}`);
    return res.data || [];
  };

  const {
    data: ads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["sellerAds", user.email],
    queryFn: () => fetchSellerAds(user.email),
    enabled: !!user.email,
  });

  const swalDark = () => ({
    background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
    color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
    confirmButtonColor: "#10b981",
  });

  const addAdMutation = useMutation({
    mutationFn: (newAd) => axiosSecure.post("/advertisements/seller/add", newAd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerAds", user.email] });
      setShowModal(false);
      Swal.fire({ icon: "success", text: t("adAdded"), timer: 1800, showConfirmButton: false, timerProgressBar: true, ...swalDark() });
      setFormData({ medicineName: "", medicineImage: "", description: "" });
    },
    onError: () => {
      Swal.fire({ icon: "error", text: t("adAddFailed"), ...swalDark() });
    },
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAdMutation.mutate({ ...formData, sellerEmail: user.email });
  };

  /* 🎨 Input class */
  const inputCls =
    "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:ring-emerald-900/40";

  /* 💀 Skeleton */
  if (isLoading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] p-4 sm:p-6">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-3 h-9 w-64 rounded-2xl bg-slate-300/40" />
          <div className="mb-8 h-4 w-48 rounded-full bg-slate-300/30" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-slate-300/25" />
            ))}
          </div>
        </div>
      </div>
    );

  /* ⚠️ Error */
  if (isError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-6">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> {t("retry")}
          </button>
        </div>
      </div>
    );

  const liveCount = ads.filter((ad) => ad.isOnSlider).length;

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modal-pop {
          0%   { transform: scale(.92) translateY(12px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-fade-up   { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-modal-pop { animation: modal-pop .25s cubic-bezier(.16,1,.3,1); }
        .animate-fade-in   { animation: fade-up .2s ease-out; }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg)] p-4 transition-colors duration-300 sm:p-6">
        <ReTitle title={t("adsDocTitle")} />

        <div className="mx-auto max-w-6xl">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <FaAd className="text-xl" />
                </span>
                {t("adsHeading")}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] sm:text-base">
                {t("adsSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Count chips */}
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25 sm:text-sm">
                <FaBoxOpen className="text-xs" />
                {t("totalAds2")}: {ads.length}
              </span>
              {liveCount > 0 && (
                <span className="hidden inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-600 ring-1 ring-cyan-500/25 sm:inline-flex sm:text-sm">
                  <FaEye className="animate-pulse text-xs" />
                  {t("onSlider")}: {liveCount}
                </span>
              )}

              <button
                onClick={() => setShowModal(true)}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
              >
                <FaPlus className="text-xs transition-transform duration-300 group-hover:rotate-90" />
                {t("addAdvertisement")}
              </button>
            </div>
          </div>

          {/* ================= 📭 Empty state ================= */}
          {ads.length === 0 ? (
            <div className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <FaAd className="text-2xl" />
              </span>
              <p className="font-semibold text-[var(--color-muted)]">{t("noAdsFound")}</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition active:scale-95"
              >
                <FaPlus /> {t("addAdvertisement")}
              </button>
            </div>
          ) : (
            /* ================= 🃏 Ad cards ================= */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ads.map((ad, index) => (
                <div
                  key={ad._id}
                  className={`animate-fade-up group relative flex flex-col overflow-hidden rounded-3xl border bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    ad.isOnSlider
                      ? "border-emerald-500/40 hover:shadow-emerald-900/15"
                      : "border-[var(--color-border)]"
                  }`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Top gradient line */}
                  <div
                    className={`absolute inset-x-0 top-0 z-10 h-1 origin-left transition-transform duration-500 group-hover:scale-x-100 ${
                      ad.isOnSlider
                        ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                        : "scale-x-0 bg-gradient-to-r from-slate-400 to-slate-300"
                    }`}
                  />

                  {/* 🖼️ Image */}
                  <div className="relative h-44 overflow-hidden bg-[var(--color-bg)]">
                    <img
                      src={ad.medicineImage}
                      alt={ad.medicineName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Status badge — on image */}
                    {ad.isOnSlider ? (
                      <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg backdrop-blur">
                        <FaCheckCircle className="text-[10px]" />
                        {t("onSliderBadge")}
                      </span>
                    ) : (
                      <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg backdrop-blur">
                        <FaHourglassHalf className="text-[10px]" />
                        {t("notOnSlider")}
                      </span>
                    )}
                  </div>

                  {/* 📝 Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-1 text-base font-black text-[var(--color-text)]">
                      {ad.medicineName}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--color-muted)] sm:text-sm">
                      {ad.description}
                    </p>

                    {/* Status footer */}
                    <div
                      className={`mt-4 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold ring-1 ${
                        ad.isOnSlider
                          ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                      }`}
                    >
                      {ad.isOnSlider ? (
                        <>
                          <FaEye className="text-xs" />
                          {t("onSlider")} — {t("featured") || "Featured"}
                        </>
                      ) : (
                        <>
                          <FaEyeSlash className="text-xs" />
                          {t("notOnSlider")}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= 🪟 Add Ad Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="animate-modal-pop relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
          >
            {/* Gradient header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4">
              <h3 className="flex items-center gap-2.5 text-lg font-black text-white">
                <FaAd />
                {t("addAdvertisement")}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition duration-300 hover:rotate-90 hover:bg-white/25"
                aria-label={t("close")}
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* 🖼️ Live image preview */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                <div className="rounded-xl bg-gradient-to-tr from-emerald-400/50 to-cyan-400/50 p-[2px]">
                  <div className="h-14 w-20 overflow-hidden rounded-[10px] bg-white">
                    {formData.medicineImage ? (
                      <img
                        src={formData.medicineImage}
                        alt={t("previewLabel")}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                        onLoad={(e) => (e.target.style.display = "block")}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-slate-300">
                        <FaImage className="text-lg" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs font-semibold text-[var(--color-muted)]">
                  {t("previewLabel")}
                </p>
              </div>

              {/* Medicine name */}
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("adMedicineName")} *
                </span>
                <div className="relative">
                  <FaPills className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                  <input
                    type="text"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder={t("adMedicineName")}
                  />
                </div>
              </label>

              {/* Image URL */}
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("adImageUrl")} *
                </span>
                <div className="relative">
                  <FaImage className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                  <input
                    type="url"
                    name="medicineImage"
                    value={formData.medicineImage}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="https://..."
                  />
                </div>
              </label>

              {/* Description */}
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("adDescription")} *
                </span>
                <div className="relative">
                  <FaFileAlt className="pointer-events-none absolute left-4 top-3.5 text-sm text-slate-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder={t("adDescription")}
                  />
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={addAdMutation.isLoading}
                className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-60"
              >
                {addAdMutation.isLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
                    {t("adSubmitting")}
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    {t("adSubmitBtn")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}