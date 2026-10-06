import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FaEye, FaCartPlus, FaTimes, FaArrowLeft, FaPills, FaIndustry,
  FaBoxOpen, FaInfoCircle, FaExclamationTriangle, FaRedo,
  FaShoppingBag, FaTag, FaLock,
} from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { useCart } from "../../utils/CartContext";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

const fetchMedicinesByCategoryId = async (Axios, categoryId) => {
  const res = await Axios.get(`/categories/${categoryId}/medicines`);
  return res.data;
};

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const Axios = useAxios();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["category-medicines", categoryId],
    queryFn: () => fetchMedicinesByCategoryId(Axios, categoryId),
  });

  /* ⌨️ Modal open thakle ESC close + body scroll lock */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    if (isModalOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <ReTitle title={t("categoryDetailsDocTitle")} />
        {/* 💀 Table skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-2/3 rounded-2xl bg-slate-300/40" />
          <div className="h-14 rounded-2xl bg-slate-300/40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-300/30" />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">
            {t("failedToLoadMedicines")}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> {t("retry")}
          </button>
        </div>
      </div>
    );

  const { category, medicines = [] } = data || {};

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedicine(null);
    setIsModalOpen(false);
  };

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
    toast.success(t("addedToCart", { name: medicine.name }));
  };

  /* 🏷️ Stock badge info */
  const getStockInfo = (stock) => {
    const s = stock ?? 0;
    if (s === 0)
      return { label: t("outOfStock"), cls: "bg-rose-500/15 text-rose-600 ring-rose-500/30", dot: "bg-rose-500" };
    if (s <= 10)
      return { label: t("lowStock"), cls: "bg-amber-500/15 text-amber-600 ring-amber-500/30", dot: "bg-amber-500" };
    return { label: t("inStock"), cls: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30", dot: "bg-emerald-500" };
  };

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
        .animate-fade-up  { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-modal-pop{ animation: modal-pop .25s cubic-bezier(.16,1,.3,1); }
        .animate-fade-in  { animation: fade-up .2s ease-out; }
      `}</style>

      <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6" role="main">
        <ReTitle title={t("categoryDetailsDocTitle")} />

        {/* ================= 🔙 Back + Hero Header ================= */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] shadow-sm transition-all duration-300 hover:ring-emerald-400 active:scale-95"
          aria-label={t("backToCategories")}
        >
          <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
          {t("backToCategories")}
        </button>

        {/* 🎨 Gradient hero banner */}
        <div className="animate-fade-up relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 shadow-xl shadow-emerald-500/25 sm:p-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-6 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/20 blur-xl" />
          </div>

          <div className="relative flex flex-wrap items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
              <FaPills className="text-2xl" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                {t("details")}
              </p>
              <h2
                className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl"
                aria-live="polite"
              >
                {t("categoryMedicinesHeading", { name: category?.categoryName || "..." })}
              </h2>
            </div>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur sm:text-sm">
              <FaBoxOpen />
              {medicines.length}
            </span>
          </div>
        </div>

        {/* ================= 📭 Empty state ================= */}
        {medicines.length === 0 ? (
          <div className="animate-fade-up mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center shadow-lg">
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
              <FaBoxOpen className="text-2xl" />
            </span>
            <p className="text-lg font-semibold text-[var(--color-muted)]">
              {t("noMedicinesFound")}
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 active:scale-95"
            >
              <FaShoppingBag /> {t("goToShop")}
            </button>
          </div>
        ) : (
          <>
            {/* ================= 🖥️ Desktop Table ================= */}
            <div className="animate-fade-up hidden overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 md:block">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
                    <th className="select-none px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                      {t("name")}
                    </th>
                    <th className="select-none px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                      {t("company")}
                    </th>
                    <th className="select-none px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                      {t("stock")}
                    </th>
                    <th className="select-none px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                      {t("price")}
                    </th>
                    <th className="select-none px-6 py-4 text-center text-xs font-black uppercase tracking-wider">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((med) => {
                    const stockInfo = getStockInfo(med.stock);
                    const discounted =
                      med.discount > 0
                        ? med.price - (med.price * (med.discount ?? 0)) / 100
                        : med.price;
                    return (
                      <tr
                        key={med._id}
                        className="group border-b border-[var(--color-border)] transition-colors duration-200 last:border-none hover:bg-emerald-500/5"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                              <FaPills className="text-sm" />
                            </span>
                            <span className="font-bold text-[var(--color-text)]">
                              {med.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-muted)]">
                          <span className="inline-flex items-center gap-1.5">
                            <FaIndustry className="text-xs opacity-60" />
                            {med.company}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${stockInfo.cls}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${stockInfo.dot}`} />
                            {stockInfo.label} · {med.stock ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-emerald-600">
                              ৳{discounted.toFixed(2)}
                            </span>
                            {med.discount > 0 && (
                              <>
                                <span className="text-xs text-[var(--color-muted)] line-through">
                                  ৳{med.price.toFixed(2)}
                                </span>
                                <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-black text-rose-500">
                                  {med.discount}% {t("off")}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2.5">
                            <button
                              onClick={() => openModal(med)}
                              className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:text-white active:scale-95"
                              title={`${t("viewDetails")} — ${med.name}`}
                              aria-label={`${t("viewDetails")} — ${med.name}`}
                            >
                              <FaEye size={15} />
                            </button>
                            <button
                              onClick={() => handleAddToCart(med)}
                              disabled={(med.stock ?? 0) === 0}
                              className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/10 text-teal-600 transition-all duration-300 hover:scale-110 hover:bg-teal-500 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-teal-500/10 disabled:hover:text-teal-600"
                              title={`${t("addToCart")} — ${med.name}`}
                              aria-label={`${t("addToCart")} — ${med.name}`}
                            >
                              <FaCartPlus size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ================= 📱 Mobile Cards ================= */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {medicines.map((med, index) => {
                const stockInfo = getStockInfo(med.stock);
                const discounted =
                  med.discount > 0
                    ? med.price - (med.price * (med.discount ?? 0)) / 100
                    : med.price;
                return (
                  <div
                    key={med._id}
                    className="animate-fade-up rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg shadow-black/5"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-xl bg-gradient-to-tr from-emerald-400/60 to-cyan-400/60 p-[2px] shadow">
                        <div className="h-16 w-16 overflow-hidden rounded-[10px] bg-white">
                          <img
                            src={med.image || "https://via.placeholder.com/100?text=💊"}
                            alt={med.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold text-[var(--color-text)]">
                          {med.name}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                          <FaIndustry className="text-[10px]" />
                          {med.company}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${stockInfo.cls}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${stockInfo.dot}`} />
                            {stockInfo.label}
                          </span>
                          {med.discount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-1 text-[10px] font-black text-rose-500">
                              <FaTag className="text-[8px]" />
                              {med.discount}% {t("off")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-dashed border-[var(--color-border)] pt-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-emerald-600">
                          ৳{discounted.toFixed(2)}
                        </span>
                        {med.discount > 0 && (
                          <span className="text-xs text-[var(--color-muted)] line-through">
                            ৳{med.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(med)}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 transition hover:bg-emerald-500 hover:text-white active:scale-95"
                          aria-label={`${t("viewDetails")} — ${med.name}`}
                        >
                          <FaEye size={15} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(med)}
                          disabled={(med.stock ?? 0) === 0}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaCartPlus size={13} />
                          {t("addToCart")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ================= 🪟 Details Modal ================= */}
      {isModalOpen && selectedMedicine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="animate-modal-pop relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-[var(--color-surface)]">
            {/* Gradient header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                  {t("details")}
                </p>
                <h3 className="truncate text-xl font-black text-white">
                  {selectedMedicine.name}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition duration-300 hover:rotate-90 hover:bg-white/25"
                title={t("close")}
                aria-label={t("close")}
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <div className="p-6">
              {/* Image */}
              <div className="rounded-2xl bg-gradient-to-tr from-emerald-400/30 to-cyan-400/30 p-[2px]">
                <div className="grid h-52 place-items-center rounded-[14px] bg-[var(--color-bg)]">
                  <img
                    src={selectedMedicine.image || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={selectedMedicine.name}
                    className="h-full w-full object-contain p-3"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Info grid */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <FaIndustry className="text-emerald-500" /> {t("company")}
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-[var(--color-text)]">
                    {selectedMedicine.company}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <FaBoxOpen className="text-emerald-500" /> {t("stock")}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                    {selectedMedicine.stock ?? 0}{" "}
                    <span className="text-xs font-medium text-gray-400">
                      {t("left")}
                    </span>
                  </p>
                </div>

                {/* Price — full width highlight */}
                <div className="col-span-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4 ring-1 ring-emerald-500/20">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    <FaTag className="text-emerald-500" /> {t("price")}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-2xl font-black tabular-nums text-transparent">
                      ৳
                      {(selectedMedicine.discount > 0
                        ? selectedMedicine.price -
                          (selectedMedicine.price * (selectedMedicine.discount ?? 0)) / 100
                        : selectedMedicine.price
                      ).toFixed(2)}
                    </span>
                    {selectedMedicine.discount > 0 && (
                      <span className="text-sm text-[var(--color-muted)] line-through">
                        ৳{selectedMedicine.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <FaInfoCircle className="text-emerald-500" /> {t("description")}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text)]">
                  {selectedMedicine.description || (
                    <em className="text-gray-400">{t("noDescription")}</em>
                  )}
                </p>
              </div>

              {/* Add to cart */}
              <button
                onClick={() => {
                  handleAddToCart(selectedMedicine);
                  closeModal();
                }}
                disabled={(selectedMedicine.stock ?? 0) === 0}
                className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaLock className="text-sm opacity-80" />
                {t("addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryDetails;