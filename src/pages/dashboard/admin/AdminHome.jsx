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

  if (isLoading)
    return <Loader></Loader>;

  if (isError)
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-600 text-lg font-semibold">
        Error fetching summary: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Admin Dashboard Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Paid Total Card */}
        <div className="p-6 bg-green-50 rounded-2xl shadow-lg border border-green-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <FaMoneyBillWave className="text-green-600 text-5xl mb-3" />
            <h2 className="text-2xl font-semibold text-green-800">Total Paid</h2>
            <p className="text-5xl font-bold text-green-900 mt-2">
              $
              {summary && typeof summary.paidTotal === "number"
                ? summary.paidTotal.toFixed(2)
                : "0.00"}
            </p>
            <div className="mt-2 text-green-700 font-medium">
              💰 Revenue received
            </div>
          </div>
        </div>

        {/* Pending Total Card */}
        <div className="p-6 bg-yellow-50 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <FaDollarSign className="text-yellow-600 text-5xl mb-3" />
            <h2 className="text-2xl font-semibold text-yellow-800">
              Total Pending
            </h2>
            <p className="text-5xl font-bold text-yellow-900 mt-2">
              $
              {summary && typeof summary.pendingTotal === "number"
                ? summary.pendingTotal.toFixed(2)
                : "0.00"}
            </p>
            <div className="mt-2 text-yellow-700 font-medium">
              ⏳ Payments pending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
