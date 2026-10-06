import React from "react";
import { useNavigate } from "react-router";
import {
  FaPills, FaClinicMedical, FaCapsules, FaSyringe, FaThermometerHalf,
  FaArrowRight, FaBoxOpen,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

/* 🏷️ Category name onujayi icon — default clinic */
const getIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("capsule")) return <FaCapsules />;
  if (n.includes("syrup") || n.includes("liquid")) return <FaSyringe />;
  if (n.includes("tablet") || n.includes("pill")) return <FaPills />;
  if (n.includes("therapy") || n.includes("device")) return <FaThermometerHalf />;
  return <FaClinicMedical />;
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const count = category.medicineCount ?? 0;

  const handleClick = () => {
    navigate(`/categories/${category._id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={t("categoryAria", { name: category.categoryName })}
      className="group relative aspect-[4/5] w-full cursor-pointer select-none overflow-hidden rounded-3xl bg-[var(--color-surface)] shadow-lg ring-1 ring-[var(--color-border)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-900/20 hover:ring-emerald-400/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
    >
      {/* 🖼️ Full-bleed image */}
      <img
        src={category.image || "https://i.ibb.co/default-category.png"}
        alt={category.categoryName}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "https://i.ibb.co/default-category.png";
        }}
      />

      {/* 🌗 Gradient overlay — hover e emerald tone */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent transition-all duration-500 group-hover:from-emerald-950/90 group-hover:via-emerald-950/30" />

      {/* 🩺 Icon badge — top-left */}
      <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-white/90 text-emerald-600 shadow-md backdrop-blur transition-all duration-500 group-hover:rotate-6 group-hover:bg-emerald-500 group-hover:text-white">
        {getIcon(category.categoryName)}
      </span>

      {/* 🔢 Count chip — top-right */}
      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold text-white ring-1 ring-white/25 backdrop-blur sm:text-[11px]">
        <FaBoxOpen className="text-[9px] text-emerald-300" />
        {count} {count === 1 ? t("medicine") : t("medicines")}
      </span>

      {/* 📝 Bottom content — name + explore reveal */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-black capitalize leading-tight text-white drop-shadow sm:text-base md:text-lg">
          {category.categoryName}
        </h3>

        {/* ✨ Explore pill — hover e slide-up */}
        <span className="mt-2 inline-flex translate-y-6 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white opacity-0 ring-1 ring-white/30 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-xs">
          {t("exploreNow")}
          <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;