import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  FaCartPlus, FaStar, FaPercent, FaChevronLeft, FaChevronRight,
  FaExclamationTriangle, FaRedo, FaTag, FaIndustry, FaFireAlt, FaTimes,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useAxios from "../../../hooks/useAxios";
import { useCart } from "../../../utils/CartContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const DiscountProducts = () => {
  const axiosInstance = useAxios();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const { data: discountProducts = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["discount-products"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/medicines/discounted");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(t("addedToCart", { name: product.name ?? "Medicine" }), {
      position: "top-right",
      autoClose: 2500,
    });
  };

  /* 🏷️ Stock badge */
  const getStockInfo = (stock) => {
    const s = stock ?? 0;
    if (s === 0)
      return { label: t("outOfStock"), cls: "bg-rose-500/90 text-white", dot: "bg-white" };
    if (s <= 10)
      return { label: t("lowStock"), cls: "bg-amber-500/90 text-white", dot: "bg-white" };
    return { label: t("inStock"), cls: "bg-emerald-500/90 text-white", dot: "bg-white" };
  };

  /* 💀 Skeleton — card shaped */
  if (isLoading)
    return (
      <section className="mx-auto my-16 max-w-7xl px-4 lg:px-0">
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="h-10 w-72 animate-pulse rounded-2xl bg-slate-300/40" />
          <div className="h-4 w-56 animate-pulse rounded-full bg-slate-300/30" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-3xl bg-slate-300/25" />
          ))}
        </div>
      </section>
    );

  /* ⚠️ Error — retry soho */
  if (isError)
    return (
      <section className="mx-auto my-16 max-w-7xl px-4">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">
            {t("discountLoadError")}
          </p>
          <p className="text-xs text-[var(--color-muted)]">{error?.message}</p>
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
  if (discountProducts.length === 0)
    return (
      <section className="mx-auto my-16 max-w-7xl px-4">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <FaPercent className="text-xl" />
          </span>
          <p className="font-semibold text-[var(--color-muted)]">
            {t("noDiscountProducts")}
          </p>
        </div>
      </section>
    );

  return (
    <section
      className="group/discount relative mx-auto my-16 max-w-7xl px-4 lg:px-0"
      data-aos="fade-left"
      data-aos-anchor="#example-anchor"
      data-aos-offset="500"
      data-aos-duration="500"
      aria-label="Discounted Products"
    >
      {/* ================= 📝 Section header — apnar onno section er moto ================= */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30">
              <FaPercent className="text-lg" />
            </span>
            <span style={{ color: "var(--color-primary)" }}>
              {t("discountHeading")}
            </span>
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-rose-500 to-orange-400" />
            <p className="text-sm text-[var(--color-muted)] sm:text-base">
              {t("discountSubtitle")}
            </p>
          </div>
        </div>

        {/* 🔥 Hot deal badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-600 ring-1 ring-rose-500/25 sm:text-sm">
          <FaFireAlt className="animate-pulse text-xs" />
          {t("featured")} · {discountProducts.length}
        </span>
      </div>

      {/* ================= 🎠 Slider ================= */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={3}
          navigation={{
            nextEl: ".discount-next",
            prevEl: ".discount-prev",
          }}
          pagination={{
            clickable: true,
            bulletClass: "discount-bullet",
            bulletActiveClass: "discount-bullet-active",
          }}
          grabCursor
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          aria-live="polite"
          className="!pb-12"
        >
          {discountProducts.map((product) => {
            const discountedPrice = Math.round(
              product.price - (product.price * product.discount) / 100
            );
            const stockInfo = getStockInfo(product.stock);
            const outOfStock = (product.stock ?? 0) === 0;
            const rating = Math.min(product.reviews ?? 0, 5);

            return (
              <SwiperSlide key={product._id} className="!h-auto">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-900/10">
                  {/* Top gradient line */}
                  <div className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 transition-transform duration-500 group-hover:scale-x-100" />

                  {/* 🖼️ Image */}
                  <div className="relative h-44 overflow-hidden bg-[var(--color-bg)]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Discount badge — rose */}
                    {product.discount > 0 && (
                      <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-2.5 py-1 text-[10px] font-black text-white shadow-lg shadow-rose-500/30">
                        <FaPercent className="text-[8px]" />
                        {product.discount}% {t("off")}
                      </span>
                    )}

                    {/* Stock badge */}
                    <span
                      className={`absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider backdrop-blur ${stockInfo.cls}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${stockInfo.dot} ${!outOfStock && "animate-pulse"}`} />
                      {stockInfo.label}
                    </span>

                    {/* Hover overlay — cart button reveal */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={outOfStock}
                        className="inline-flex translate-y-3 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold text-emerald-700 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:text-white group-hover:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`${t("addToCart")} — ${product.name}`}
                      >
                        {outOfStock ? <FaTimes /> : <FaCartPlus />}
                        {t("addToCart")}
                      </button>
                    </div>
                  </div>

                  {/* 📝 Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3
                      className="line-clamp-1 text-base font-black text-[var(--color-text)]"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--color-muted)]"
                      title={product.company}
                    >
                      <FaIndustry className="shrink-0 text-[10px] opacity-60" />
                      <span className="truncate">{product.company}</span>
                    </p>

                    {/* ⭐ Ratings */}
                    <div className="mt-2.5 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-[11px] ${
                            i < rating
                              ? "text-amber-400"
                              : "text-[var(--color-border)]"
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-[10px] font-semibold text-[var(--color-muted)]">
                        ({product.reviews || 0} {t("reviews")})
                      </span>
                    </div>

                    {/* 💰 Price */}
                    <div className="mt-auto pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-emerald-600">
                          ৳{discountedPrice}
                        </span>
                        <span className="text-xs text-[var(--color-muted)] line-through">
                          ৳{product.price}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-[var(--color-muted)]">
                        {t("perUnit")}
                      </p>
                    </div>

                    {/* 🛒 Add to cart button — mobile e overlay button na dekhle o kaj kore */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={outOfStock}
                      className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.97] disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
                      aria-label={`${t("addToCart")} — ${product.name}`}
                    >
                      {outOfStock ? <FaTimes className="text-xs" /> : <FaCartPlus />}
                      {t("addToCart")}
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* ◀️ Custom nav arrows — hover e, mobile e always */}
        <button
          className="discount-prev absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] shadow-xl ring-1 ring-[var(--color-border)] transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:text-white hover:ring-emerald-400 active:scale-95 lg:-left-4 lg:opacity-0 lg:group-hover/discount:opacity-100"
          aria-label="Previous"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <button
          className="discount-next absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] shadow-xl ring-1 ring-[var(--color-border)] transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:text-white hover:ring-emerald-400 active:scale-95 lg:-right-4 lg:opacity-0 lg:group-hover/discount:opacity-100"
          aria-label="Next"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>

      {/* 🎨 Pill pagination bullets */}
      <style>{`
        .discount-bullet {
          width: 20px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(148, 163, 184, .35);
          transition: all .4s ease;
          cursor: pointer;
          display: inline-block;
        }
        .discount-bullet-active {
          width: 38px;
          background: linear-gradient(90deg, #10b981, #14b8a6);
          box-shadow: 0 0 10px rgba(16, 185, 129, .5);
        }
      `}</style>
    </section>
  );
};

export default DiscountProducts;