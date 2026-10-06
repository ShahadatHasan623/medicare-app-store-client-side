import React, { useEffect, useState } from "react";
import {
  FaEye, FaCartPlus, FaTimes, FaArrowLeft, FaArrowRight,
  FaSearch, FaPills, FaIndustry, FaTag, FaBoxOpen,
  FaShoppingCart, FaSortAmountDown, FaInfoCircle, FaCheck,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { useCart } from "../../utils/CartContext";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

const Shop = () => {
  const { addToCart } = useCart();
  const axios = useAxios();
  const { t } = useTranslation();

  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicines", page],
    queryFn: async () => {
      const res = await axios.get(`/medicines?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const medicines = data?.data || [];
  const totalPages = data?.totalPages || 1;

  /* 🔍 search + sort */
  const filteredMedicines = medicines
    .filter((med) =>
      med.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });

  /* 🔍 search change hole page reset */
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  /* ⌨️ Modal ESC close + scroll lock */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModalData(null);
    if (modalData) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalData]);

  const handleAddToCart = (med) => {
    addToCart(med);
    toast.success(t("addedToCart", { name: med.name ?? "Medicine" }), {
      position: "top-right",
      autoClose: 2500,
    });
  };

  /* 🏷️ Stock badge */
  const getStockInfo = (stock) => {
    const s = stock ?? 0;
    if (s === 0)
      return { label: t("outOfStock"), cls: "bg-rose-500/15 text-rose-600 ring-rose-500/30", dot: "bg-rose-500" };
    if (s <= 10)
      return { label: t("lowStock"), cls: "bg-amber-500/15 text-amber-600 ring-amber-500/30", dot: "bg-amber-500" };
    return { label: t("inStock"), cls: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30", dot: "bg-emerald-500" };
  };

  /* 💀 Card skeleton */
  if (isLoading && medicines.length === 0)
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mx-auto mb-4 h-10 w-72 animate-pulse rounded-2xl bg-slate-300/40" />
        <div className="mx-auto mb-10 h-4 w-52 animate-pulse rounded-full bg-slate-300/30" />
        <div className="mb-8 h-20 animate-pulse rounded-3xl bg-slate-300/35" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-300/25" />
          ))}
        </div>
      </div>
    );

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
        .animate-fade-up    { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-modal-pop  { animation: modal-pop .25s cubic-bezier(.16,1,.3,1); }
        .animate-fade-in    { animation: fade-up .2s ease-out; }
      `}</style>

      <div className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6">
        <ReTitle title={t("shopDocTitle")} />

        {/* ================= 📝 Header ================= */}
        <div className="animate-fade-up mb-8 text-center">
          <h1 className="flex flex-wrap items-center justify-center gap-3 text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl md:text-5xl">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 sm:h-14 sm:w-14">
              <FaPills className="text-xl sm:text-2xl" />
            </span>
            {t("shopHeading")}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-muted)] sm:text-base">
            {t("shopSubtitle")}
          </p>
        </div>

        {/* ================= 🎛️ Toolbar: search + sort ================= */}
        <div className="animate-fade-up mb-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg shadow-black/5 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* 🔍 Search */}
            <div className="relative flex-1 lg:max-w-sm">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
              <input
                type="text"
                placeholder={t("searchMedicine")}
                className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-11 pr-10 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 transition hover:text-rose-500"
                  aria-label="Clear"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort selects */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort by */}
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] sm:flex">
                  <FaSortAmountDown className="text-emerald-500" />
                  {t("sortBy")}
                </span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="cursor-pointer appearance-none rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs font-bold text-[var(--color-text)] outline-none transition-all duration-300 focus:border-emerald-400 sm:text-sm"
                >
                  <option value="name">{t("nameSort")}</option>
                  <option value="category">{t("categorySort")}</option>
                  <option value="price">{t("priceSort")}</option>
                </select>
              </div>

              {/* Order */}
              <div className="flex items-center gap-2">
                <span className="hidden text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] sm:block">
                  {t("orderBy")}
                </span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="cursor-pointer appearance-none rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs font-bold text-[var(--color-text)] outline-none transition-all duration-300 focus:border-emerald-400 sm:text-sm"
                >
                  <option value="asc">{t("ascLabel")}</option>
                  <option value="desc">{t("descLabel")}</option>
                </select>
              </div>

              {/* Result count chip */}
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25">
                <FaBoxOpen className="text-[10px]" />
                {filteredMedicines.length}
              </span>
            </div>
          </div>
        </div>

        {/* ================= 🃏 Product cards grid ================= */}
        {filteredMedicines.length === 0 ? (
          <div className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
              <FaSearch className="text-2xl" />
            </span>
            <p className="text-lg font-semibold text-[var(--color-muted)]">
              {t("noMedicinesFound")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMedicines.map((med, index) => {
              const stockInfo = getStockInfo(med.stock);
              const outOfStock = (med.stock ?? 0) === 0;
              return (
                <div
                  key={med._id}
                  className="animate-fade-up group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-900/15"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Top gradient line */}
                  <div className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />

                  {/* 🖼️ Image */}
                  <div className="relative h-44 overflow-hidden bg-[var(--color-bg)]">
                    <img
                      src={med.image}
                      alt={med.name ?? "medicine"}
                      className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Stock badge */}
                    <span
                      className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ring-1 backdrop-blur ${stockInfo.cls}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${stockInfo.dot} ${!outOfStock && "animate-pulse"}`} />
                      {stockInfo.label}
                    </span>
                    {/* Discount badge */}
                    {med.discount > 0 && (
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-rose-500 px-2.5 py-1 text-[9px] font-black text-white shadow-lg">
                        {med.discount}% OFF
                      </span>
                    )}

                    {/* 👁️ Hover overlay — view button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                      <button
                        onClick={() => setModalData(med)}
                        className="inline-flex translate-y-3 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold text-emerald-700 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:text-white group-hover:translate-y-0 active:scale-95"
                      >
                        <FaEye /> {t("viewDetails2")}
                      </button>
                    </div>
                  </div>

                  {/* 📝 Info */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-1 text-base font-black text-[var(--color-text)]">
                      {med.name ?? "N/A"}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                      <FaIndustry className="shrink-0 text-[10px] opacity-60" />
                      <span className="truncate">{med.company ?? "N/A"} · {med.unit ?? ""}</span>
                    </p>

                    {/* Category chip */}
                    {med.category && (
                      <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold capitalize text-emerald-600 ring-1 ring-emerald-500/20">
                        <FaTag className="text-[8px]" />
                        {med.category}
                      </span>
                    )}

                    {/* Price + cart — mt-auto so sob card e niche thakbe */}
                    <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                      <div>
                        <span className="text-xl font-black text-emerald-600">
                          ৳{med.price ?? med.perUnitPrice ?? "—"}
                        </span>
                        {med.discount > 0 && med.originalPrice && (
                          <span className="ml-1.5 text-xs text-[var(--color-muted)] line-through">
                            ৳{med.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        disabled={outOfStock}
                        onClick={() => handleAddToCart(med)}
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 active:scale-90 ${outOfStock
                            ? "cursor-not-allowed bg-slate-300 opacity-60 shadow-none"
                            : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/40"
                          }`}
                        aria-label={`${t("addToCart")} — ${med.name}`}
                        title={t("addToCart")}
                      >
                        {outOfStock ? <FaTimes className="text-sm" /> : <FaCartPlus />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= 📄 Pagination ================= */}
        {totalPages > 1 && (
          <div className="animate-fade-up mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-surface)] px-5 py-3 text-sm font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] shadow-sm transition-all duration-300 hover:ring-emerald-400 disabled:opacity-30 disabled:hover:ring-[var(--color-border)]"
            >
              <FaArrowLeft className="text-xs" /> {t("prev")}
            </button>

            <span className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/30">
              {t("page")} {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-surface)] px-5 py-3 text-sm font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] shadow-sm transition-all duration-300 hover:ring-emerald-400 disabled:opacity-30 disabled:hover:ring-[var(--color-border)]"
            >
              {t("next")} <FaArrowRight className="text-xs" />
            </button>
          </div>
        )}
      </div>

      {/* ================= 🪟 Details Modal ================= */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setModalData(null)}
          />

          <div className="animate-modal-pop relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-[var(--color-surface)]">
            {/* Gradient header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                  {t("details")}
                </p>
                <h2 className="truncate text-xl font-black text-white">
                  {modalData.name}
                </h2>
              </div>
              <button
                onClick={() => setModalData(null)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition duration-300 hover:rotate-90 hover:bg-white/25"
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
                    src={modalData.image}
                    alt={modalData.name}
                    className="h-full w-full object-contain p-3"
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
                    {modalData.company ?? "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <FaTag className="text-emerald-500" /> {t("categorySort")}
                  </p>
                  <p className="mt-1 truncate text-sm font-bold capitalize text-[var(--color-text)]">
                    {modalData.category ?? "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <FaBoxOpen className="text-emerald-500" /> {t("stock")}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                    {modalData.stock ?? 0} {t("left")}
                  </p>
                </div>

                {/* Price highlight */}
                <div className="col-span-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4 ring-1 ring-emerald-500/20">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    <FaTag className="text-emerald-500" /> {t("price")}
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-2xl font-black tabular-nums text-transparent">
                    ৳{modalData.price ?? modalData.perUnitPrice ?? "—"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <FaInfoCircle className="text-emerald-500" /> {t("description")}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text)]">
                  {modalData.description || (
                    <em className="text-gray-400">{t("noDescription")}</em>
                  )}
                </p>
              </div>

              {/* Add to cart */}
              <button
                onClick={() => {
                  handleAddToCart(modalData);
                  setModalData(null);
                }}
                disabled={(modalData.stock ?? 0) === 0}
                className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaCartPlus />
                {t("addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;