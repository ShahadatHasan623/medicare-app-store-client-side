import React from "react";
import {
  FaShieldAlt, FaCheckCircle, FaUsers, FaPills, FaStore, FaHeadset,
  FaHandshake, FaAward,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const brands = [
  { name: "Pfizer", logo: "https://i.ibb.co.com/YFBYtpjL/Pfizer-Logo.png" },
  { name: "Johnson & Johnson", logo: "https://i.ibb.co.com/k2X7r8R6/JJ-Logo-Stacked-Red-RGB.webp" },
  { name: "Novartis", logo: "https://i.ibb.co.com/gFWvzfnX/D8-Jv-HC8-Wq-Tql-Ejox4-Zi434-NJ8v-Alr-G.png" },
  { name: "GSK", logo: "https://i.ibb.co.com/fG4mWZrV/GSK-logo.png" },
];

const certifications = [
  {
    name: "FDA Approved",
    logo: "https://i.ibb.co.com/zTbQJt9D/fda-approved-label-fda-validated-quality-and-safety-assurance-png.webp",
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/30",
  },
  {
    name: "GMP Certified",
    logo: "https://i.ibb.co.com/cXbmg7ss/Certified-GMP-Logo-PNG-Transparent-Image.png",
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/30",
  },
  {
    name: "ISO 9001",
    logo: "https://i.ibb.co.com/8LgKLnVD/261-2610411-free-consultancy-for-selecting-right-rudraksha-iso-9001.png",
    gradient: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-500/30",
  },
];

const trustStats = [
  { icon: <FaUsers />, labelKey: "statCustomers", valueKey: "statCustomersVal", gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/25" },
  { icon: <FaPills />, labelKey: "statProducts", valueKey: "statProductsVal", gradient: "from-cyan-500 to-blue-500", shadow: "shadow-cyan-500/25" },
  { icon: <FaStore />, labelKey: "statSellers", valueKey: "statSellersVal", gradient: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/25" },
  { icon: <FaHeadset />, labelKey: "statSupport", valueKey: "statSupportVal", gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/25" },
];

export default function BrandTrustSection() {
  const { t } = useTranslation();

  return (
    <section
      className="mx-auto my-20 max-w-7xl px-4 lg:px-0"
      data-aos="zoom-in-left"
      aria-label="Trusted brands and certifications"
    >
      {/* ================= 📝 Section header ================= */}
      <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-12">
        <h2 className="flex flex-wrap items-center justify-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
            <FaShieldAlt className="text-lg" />
          </span>
          <span style={{ color: "var(--color-primary)" }}>
            {t("brandsHeading")}
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-transparent to-emerald-500" />
          <p className="text-sm text-[var(--color-muted)] sm:text-base">
            {t("brandsSubtitle")}
          </p>
          <span className="h-[3px] w-10 rounded-full bg-gradient-to-l from-transparent to-emerald-500" />
        </div>
      </div>

      {/* ================= 📊 Trust stats bar ================= */}
      <div className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {trustStats.map((stat) => (
          <div
            key={stat.labelKey}
            className="group relative flex items-center gap-3.5 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-5"
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 sm:h-12 sm:w-12`}
            >
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-black tabular-nums text-transparent sm:text-2xl">
                {t(stat.valueKey)}
              </p>
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] sm:text-xs">
                {t(stat.labelKey)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= 🏢 Brand logos ================= */}
      <div className="mb-12">
        {/* Label */}
        <p className="mb-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] sm:text-xs">
          <FaHandshake className="text-emerald-500" />
          {t("brandsLabel")}
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="group relative flex h-28 items-center justify-center overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-md shadow-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-900/15 sm:h-32"
              title={brand.name}
            >
              {/* Hover gradient glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-cyan-500/0 transition-all duration-500 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10" />

              {/* 🖼️ Logo — grayscale → color on hover */}
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="max-h-16 w-auto object-contain opacity-60 grayscale transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-20"
                loading="lazy"
                onError={(e) => (e.currentTarget.style.opacity = "0.3")}
              />

              {/* Name — hover e niche ashe */}
              <span className="absolute bottom-2.5 translate-y-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 🏅 Certifications ================= */}
      <div>
        <p className="mb-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] sm:text-xs">
          <FaAward className="text-emerald-500" />
          {t("certificationsLabel")}
        </p>

        <div className="flex flex-wrap items-stretch justify-center gap-5 sm:gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="group relative w-40 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:w-44"
            >
              {/* Top gradient strip */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cert.gradient}`} />

              {/* 🖼️ Logo — gradient ring e */}
              <div className="mx-auto mb-3.5 w-fit rounded-2xl bg-gradient-to-tr p-[2px] shadow-lg transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                <div className="grid h-16 w-16 place-items-center rounded-[14px] bg-[var(--color-surface)]">
                  <img
                    src={cert.logo}
                    alt={`${cert.name} certification`}
                    className="h-12 w-12 object-contain transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Name */}
              <p className="text-sm font-bold text-[var(--color-text)]">
                {cert.name}
              </p>

              {/* ✅ Verified badge */}
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/25">
                <FaCheckCircle className="text-[8px]" />
                {t("verifiedBadge")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}