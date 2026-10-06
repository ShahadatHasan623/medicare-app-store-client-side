import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave, FaHourglassHalf, FaShoppingCart,
  FaChartPie, FaChartBar, FaExclamationTriangle, FaRedo,
  FaInfoCircle, FaStore, FaWallet,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from "chart.js";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function SellerDashboard() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const { t } = useTranslation();

  const [summary, setSummary] = useState({
    paidTotal: 0,
    pendingTotal: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosSecure.get(
          `/payments/summary/seller/${user.email}`
        );
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch seller summary:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user, axiosSecure]);

  const paidTotal = summary.paidTotal || 0;
  const pendingTotal = summary.pendingTotal || 0;
  const totalOrders = summary.totalOrders || 0;
  const grandTotal = paidTotal + pendingTotal;
  const paidPct = grandTotal > 0 ? Math.round((paidTotal / grandTotal) * 100) : 0;

  /* 🌗 Chart.js — dark mode aware options */
  const isDark = () => document.documentElement.classList.contains("dark");
  const gridColor = isDark() ? "rgba(148,163,184,.15)" : "rgba(148,163,184,.25)";
  const tickColor = isDark() ? "#94a3b8" : "#64748b";

  /* 🥧 Pie data */
  const pieData = {
    labels: [t("paid"), t("pending")],
    datasets: [
      {
        label: t("paymentsLabel"),
        data: [paidTotal, pendingTotal],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderColor: isDark() ? "#0f172a" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: tickColor,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: { weight: "bold", size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,.92)",
        titleFont: { weight: "bold" },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ৳${Number(ctx.parsed).toLocaleString()}`,
        },
      },
    },
  };

  /* 📊 Bar data */
  const barData = {
    labels: [t("paid"), t("pending"), t("totalOrders2")],
    datasets: [
      {
        label: t("summaryLabel"),
        data: [paidTotal, pendingTotal, totalOrders],
        backgroundColor: ["#10b981", "#f59e0b", "#3b82f6"],
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 70,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,23,42,.92)",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${t("summaryLabel")}: ${Number(ctx.parsed.y).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: tickColor, font: { weight: "bold", size: 12 } },
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: tickColor,
          font: { size: 11 },
          callback: (v) => (v >= 1000 ? `৳${(v / 1000).toFixed(1)}k` : `৳${v}`),
        },
      },
    },
  };

  /* ⚠️ Error state */
  if (error)
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">{t("errorSummary")}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> {t("retry")}
          </button>
        </div>
      </div>
    );

  /* 💀 Skeleton */
  if (loading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-3 h-9 w-72 rounded-2xl bg-slate-300/40" />
          <div className="mb-10 h-4 w-56 rounded-full bg-slate-300/30" />
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 rounded-3xl bg-slate-300/30" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-300/25" />
            ))}
          </div>
        </div>
      </div>
    );

  /* 🎨 Stat cards data */
  const statCards = [
    {
      label: t("totalPaid"),
      value: `৳${paidTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: <FaMoneyBillWave size={26} />,
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/30",
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20",
      pct: paidPct,
      bar: "from-emerald-500 to-teal-400",
    },
    {
      label: t("totalPending"),
      value: `৳${pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: <FaHourglassHalf size={26} />,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/30",
      bg: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20",
      pct: 100 - paidPct,
      bar: "from-amber-500 to-orange-400",
    },
    {
      label: t("totalOrders2"),
      value: totalOrders,
      icon: <FaShoppingCart size={26} />,
      gradient: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/30",
      bg: "from-cyan-500/10 to-blue-500/5",
      border: "border-cyan-500/20",
      pct: null,
      bar: null,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg)] p-4 sm:p-6 lg:p-8">
        <ReTitle title={t("sellerDocTitle")} />

        <div className="mx-auto max-w-6xl">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <FaStore className="text-xl" />
                </span>
                {t("sellerHeading")}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] sm:text-base">
                {t("welcomeSeller", { name: user?.displayName || "Seller" })} ·{" "}
                {t("sellerSubtitle")}
              </p>
            </div>
          </div>

          {/* ================= 💳 Stat cards ================= */}
          <div className="animate-fade-up mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.bg} ${card.border}`}
              >
                {/* Corner glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl transition-all duration-500 group-hover:bg-white/40 dark:bg-white/5" />

                <div className="relative flex items-center gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg ${card.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    {card.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] sm:text-xs">
                      {card.label}
                    </p>
                    <h3 className="mt-0.5 truncate text-xl font-black tabular-nums text-[var(--color-text)] sm:text-2xl">
                      {card.value}
                    </h3>
                  </div>
                </div>

                {/* Progress bar — orders card e nai */}
                {card.pct !== null && (
                  <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-slate-500/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${card.bar} transition-all duration-1000`}
                      style={{ width: `${card.pct}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ================= 📊 Charts ================= */}
          <div className="animate-fade-up grid grid-cols-1 gap-6 md:grid-cols-2" style={{ animationDelay: "120ms" }}>
            {/* 🥧 Donut — center total */}
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5">
              <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] bg-gradient-to-r from-emerald-500/10 to-transparent px-6 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <FaChartPie />
                </span>
                <h3 className="text-base font-black text-[var(--color-text)]">
                  {t("paymentsOverview")}
                </h3>
              </div>

              <div className="relative h-[320px] p-4">
                <Pie data={pieData} options={pieOptions} />
                {/* 🎯 Donut center — grand total */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-10">
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    <FaWallet className="text-[8px] text-emerald-500" />
                    {t("total")}
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-lg font-black tabular-nums text-transparent">
                    ৳{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>

            {/* 📊 Bar chart */}
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5">
              <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] bg-gradient-to-r from-cyan-500/10 to-transparent px-6 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/15 text-cyan-600">
                  <FaChartBar />
                </span>
                <h3 className="text-base font-black text-[var(--color-text)]">
                  {t("summaryComparison")}
                </h3>
              </div>

              <div className="h-[320px] p-4 pt-6">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>

          {/* 📝 Footer note */}
          <p className="animate-fade-up mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
            <FaInfoCircle className="text-emerald-500" />
            {t("allAmounts")}
          </p>
        </div>
      </div>
    </>
  );
}