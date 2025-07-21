import React from "react";
import useAxiosSecure from "../../../hooks/useAxioseSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";

export default function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["seller-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/seller/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Status badge color logic
  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-block px-3 py-1 rounded-full text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Paid
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>Failed</span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-200 text-gray-700`}>
            {status || "Unknown"}
          </span>
        );
    }
  };

  // Format amount to currency (USD)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (isLoading)
    return <Loader></Loader>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        Failed to load payment history.
      </p>
    );

  return (
    <section className="p-6 bg-[var(--color-bg)] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">
          My Payment History
        </h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-primary)] text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Medicine</th>
              <th className="px-4 py-3 text-left">Buyer</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((pay, index) => (
                <tr
                  key={pay._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-[var(--color-bg)] transition`}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                    {pay.medicineName || "Unnamed"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{pay.buyerEmail}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[var(--color-secondary)]">
                    {formatCurrency(pay.amount ?? pay.totalAmount)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(pay.status)}</td>
                  <td className="px-4 py-3 text-gray-600">
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
