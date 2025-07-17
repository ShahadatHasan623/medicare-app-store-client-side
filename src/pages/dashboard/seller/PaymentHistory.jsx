// src/pages/Dashboard/Seller/PaymentHistory.jsx

import React from "react";
import useAxiosSecure from "../../../hooks/useAxioseSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

export default function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [] } = useQuery({
    queryKey: ["seller-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/seller/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Status badge color logic
  const getStatusBadge = (status) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-sm font-semibold";
    switch (status?.toLowerCase()) {
      case "paid":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Paid</span>;
      case "pending":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "failed":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Failed</span>;
      default:
        return <span className={`${baseClasses} bg-gray-200 text-gray-700`}>{status}</span>;
    }
  };

  // Format amount to currency (e.g. USD)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        My Payment History
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left">#</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Medicine</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Buyer</th>
              <th className="border border-gray-300 px-4 py-3 text-right">Amount</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((pay, index) => (
                <tr
                  key={pay._id}
                  className={`hover:bg-blue-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{pay.medicineName}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">{pay.buyerEmail}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                    {formatCurrency(pay.amount)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">{getStatusBadge(pay.status)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {new Date(pay.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 italic py-6"
                >
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
