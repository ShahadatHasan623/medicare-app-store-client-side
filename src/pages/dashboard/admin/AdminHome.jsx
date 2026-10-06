import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaMoneyBillWave, FaHourglassHalf, FaChartPie, FaChartBar,
  FaInfoCircle, FaExclamationTriangle, FaRedo, FaArrowUp, FaWallet,
} from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

/* 🎨 Recharts tooltip — themed */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 shadow-xl">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
        {label || payload[0].name}
      </p>
      <p className="mt-0.5 text-sm font-black" style={{ color: payload[0].payload.color || payload[0].fill }}>
        ৳{Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default function AdminHome() {
  const axiosSecure = useAxioseSecure();
  const { t } = useTranslation();

  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminSummary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/summary/admin");
      return res.data;
    },
  });

  /* ⚠️ Error state — retry soho */
  if (isError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">
            {t("errorFetching")}: {error?.message}
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

  /* 💀 Loading skeleton — dashboard shape */
  if (isLoading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] px-4 py-10 lg:px-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mx-auto mb-3 h-9 w-72 rounded-2xl bg-slate-300/40" />
          <div className="mx-auto mb-10 h-4 w-48 rounded-full bg-slate-300/30" />
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-slate-300/30" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-300/30" />
            ))}
          </div>
        </div>
      </div>
    );

  const paidTotal = summary?.paidTotal || 0;
  const pendingTotal = summary?.pendingTotal || 0;
  const grandTotal = paidTotal + pendingTotal;
  const paidPct = grandTotal > 0 ? Math.round((paidTotal / grandTotal) * 100) : 0;

  /* 📊 Chart data */
  const chartData = [
    { name: t("paid"), value: paidTotal, color: "#10b981" },
    { name: t("pending"), value: pendingTotal, color: "#f59e0b" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-10 lg:px-12">
      <ReTitle title={t("adminDocTitle")} />

      <div className="mx-auto max-w-6xl">
        {/* ================= 📝 Header ================= */}
        <div className="animate-fade-up mb-10 text-center">
          <h2 className="flex flex-wrap items-center justify-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
              <FaChartBar className="text-lg" />
            </span>
            {t("adminHeading")}
          </h2>
          <p className="mt-2.5 text-sm text-[var(--color-muted)] sm:text-base">
            {t("adminSubtitle")}
          </p>
        </div>

        {/* ================= 💳 Stat Cards ================= */}
        <div className="animate-fade-up mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Total Paid — emerald */}
          <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 shadow-lg shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/15">
            {/* Corner glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl transition-all duration-500 group-hover:bg-emerald-400/30" />

            <div className="relative flex items-center gap-5">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4 text-white shadow-lg shadow-emerald-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <FaMoneyBillWave size={28} />
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  {t("totalPaid")}
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                    <FaArrowUp className="text-[8px]" />
                    {paidPct}%
                  </span>
                </p>
                <h3 className="mt-1 text-2xl font-black tabular-nums text-[var(--color-text)] sm:text-3xl">
                  ৳{paidTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>

            {/* Bottom progress bar */}
            <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-emerald-500/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                style={{ width: `${paidPct}%` }}
              />
            </div>
          </div>

          {/* Total Pending — amber */}
          <div className="group relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6 shadow-lg shadow-amber-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/15">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl transition-all duration-500 group-hover:bg-amber-400/30" />

            <div className="relative flex items-center gap-5">
              <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white shadow-lg shadow-amber-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <FaHourglassHalf size={28} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  {t("totalPending")}
                </p>
                <h3 className="mt-1 text-2xl font-black tabular-nums text-[var(--color-text)] sm:text-3xl">
                  ৳{pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>

            <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-amber-500/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-1000"
                style={{ width: `${100 - paidPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* ================= 📊 Charts ================= */}
        <div className="animate-fade-up grid grid-cols-1 gap-8 lg:grid-cols-2" style={{ animationDelay: "120ms" }}>
          {/* 🥧 Pie — donut with center total */}
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5">
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] bg-gradient-to-r from-emerald-500/10 to-transparent px-6 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <FaChartPie />
              </span>
              <h3 className="text-base font-black text-[var(--color-text)]">
                {t("revenueDistribution")}
              </h3>
            </div>

            <div className="relative h-[320px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                    cornerRadius={6}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={9}
                    formatter={(value) => (
                      <span className="text-xs font-bold text-[var(--color-muted)]">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* 🎯 Donut center — grand total */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                  <FaWallet className="text-[8px] text-emerald-500" />
                  {t("total")}
                </span>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-black tabular-nums text-transparent">
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
                {t("financialComparison")}
              </h3>
            </div>

            <div className="h-[320px] w-full p-4 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={60}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(148,163,184,.2)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    tickFormatter={(v) => `৳${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,.06)" }} />
                  <Bar dataKey="value" radius={[12, 12, 4, 4]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 📝 Footer note */}
        <p className="animate-fade-up mt-8 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
          <FaInfoCircle className="text-emerald-500" />
          {t("allAmounts")}
        </p>
      </div>
    </div>
  );
}