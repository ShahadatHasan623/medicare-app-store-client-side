import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import {
  FaHistory, FaEnvelope, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaRedo, FaSearch, FaMoneyBillWave, FaHourglassHalf, FaShoppingBag,
  FaSpinner, FaUsers,
} from "react-icons/fa";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | paid | pending
  const [search, setSearch] = useState("");

  const axiosSecure = useAxioseSecure();
  const { t } = useTranslation();

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosSecure.get("/payments");
      setPayments(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  /* 🧮 Stats */
  const paidPayments = payments.filter((p) => p.status === "paid");
  const pendingPayments = payments.filter(
    (p) => p.status === "pending" || p.status === "unpaid"
  );
  const totalRevenue = paidPayments.reduce(
    (sum, p) => sum + (p.totalPrice ?? 0),
    0
  );

  /* 🔍 Filter + search */
  const filteredPayments = useMemo(() => {
    let list = payments;
    if (filter === "paid") list = list.filter((p) => p.status === "paid");
    if (filter === "pending")
      list = list.filter((p) => p.status === "pending" || p.status === "unpaid");

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.buyerEmail?.toLowerCase().includes(q) ||
          p.sellerEmails?.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [payments, filter, search]);

  const markAsPaid = (id) => {
    Swal.fire({
      title: t("confirmPaymentTitle"),
      text: t("confirmPaymentText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("yesMarkPaid"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUpdatingId(id);
        try {
          const res = await axiosSecure.patch(`/payments/${id}`);
          if (res.status === 200) {
            setPayments((prev) =>
              prev.map((p) => (p._id === id ? { ...p, status: "paid" } : p))
            );
            Swal.fire({
              icon: "success",
              text: t("transactionFinalized"),
              confirmButtonColor: "#10b981",
              timer: 1800,
              showConfirmButton: false,
              timerProgressBar: true,
            });
          }
        } catch {
          Swal.fire({
            icon: "error",
            text: t("updateFailed"),
            confirmButtonColor: "#10b981",
          });
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  /* 💀 Skeleton */
  if (loading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-6 h-14 w-72 rounded-3xl bg-slate-300/40" />
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-3xl bg-slate-300/30" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-3 h-20 rounded-2xl bg-slate-300/25" />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">{error}</p>
          <button
            onClick={fetchPayments}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> {t("retry")}
          </button>
        </div>
      </div>
    );

  const stats = [
    {
      label: t("totalTransactions"),
      value: payments.length,
      icon: <FaShoppingBag />,
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/30",
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20",
    },
    {
      label: t("totalRevenue"),
      value: `৳${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <FaMoneyBillWave />,
      gradient: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/30",
      bg: "from-cyan-500/10 to-blue-500/5",
      border: "border-cyan-500/20",
    },
    {
      label: t("pendingCount"),
      value: pendingPayments.length,
      icon: <FaHourglassHalf />,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/30",
      bg: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20",
    },
  ];

  const filterTabs = [
    { id: "all", label: t("allTab"), count: payments.length },
    { id: "paid", label: t("paidTab"), count: paidPayments.length },
    { id: "pending", label: t("pendingTab"), count: pendingPayments.length },
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

      <div className="min-h-screen bg-[var(--color-bg)] p-4 transition-colors duration-300 md:p-8">
        <ReTitle title={t("paymentMgmtDocTitle")} />

        <div className="mx-auto max-w-7xl">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <FaHistory className="text-xl" />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-[var(--color-text)] md:text-3xl">
                  {t("paymentMgmtHeading")}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  {t("paymentMgmtSubtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* ================= 📊 Stat cards ================= */}
          <div className="animate-fade-up mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${s.bg} ${s.border}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg ${s.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    {s.icon}
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] sm:text-xs">
                      {s.label}
                    </p>
                    <h3 className="mt-0.5 text-xl font-black tabular-nums text-[var(--color-text)] sm:text-2xl">
                      {s.value}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= 🔍 Toolbar: tabs + search ================= */}
          <div className="animate-fade-up mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-[var(--color-surface)] p-1.5 ring-1 ring-[var(--color-border)]">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 sm:text-sm ${
                    filter === tab.id
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30"
                      : "text-[var(--color-muted)] hover:bg-emerald-500/10 hover:text-emerald-600"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                      filter === tab.id
                        ? "bg-white/25 text-white"
                        : "bg-slate-500/10 text-[var(--color-muted)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:w-72">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchTransaction")}
                className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40"
              />
            </div>
          </div>

          {/* ================= 📭 Empty state ================= */}
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <FaShoppingBag className="text-2xl" />
              </span>
              <p className="font-semibold text-[var(--color-muted)]">
                {payments.length === 0 ? t("noPaymentsFound") : t("noUsersMatch")}
              </p>
            </div>
          ) : (
            <>
              {/* ================= 🖥️ Desktop table ================= */}
              <div className="animate-fade-up hidden overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-black/5 md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
                        <th className="p-5 text-xs font-black uppercase tracking-wider">
                          {t("buyerDetail")}
                        </th>
                        <th className="p-5 text-xs font-black uppercase tracking-wider">
                          {t("sellersCol")}
                        </th>
                        <th className="p-5 text-xs font-black uppercase tracking-wider">
                          {t("amountCol")}
                        </th>
                        <th className="p-5 text-center text-xs font-black uppercase tracking-wider">
                          {t("statusCol")}
                        </th>
                        <th className="p-5 text-xs font-black uppercase tracking-wider">
                          {t("dateCol")}
                        </th>
                        <th className="p-5 text-right text-xs font-black uppercase tracking-wider">
                          {t("actionCol2")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {filteredPayments.map((payment) => {
                        const isPaid = payment.status === "paid";
                        return (
                          <tr
                            key={payment._id}
                            className="group transition-colors hover:bg-emerald-500/5"
                          >
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                                  <FaEnvelope size={13} />
                                </span>
                                <span className="truncate font-semibold text-[var(--color-text)]">
                                  {payment.buyerEmail}
                                </span>
                              </div>
                            </td>
                            <td className="p-5">
                              <p className="max-w-xs truncate text-sm text-[var(--color-muted)]">
                                <span className="mr-1.5 inline-flex items-center gap-1">
                                  <FaUsers className="text-[10px] opacity-50" />
                                </span>
                                {Array.isArray(payment.sellerEmails)
                                  ? payment.sellerEmails.join(", ")
                                  : "—"}
                              </p>
                            </td>
                            <td className="p-5">
                              <span className="text-lg font-black tabular-nums text-emerald-600">
                                ৳{payment.totalPrice?.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-5 text-center">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/25">
                                  <FaCheckCircle className="text-[10px]" /> {t("paidStatus")}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-600 ring-1 ring-amber-500/25">
                                  <FaClock className="text-[10px]" /> {t("pendingStatus")}
                                </span>
                              )}
                            </td>
                            <td className="p-5 text-sm italic text-[var(--color-muted)]">
                              {new Date(payment.date).toLocaleDateString("en-GB")}
                            </td>
                            <td className="p-5 text-right">
                              {!isPaid ? (
                                <button
                                  disabled={updatingId === payment._id}
                                  onClick={() => markAsPaid(payment._id)}
                                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 active:scale-95 disabled:opacity-60"
                                >
                                  {updatingId === payment._id ? (
                                    <>
                                      <FaSpinner className="animate-spin" />
                                      {t("processing")}
                                    </>
                                  ) : (
                                    <>{t("confirmPayment")}</>
                                  )}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                                  <FaCheckCircle className="text-xs" /> {t("verified")}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ================= 📱 Mobile cards ================= */}
              <div className="space-y-4 md:hidden">
                {filteredPayments.map((payment, index) => {
                  const isPaid = payment.status === "paid";
                  return (
                    <div
                      key={payment._id}
                      className="animate-fade-up rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg shadow-black/5"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Top: buyer + status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                            <FaEnvelope size={14} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[var(--color-text)]">
                              {payment.buyerEmail}
                            </p>
                            <p className="text-[11px] text-[var(--color-muted)]">
                              {new Date(payment.date).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                        </div>
                        {isPaid ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/25">
                            <FaCheckCircle className="text-[9px]" /> {t("paidStatus")}
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-amber-600 ring-1 ring-amber-500/25">
                            <FaClock className="text-[9px]" /> {t("pendingStatus")}
                          </span>
                        )}
                      </div>

                      {/* Sellers */}
                      <p className="mt-3 flex items-start gap-1.5 text-xs text-[var(--color-muted)]">
                        <FaUsers className="mt-0.5 shrink-0 text-[10px] opacity-50" />
                        <span className="line-clamp-1">
                          {Array.isArray(payment.sellerEmails)
                            ? payment.sellerEmails.join(", ")
                            : "—"}
                        </span>
                      </p>

                      {/* Amount + action */}
                      <div className="mt-3 flex items-center justify-between border-t border-dashed border-[var(--color-border)] pt-3">
                        <span className="text-xl font-black tabular-nums text-emerald-600">
                          ৳{payment.totalPrice?.toFixed(2)}
                        </span>
                        {!isPaid ? (
                          <button
                            disabled={updatingId === payment._id}
                            onClick={() => markAsPaid(payment._id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition active:scale-95 disabled:opacity-60"
                          >
                            {updatingId === payment._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheckCircle className="text-xs" />
                            )}
                            {updatingId === payment._id
                              ? t("processing")
                              : t("confirmPayment")}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                            <FaCheckCircle className="text-xs" /> {t("verified")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}