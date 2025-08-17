import React, { useEffect, useState } from "react";
import { FaDollarSign, FaSpinner, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function SellerDashboard() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();

  const [summary, setSummary] = useState({
    paidTotal: 0,
    pendingTotal: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(
          `/payments/summary/seller/${user.email}`
        );
        setSummary(res.data);
      } catch (error) {
        console.error("Failed to fetch seller summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user, axiosSecure]);

  return (
    <div className="min-h-screen p-[1.618rem] md:p-[1.5rem] bg-[var(--color-bg)] flex items-center justify-center">
      <div className="max-w-5xl w-full bg-[var(--color-surface)] rounded-2xl shadow-2xl p-[2.618rem]">
        <h2 className="text-[2.618rem] md:text-[3.618rem] font-extrabold text-center mb-[1.618rem] text-[var(--color-primary)]">
          Seller Dashboard
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-[1.618rem]">
            <FaSpinner className="animate-spin text-[var(--color-secondary)] text-5xl" />
            <p className="text-[var(--color-muted)] text-lg">Loading sales summary...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.618rem]">
            {/* Paid Total */}
            <div className="p-[1.618rem] bg-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center">
              <div className="bg-green-100 p-[1.618rem] rounded-full inline-block mb-[1.618rem]">
                <FaMoneyBillWave className="text-green-700 text-4xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text)] mb-[0.618rem]">
                Paid Total
              </h3>
              <p className="text-3xl md:text-[3.618rem] font-bold text-green-700">
                ${summary.paidTotal?.toFixed(2)}
              </p>
            </div>

            {/* Pending Total */}
            <div className="p-[1.618rem] bg-yellow-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center">
              <div className="bg-yellow-100 p-[1.618rem] rounded-full inline-block mb-[1.618rem]">
                <FaDollarSign className="text-yellow-700 text-4xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text)] mb-[0.618rem]">
                Pending Total
              </h3>
              <p className="text-3xl md:text-[3.618rem] font-bold text-yellow-700">
                ${summary.pendingTotal?.toFixed(2)}
              </p>
            </div>

            {/* Total Orders */}
            <div className="p-[1.618rem] bg-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center">
              <div className="bg-blue-100 p-[1.618rem] rounded-full inline-block mb-[1.618rem]">
                <FaShoppingCart className="text-blue-700 text-4xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text)] mb-[0.618rem]">
                Total Orders
              </h3>
              <p className="text-3xl md:text-[3.618rem] font-bold text-blue-700">
                {summary.totalOrders}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
