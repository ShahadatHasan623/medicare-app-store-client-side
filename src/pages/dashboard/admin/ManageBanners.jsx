import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaImages, FaToggleOn, FaToggleOff, FaUserEdit, FaInfoCircle,
  FaExclamationTriangle, FaBoxOpen, FaExternalLinkAlt, FaEyeSlash, FaEye,
} from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function ManageBanner() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["allAdvertisements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertisements/admin/all");
      return res.data || [];
    },
  });

  const toggleSliderMutation = useMutation({
    mutationFn: (adId) =>
      axiosSecure.patch(`/advertisements/admin/toggle-slider/${adId}`),
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: t("statusUpdated"),
        text: data?.data?.message,
        confirmButtonColor: "#10b981",
        timer: 1800,
        timerProgressBar: true,
      });
      queryClient.invalidateQueries({ queryKey: ["allAdvertisements"] });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: t("paymentFailed") || "Error",
        text: t("statusUpdateFailed"),
        confirmButtonColor: "#10b981",
      });
    },
  });

  /* 💀 Skeleton */
  if (isLoading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-16 rounded-3xl bg-slate-300/40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex h-24 items-center gap-5 rounded-3xl bg-slate-300/25 p-4" />
          ))}
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
        @keyframes live-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.5); }
          50%      { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }
        .animate-fade-up   { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-live-pulse{ animation: live-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg)] p-4 transition-colors duration-300 md:p-8">
        <ReTitle title={t("bannerDocTitle")} />

        <div className="mx-auto max-w-6xl">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3.5 text-white shadow-lg shadow-emerald-500/30">
                <FaImages className="text-xl" />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-[var(--color-text)] md:text-3xl">
                  {t("bannerHeading")}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  {t("bannerSubtitle")}
                </p>
              </div>
            </div>

            {/* Count chips */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 text-xs font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] shadow-sm sm:text-sm">
                <FaBoxOpen className="text-emerald-500" />
                {t("totalAds")}: {ads.length}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25 sm:text-sm">
                <FaEye className="text-xs" />
                {t("liveOnSlider")}: {liveCount}
              </span>
            </div>
          </div>

          {/* ================= 📭 Empty state ================= */}
          {ads.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <FaImages className="text-2xl" />
              </span>
              <p className="font-semibold text-[var(--color-muted)]">
                {t("noAdsFound")}
              </p>
            </div>
          ) : (
            /* ================= 🃏 Banner cards ================= */
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {ads.map((ad, index) => (
                <div
                  key={ad._id}
                  className={`animate-fade-up group relative overflow-hidden rounded-3xl border bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    ad.isOnSlider
                      ? "border-emerald-500/40 hover:shadow-emerald-900/15"
                      : "border-[var(--color-border)] opacity-85 hover:opacity-100"
                  }`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  {/* Left accent bar — live hole */}
                  <div
                    className={`absolute inset-y-0 left-0 w-1.5 transition-colors ${
                      ad.isOnSlider
                        ? "bg-gradient-to-b from-emerald-400 to-teal-500"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />

                  <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:p-5 sm:pl-6">
                    {/* 🖼️ Preview image */}
                    <div className="relative shrink-0 overflow-hidden rounded-2xl ring-1 ring-[var(--color-border)]">
                      <img
                        src={ad.medicineImage}
                        alt={ad.medicineName}
                        className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-20 sm:w-32"
                        loading="lazy"
                      />
                      {/* Live badge on image — live hole pulsing dot */}
                      {ad.isOnSlider && (
                        <span className="animate-live-pulse absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
                          <FaEye className="text-[10px]" />
                        </span>
                      )}
                    </div>

                    {/* 📝 Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate text-base font-black text-[var(--color-text)]">
                          {ad.medicineName}
                        </h4>
                        {/* Status pill */}
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${
                            ad.isOnSlider
                              ? "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25"
                              : "bg-slate-500/10 text-slate-500 ring-1 ring-slate-500/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              ad.isOnSlider ? "animate-pulse bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {ad.isOnSlider ? t("liveOnSlider") : t("inactive")}
                        </span>
                      </div>

                      <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-[var(--color-muted)] sm:line-clamp-2">
                        <FaInfoCircle className="mt-0.5 shrink-0 text-[10px] opacity-50" />
                        <span className="line-clamp-2">{ad.description}</span>
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
                        <FaUserEdit className="text-emerald-500/70" />
                        <span className="truncate">{ad.sellerEmail}</span>
                      </p>
                    </div>

                    {/* 🔘 Toggle button */}
                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleSliderMutation.mutate(ad._id)}
                        disabled={toggleSliderMutation.isLoading}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 sm:text-sm ${
                          ad.isOnSlider
                            ? "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/25 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/30"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                        }`}
                      >
                        {ad.isOnSlider ? (
                          <>
                            <FaToggleOff /> <FaEyeSlash className="hidden text-xs" />
                            {t("remove")}
                          </>
                        ) : (
                          <>
                            <FaToggleOn /> {t("showOnSlider")}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 📝 Footer note */}
          <p className="animate-fade-up mt-8 text-center text-xs leading-relaxed text-[var(--color-muted)]">
            * {t("bannerFooter")}
          </p>
        </div>
      </div>
    </>
  );
}