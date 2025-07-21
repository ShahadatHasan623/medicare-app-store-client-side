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
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Seller Dashboard
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
            <p className="text-gray-600 text-lg">Loading sales summary...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Paid Total */}
            <div className="p-6 bg-green-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <FaMoneyBillWave className="text-green-600 text-4xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">Paid Total</h3>
              <p className="text-3xl font-bold text-green-700 mt-2">
                ${summary.paidTotal?.toFixed(2)}
              </p>
            </div>

            {/* Pending Total */}
            <div className="p-6 bg-yellow-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <FaDollarSign className="text-yellow-600 text-4xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">Pending Total</h3>
              <p className="text-3xl font-bold text-yellow-700 mt-2">
                ${summary.pendingTotal?.toFixed(2)}
              </p>
            </div>

            {/* Total Orders */}
            <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <FaShoppingCart className="text-blue-600 text-4xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">
                {summary.totalOrders}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
