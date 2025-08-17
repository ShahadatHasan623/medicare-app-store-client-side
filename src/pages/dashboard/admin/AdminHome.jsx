import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaDollarSign, FaMoneyBillWave } from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

export default function AdminHome() {
  const axiosSecure = useAxioseSecure();

  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminSummary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/summary/admin");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-[var(--color-error)] text-lg font-semibold">
        Error fetching summary: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] px-4 sm:px-6 lg:px-12 py-12">
      {/* Header */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-text)] mb-12 tracking-tight text-center">
        Admin Dashboard Summary
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Paid Total Card */}
        <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-md hover:shadow-xl border border-[var(--color-border)] p-8 transition-transform duration-300 hover:scale-[1.03]">
          <div className="flex flex-col items-center text-center">
            <div className="bg-[var(--color-success)]/20 rounded-full p-5 shadow-md mb-5">
              <FaMoneyBillWave className="text-[var(--color-success)] text-5xl" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--color-success)] mb-2">
              Total Paid
            </h3>
            <p className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-3">
              $
              {summary && typeof summary.paidTotal === "number"
                ? summary.paidTotal.toFixed(2)
                : "0.00"}
            </p>
            <span className="text-[var(--color-muted)] font-medium text-lg">
              💰 Revenue received
            </span>
          </div>
        </div>

        {/* Pending Total Card */}
        <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-md hover:shadow-xl border border-[var(--color-border)] p-8 transition-transform duration-300 hover:scale-[1.03]">
          <div className="flex flex-col items-center text-center">
            <div className="bg-[var(--color-warning)]/20 rounded-full p-5 shadow-md mb-5">
              <FaDollarSign className="text-[var(--color-warning)] text-5xl" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--color-warning)] mb-2">
              Total Pending
            </h3>
            <p className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-3">
              $
              {summary && typeof summary.pendingTotal === "number"
                ? summary.pendingTotal.toFixed(2)
                : "0.00"}
            </p>
            <span className="text-[var(--color-muted)] font-medium text-lg">
              ⏳ Payments pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
