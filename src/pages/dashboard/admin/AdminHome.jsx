import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

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

  if (isLoading)
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        Loading summary...
      </div>
    );

  if (isError)
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-600">
        Error fetching summary: {error.message}
      </div>
    );

  console.log("Admin summary:", summary);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Paid Total Card */}
      <div className="card bg-green-100 shadow-xl border border-green-300">
        <div className="card-body">
          <h2 className="card-title text-green-800 text-2xl font-semibold">
            Total Paid
          </h2>
          <p className="text-5xl font-bold text-green-900">
            $
            {summary && typeof summary.paidTotal === "number"
              ? summary.paidTotal.toFixed(2)
              : "0.00"}
          </p>
          <div className="mt-2 text-green-700">💰 Revenue received</div>
        </div>
      </div>

      {/* Pending Total Card */}
      <div className="card bg-yellow-100 shadow-xl border border-yellow-300">
        <div className="card-body">
          <h2 className="card-title text-yellow-800 text-2xl font-semibold">
            Total Pending
          </h2>
          <p className="text-5xl font-bold text-yellow-900">
            $
            {summary && typeof summary.pendingTotal === "number"
              ? summary.pendingTotal.toFixed(2)
              : "0.00"}
          </p>
          <div className="mt-2 text-yellow-700">⏳ Payments pending</div>
        </div>
      </div>
    </div>
  );
}
