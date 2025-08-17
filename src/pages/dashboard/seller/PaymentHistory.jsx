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

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-block px-3 py-1 rounded-full text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className={`${baseClasses} bg-success/20 text-success dark:bg-success-dark/20 dark:text-success-dark`}>
            Paid
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-warning/20 text-warning dark:bg-warning-dark/20 dark:text-warning-dark`}>
            Pending
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-error/20 text-error dark:bg-error-dark/20 dark:text-error-dark`}>
            Failed
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
            {status || "Unknown"}
          </span>
        );
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-center mt-10 text-error dark:text-error-dark font-semibold">
        Failed to load payment history.
      </p>
    );

  return (
    <section className="min-h-screen p-6 md:p-10 bg-bg dark:bg-bg-dark transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-primary dark:text-primary-dark text-center">
          My Payment History
        </h2>

        <div className="overflow-x-auto bg-surface dark:bg-surface-dark rounded-2xl shadow-xl  dark:border-border-dark">
          <table className="min-w-full text-sm md:text-base">
            <thead className="bg-primary dark:bg-primary-dark text-white rounded-t-2xl">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Medicine</th>
                <th className="px-4 py-3 text-left">Buyer</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-text dark:text-text-dark transition-colors duration-300">
              {payments.length > 0 ? (
                payments.map((pay, index) => (
                  <tr
                    key={pay._id}
                    className={`transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900"
                        : "bg-white dark:bg-gray-700"
                    }`}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{pay.medicineName || "Unnamed"}</td>
                    <td className="px-4 py-3 text-muted dark:text-muted-dark">{pay.buyerEmail}</td>
                    <td className="px-4 py-3 text-right font-semibold text-secondary dark:text-secondary-dark">
                      {formatCurrency(pay.amount ?? pay.totalAmount)}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(pay.status)}</td>
                    <td className="px-4 py-3 text-muted dark:text-muted-dark">
                      {new Date(pay.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted dark:text-muted-dark italic py-10">
                    No payment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
