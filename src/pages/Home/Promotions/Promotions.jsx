import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaGift, FaCartPlus, FaIndustry, FaExclamationTriangle,
  FaRedo, FaPercent, FaHeart, FaCheck, FaRegHeart,
} from "react-icons/fa";
import useAxios from "../../../hooks/useAxios";
import { useCart } from "../../../utils/CartContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Promotions({ category = "" }) {
  const axios = useAxios();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  /* ❤️ Wishlist — local state (backend connect korle context e nite hobe) */
  const [wishlist, setWishlist] = useState(new Set());

  const toggleWishlist = (id, name) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`${name} ${t("removedFromWishlist")}`);
      } else {
        next.add(id);
        toast.success(`${name} ${t("addedToWishlist")}`);
      }
      return next;
    });
  };

  const { data: promotions = [], isLoading, error, refetch } = useQuery({
    queryKey: ["promotions", category],
    queryFn: async () => {
      let url = "/categories/promotions/all";
      if (category) url += `?category=${category}`;
      const res = await axios.get(url);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  /* 🛒 Add to cart */
  const handleAddToCart = (item) => {
    const cartItem = {
      ...item,
      price: item.discountPrice || item.price,
      offerType: item.discountPrice ? "Discount" : undefined,
    };
    addToCart(cartItem);
    toast.success(t("addedToCart", { name: item.name ?? "Medicine" }), {
      position: "top-right",
      autoClose: 2500,
    });
  };

  /* 💰 Calculations */
  const getDiscountPct = (item) => {
    if (!item.discountPrice || !item.price) return 0;
    return Math.round(((item.price - item.discountPrice) / item.price) * 100);
  };
  const getSavings = (item) => {
    if (!item.discountPrice || !item.price) return 0;
    return (item.price - item.discountPrice).toFixed(0);
  };

  /* 💀 Skeleton */
  if (isLoading)
    return (
      <section className="mx-auto my-16 max-w-7xl px-4 lg:px-0">
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="h-10 w-72 animate-pulse rounded-2xl bg-slate-300/40" />
          <div className="h-4 w-56 animate-pulse rounded-full bg-slate-300/30" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-300/25" />
          ))}
        </div>
      </section>
    );

  /* ⚠️ Error */
  if (error)
    return (
      <section className="mx-auto my-16 max-w-7xl px-4">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">{t("promotionsLoadError")}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> {t("retry")}
          </button>
        </div>
      </section>
    );

  /* 📭 Empty */
  if (promotions.length === 0)
    return (
      <section className="mx-auto my-16 max-w-7xl px-4">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <FaGift className="text-xl" />
          </span>
          <p className="font-semibold text-[var(--color-muted)]">{t("noPromotions")}</p>
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
        @keyframes heart-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .animate-fade-up  { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-heart-pop{ animation: heart-pop .4s ease; }
      `}</style>

      <section
        className="mx-auto my-16 max-w-7xl px-4 lg:px-0"
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
        aria-label="Promotions"
      >
        {/* ================= 📝 Header ================= */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                <FaGift className="text-lg" />
              </span>
              <span style={{ color: "var(--color-primary)" }}>
                {t("promotionsHeading")}
              </span>
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
              <p className="text-sm text-[var(--color-muted)] sm:text-base">
                {t("promotionsSubtitle")}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-600 ring-1 ring-amber-500/25 sm:text-sm">
            <FaPercent className="animate-pulse text-xs" />
            {t("specialOffer")} · {promotions.length}
          </span>
        </div>

        {/* ================= 🃏 Promo cards ================= */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {promotions.map((item, index) => {
            const discountPct = getDiscountPct(item);
            const hasDiscount = Boolean(item.discountPrice);
            const liked = wishlist.has(item._id);

            return (
              <div
                key={item._id}
                className="animate-fade-up group relative flex flex-col overflow-hidden rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-900/15"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Top gradient line */}
                <div className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-transform duration-500 group-hover:scale-x-100" />

                {/* 🖼️ Image + hover actions */}
                <div className="relative aspect-square overflow-hidden bg-[var(--color-bg)]">
                  <img
                    src={item.image || "https://i.ibb.co/default-category.png"}
                    alt={item.name}
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://i.ibb.co/default-category.png";
                    }}
                  />

                  {/* Discount badge */}
                  {hasDiscount && (
                    <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[9px] font-black text-white shadow-lg shadow-amber-500/30">
                      <FaPercent className="text-[8px]" />
                      {discountPct}% {t("off")}
                    </span>
                  )}

                  {/* ❤️ Wishlist heart — top right */}
                  <button
                    onClick={() => toggleWishlist(item._id, item.name)}
                    className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full backdrop-blur transition-all duration-300 hover:scale-110 active:scale-90 ${
                      liked
                        ? "animate-heart-pop bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                        : "bg-white/85 text-slate-500 hover:text-rose-500"
                    }`}
                    aria-label={t("addToWishlist")}
                    title={t("addToWishlist")}
                  >
                    {liked ? <FaHeart className="text-xs" /> : <FaRegHeart className="text-xs" />}
                  </button>
                </div>

                {/* 📝 Content */}
                <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                  <h3
                    className="line-clamp-2 text-xs font-black leading-snug text-[var(--color-text)] sm:text-sm"
                    title={item.name}
                  >
                    {item.name}
                  </h3>

                  <p
                    className="mt-1 flex items-center gap-1 text-[10px] text-[var(--color-muted)]"
                    title={item.company}
                  >
                    <FaIndustry className="shrink-0 text-[8px] opacity-60" />
                    <span className="truncate">{item.company}</span>
                  </p>

                  {/* 💰 Price + savings */}
                  <div className="mt-auto pt-2.5">
                    {hasDiscount ? (
                      <>
                        <div className="flex flex-wrap items-baseline gap-x-1.5">
                          <span className="text-base font-black text-emerald-600 sm:text-lg">
                            ৳{item.discountPrice}
                          </span>
                          <span className="text-[10px] text-[var(--color-muted)] line-through">
                            ৳{item.price}
                          </span>
                        </div>
                        {/* ✨ NEW: You save strip */}
                        <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black text-emerald-600">
                          <FaCheck className="text-[7px]" />
                          {t("youSave")} ৳{getSavings(item)}
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-black text-emerald-600 sm:text-lg">
                        ৳{item.price}
                      </span>
                    )}
                  </div>

                  {/* 🛒 Add to cart */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="group/btn mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-[11px] font-bold text-white shadow-md shadow-emerald-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 active:scale-95 sm:text-xs"
                    aria-label={`${t("addToCart")} — ${item.name}`}
                  >
                    <FaCartPlus className="text-[10px] transition-transform duration-300 group-hover/btn:-rotate-12" />
                    {t("goToShop")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}