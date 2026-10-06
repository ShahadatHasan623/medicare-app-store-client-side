import React from "react";
import {
  FaLightbulb, FaArrowRight, FaClock, FaHeartbeat, FaDumbbell,
  FaShieldVirus, FaSpa, FaBookOpen,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

/* 📚 Articles — icon + gradient + read time soho */
const sampleArticles = [
  {
    id: 1,
    title: "How to Maintain a Healthy Diet",
    summary:
      "Discover simple tips to keep your diet balanced and nutritious for a healthier lifestyle.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
    url: "#",
    icon: <FaHeartbeat />,
    gradient: "from-rose-500 to-red-500",
    shadow: "shadow-rose-500/30",
    accent: "from-rose-400 via-red-400 to-orange-400",
    readTime: 5,
  },
  {
    id: 2,
    title: "The Importance of Regular Exercise",
    summary:
      "Learn why exercising regularly can improve your overall health and wellbeing.",
    image: "https://i.ibb.co/Swkw2pG2/n-Nir91l-Ji-X.jpg",
    url: "#",
    icon: <FaDumbbell />,
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/30",
    accent: "from-emerald-400 via-teal-400 to-cyan-400",
    readTime: 4,
  },
  {
    id: 3,
    title: "Tips to Boost Your Immunity",
    summary:
      "Simple lifestyle changes and foods that help strengthen your immune system naturally.",
    image: "https://i.ibb.co/5h16SGcR/boosting-your-immune-system-s.jpg",
    url: "#",
    icon: <FaShieldVirus />,
    gradient: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/30",
    accent: "from-cyan-400 via-blue-400 to-indigo-400",
    readTime: 6,
  },
  {
    id: 4,
    title: "Stress Management Techniques",
    summary:
      "Effective ways to reduce stress and maintain mental well-being every day.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    url: "#",
    icon: <FaSpa />,
    gradient: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-500/30",
    accent: "from-violet-400 via-purple-400 to-fuchsia-400",
    readTime: 5,
  },
];

export default function HealthTips() {
  const { t } = useTranslation();

  const openArticle = (url) => {
    if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="mx-auto my-20 max-w-7xl px-4 lg:px-0"
      data-aos="zoom-in-right"
      style={{ color: "var(--color-text)" }}
      aria-label="Health tips and articles"
    >
      {/* ================= 📝 Section header ================= */}
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <h2 className="flex flex-wrap items-center justify-center gap-3 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
            <FaLightbulb className="text-lg" />
          </span>
          <span style={{ color: "var(--color-primary)" }}>
            {t("healthTipsHeading")}
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-transparent to-emerald-500" />
          <p className="text-sm text-[var(--color-muted)] sm:text-base">
            {t("healthTipsSubtitle")}
          </p>
          <span className="h-[3px] w-10 rounded-full bg-gradient-to-l from-transparent to-emerald-500" />
        </div>
      </div>

      {/* ================= 📰 Article cards ================= */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {sampleArticles.map(({ id, title, summary, image, url, icon, gradient, shadow, accent, readTime }, index) => (
          <article
            key={id}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/15"
            style={{ animationDelay: `${index * 80}ms` }}
            onClick={() => openArticle(url)}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openArticle(url);
              }
            }}
            aria-label={`${t("readMore")} — ${title}`}
          >
            {/* Top gradient accent — article color e */}
            <div className={`absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r ${accent} transition-transform duration-500 group-hover:scale-x-100`} />

            {/* 🖼️ Image */}
            <div className="relative h-40 overflow-hidden bg-[var(--color-bg)] sm:h-44">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Gradient overlay — hover e */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* ⏱️ Read time badge */}
              <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold text-white ring-1 ring-white/20 backdrop-blur">
                <FaClock className="text-[9px] text-emerald-300" />
                {readTime} {t("minRead")}
              </span>

              {/* 🏷️ Category icon badge — top right */}
              <span
                className={`absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadow} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
              >
                {icon}
              </span>
            </div>

            {/* 📝 Content */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              {/* Tag */}
              <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/20">
                <FaBookOpen className="text-[8px]" />
                {t("tipTag")}
              </span>

              <h3 className="line-clamp-2 text-base font-black leading-snug text-[var(--color-text)] transition-colors duration-300 group-hover:text-emerald-600 sm:text-lg">
                {title}
              </h3>

              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--color-muted)] sm:text-sm">
                {summary}
              </p>

              {/* 🔗 Read more — arrow slide on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openArticle(url);
                }}
                className="group/btn mt-auto inline-flex w-fit items-center gap-2 pt-4 text-sm font-bold text-emerald-600 transition-colors duration-300 hover:text-emerald-700"
                aria-label={`${t("readMore")} — ${title}`}
              >
                <span className="relative">
                  {t("readMore")}
                  {/* Underline grow */}
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-transform duration-300 group-hover/btn:scale-x-100" />
                </span>
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}