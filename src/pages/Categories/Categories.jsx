import React from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import CategoryCard from "./CategoryCard";
import { FaArrowRight, FaThLarge, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

/* 💀 Skeleton loader — data asar age shape dekhay */
const SkeletonCard = () => (
  <div className="animate-pulse rounded-3xl bg-[var(--color-surface)] p-5 shadow-lg ring-1 ring-[var(--color-border)]">
    <div className="mx-auto h-20 w-20 rounded-2xl bg-slate-300/50" />
    <div className="mx-auto mt-4 h-4 w-3/4 rounded-full bg-slate-300/50" />
    <div className="mx-auto mt-2 h-3 w-1/2 rounded-full bg-slate-300/40" />
  </div>
);

const Categories = () => {
  const Axios = useAxios();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories-with-count"],
    queryFn: async () => {
      const res = await Axios.get("/categories/with-count");
      return res.data;
    },
  });

  /* ⚠️ Error state — retry button soho */
  if (error)
    return (
      <section className="mx-auto my-20 max-w-7xl px-5 sm:px-8" aria-label="Browse categories">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">
            {t("categoriesSection.loadError")}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> Retry
          </button>
        </div>
      </section>
    );

  return (
    <section
      className="relative mx-auto my-20 max-w-7xl px-5 sm:px-8 lg:px-0"
      data-aos="fade-right"
      data-aos-offset="300"
      data-aos-easing="ease-in-sine"
      aria-label="Browse categories"
    >
      <ReTitle title={t("categoriesSection.docTitle")} />

      {/* ================= 📝 Section Header ================= */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          {/* Gradient icon + heading */}
          <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
              <FaThLarge className="text-lg" />
            </span>
            <span
              style={{ color: "var(--color-primary)" }}
              className="transition-all duration-300"
            >
              {t("heading")}
            </span>
          </h2>

          {/* Subtitle + decorative line */}
          <div className="mt-3 flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
            <p className="text-sm text-[var(--color-muted)] sm:text-base">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* ✅ View All — modern pill button */}
        <button
          onClick={() => navigate("/categories")}
          className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-5 py-2.5 text-sm font-bold text-[var(--color-secondary)] ring-1 ring-[var(--color-border)] shadow-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:ring-transparent hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95"
          aria-label={t("categoriesSection.viewAll")}
        >
          {t("viewAll")}
          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* ================= 🃏 Category Grid ================= */}
      {/* 💀 Loading e skeleton cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <div
              key={category._id}
              onClick={() => navigate(`/categories/${category._id}`)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[var(--color-surface)] shadow-lg ring-1 ring-[var(--color-border)] transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-900/15 hover:ring-emerald-400/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/categories/${category._id}`);
                }
              }}
              aria-label={`${t("categoriesSection.categoryLabel")} ${category.categoryName}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Top hover gradient line */}
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />

              {/* Bottom-right glow on hover */}
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-emerald-400/0 blur-2xl transition-all duration-500 group-hover:bg-emerald-400/25" />

              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Categories;