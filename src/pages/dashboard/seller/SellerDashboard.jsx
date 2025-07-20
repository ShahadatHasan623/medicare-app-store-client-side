import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import { FaDollarSign, FaClock } from "react-icons/fa";

export default function SellerDashboard() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();

  const [summary, setSummary] = useState({ paidTotal: 0, pendingTotal: 0 });
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
    <div className="p-6 bg-[var(--color-bg)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-primary)]">
          Seller Dashboard
        </h2>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-[var(--color-primary)]"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paid Card */}
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4 border-l-4 border-green-500 hover:shadow-lg transition">
              <div className="p-3 bg-green-100 text-green-700 rounded-full">
                <FaDollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-500 font-medium">Paid Total</p>
                <p className="text-2xl font-bold text-green-700">
                  ${summary.paidTotal?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4 border-l-4 border-yellow-500 hover:shadow-lg transition">
              <div className="p-3 bg-yellow-100 text-yellow-700 rounded-full">
                <FaClock size={24} />
              </div>
              <div>
                <p className="text-gray-500 font-medium">Pending Total</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${summary.pendingTotal?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
