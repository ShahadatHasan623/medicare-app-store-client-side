import React from "react";
import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import {
  FaHistory, FaPills, FaEnvelope, FaCheckCircle, FaClock,
  FaTimesCircle, FaBan, FaExclamationTriangle, FaReceipt,
} from "react-icons/fa";
import { ReTitle } from "re-title";

export default function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  /* ================= ✅ LOGIC — EXACTLY AS-IS ================= */
  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["seller-payments", user?.email],

    queryFn: async () => {
      if (!user?.email) return [];

      try {
        const res = await axiosSecure.get(
          `/payments/seller/${encodeURIComponent(user.email)}`
        );

        console.log("Payment API response:", res.data);

        if (Array.isArray(res.data)) {
          return res.data;
        }

        if (Array.isArray(res.data?.data)) {
          return res.data.data;
        }

        return [];
      } catch (err) {
        console.error("Payment history API error:", err);
        console.error("Status:", err?.response?.status);
        console.error("Response:", err?.response?.data);

        throw err;
      }
    },

    enabled: !!user?.email,
  });

  // Loading
  if (isLoading) {
    return <Loader />;
  }

  // Status Badge
  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();

    const baseClasses =
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ring-1";

    switch (normalizedStatus) {
      case "paid":
        return (
          <span
            className={`${baseClasses} bg-emerald-500/15 text-emerald-600 ring-emerald-500/25`}
          >
            <FaCheckCircle className="text-[10px]" />
            Paid
          </span>
        );

      case "pending":
        return (
          <span
            className={`${baseClasses} bg-amber-500/15 text-amber-600 ring-amber-500/25`}
          >
            <FaClock className="text-[10px]" />
            Pending
          </span>
        );

      case "failed":
        return (
          <span
            className={`${baseClasses} bg-rose-500/15 text-rose-600 ring-rose-500/25`}
          >
            <FaTimesCircle className="text-[10px]" />
            Failed
          </span>
        );

      case "cancelled":
      case "canceled":
        return (
          <span
            className={`${baseClasses} bg-slate-500/15 text-slate-600 ring-slate-500/25 dark:text-slate-400`}
          >
            <FaBan className="text-[10px]" />
            Cancelled
          </span>
        );

      default:
        return (
          <span
            className={`${baseClasses} bg-slate-500/15 text-slate-600 ring-slate-500/25 dark:text-slate-400`}
          >
            {status || "Unknown"}
          </span>
        );
    }
  };

  // Currency
  const formatCurrency = (amount) => {
    const value = Number(amount) || 0;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Date
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* ================= 🎨 NEW DESIGN BELOW ================= */
  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <section className="min-h-screen bg-[var(--color-bg)] p-4 transition-colors duration-300 sm:p-6 md:p-10">
        <ReTitle title="MediCare | Payment History" />

        <div className="mx-auto max-w-6xl">
          {/* ================= 📝 Header — left aligned, icon box ================= */}
          <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <FaHistory className="text-xl" />
                </span>
                <span className="text-[var(--color-primary)]">
                  My Payment History
                </span>
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] sm:text-base">
                View all payment transactions related to your sales.
              </p>
            </div>

            {/* 💳 Total count — header e chip (ager bottom-right text er bodole) */}
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25 sm:text-sm">
              <FaReceipt className="text-xs" />
              Total Payments:{" "}
              <span className="tabular-nums">{payments.length}</span>
            </span>
          </div>

          {/* ================= 📭 Empty state — separate card ================= */}
          {payments.length === 0 ? (
            <div className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-4xl">
                💳
              </span>
              <p className="text-lg font-semibold text-[var(--color-muted)]">
                No payment history found.
              </p>
              {user?.email && (
                <p className="rounded-full bg-slate-500/10 px-3 py-1 text-xs text-[var(--color-muted)]">
                  Account: {user.email}
                </p>
              )}
            </div>
          ) : (
            <>
              {/* ================= 🖥️ Desktop table ================= */}
              <div className="animate-fade-up hidden overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-black/5 md:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    {/* Table Head — gradient */}
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
                        <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider">#</th>
                        <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider">Medicine</th>
                        <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider">Buyer</th>
                        <th className="px-4 py-4 text-right text-xs font-black uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-4 text-center text-xs font-black uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                      {payments.map((pay, index) => (
                        <tr
                          key={pay?._id || pay?.id || index}
                          className="group transition-colors hover:bg-emerald-500/5"
                        >
                          {/* Number — badge */}
                          <td className="px-4 py-4">
                            <span className="inline-grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-[11px] font-black text-emerald-600">
                              {index + 1}
                            </span>
                          </td>

                          {/* Medicine — icon + name */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2.5">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-xs text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                                <FaPills />
                              </span>
                              <span className="font-bold">
                                {pay?.medicineName ||
                                  pay?.medicine?.name ||
                                  pay?.productName ||
                                  "Unnamed Medicine"}
                              </span>
                            </div>
                          </td>

                          {/* Buyer — icon + truncated email */}
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-2 text-[var(--color-muted)]">
                              <FaEnvelope className="shrink-0 text-xs opacity-50" />
                              <span className="max-w-[180px] truncate">
                                {pay?.buyerEmail ||
                                  pay?.buyer?.email ||
                                  pay?.email ||
                                  "N/A"}
                              </span>
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-4 text-right font-black tabular-nums text-emerald-600">
                            {formatCurrency(
                              pay?.amount ??
                                pay?.totalAmount ??
                                pay?.price ??
                                0
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4 text-center">
                            {getStatusBadge(pay?.status)}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-4 text-sm italic text-[var(--color-muted)]">
                            {formatDate(
                              pay?.date ||
                                pay?.createdAt ||
                                pay?.paymentDate
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ================= 📱 Mobile cards — table er bodole ================= */}
              <div className="space-y-4 md:hidden">
                {payments.map((pay, index) => (
                  <div
                    key={pay?._id || pay?.id || index}
                    className="animate-fade-up rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg shadow-black/5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Top: medicine + status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                          <FaPills />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[var(--color-text)]">
                            {pay?.medicineName ||
                              pay?.medicine?.name ||
                              pay?.productName ||
                              "Unnamed Medicine"}
                          </p>
                          <p className="truncate text-[11px] text-[var(--color-muted)]">
                            {pay?.buyerEmail ||
                              pay?.buyer?.email ||
                              pay?.email ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(pay?.status)}
                    </div>

                    {/* Bottom: amount + date */}
                    <div className="mt-3 flex items-center justify-between border-t border-dashed border-[var(--color-border)] pt-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                          Amount
                        </p>
                        <p className="text-lg font-black tabular-nums text-emerald-600">
                          {formatCurrency(
                            pay?.amount ??
                              pay?.totalAmount ??
                              pay?.price ??
                              0
                          )}
                        </p>
                      </div>
                      <p className="text-xs italic text-[var(--color-muted)]">
                        {formatDate(
                          pay?.date ||
                            pay?.createdAt ||
                            pay?.paymentDate
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}