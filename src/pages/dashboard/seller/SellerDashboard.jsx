import React, { useEffect, useState } from "react";
import { FaDollarSign, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

// Chart.js registration
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

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

  // Prepare chart data
  const barData = {
    labels: ["Paid Total", "Pending Total", "Total Orders"],
    datasets: [
      {
        label: "Summary",
        data: [summary.paidTotal, summary.pendingTotal, summary.totalOrders],
        backgroundColor: ["#16a34a", "#eab308", "#3b82f6"],
      },
    ],
  };

  const pieData = {
    labels: ["Paid", "Pending"],
    datasets: [
      {
        label: "Payments",
        data: [summary.paidTotal, summary.pendingTotal],
        backgroundColor: ["#16a34a", "#eab308"],
      },
    ],
  };

  return (
    <div className="min-h-screen p-[1.618rem] md:p-[1.5rem] bg-[var(--color-bg)] flex flex-col items-center">
      <div className="max-w-5xl w-full bg-[var(--color-surface)] rounded-2xl shadow-2xl p-[2.618rem]">
        <h2 className="text-[2.618rem] md:text-[3.618rem] font-extrabold text-center mb-[1.618rem] text-[var(--color-primary)]">
          Seller Dashboard
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-[1.618rem]">
            <FaDollarSign className="animate-spin text-[var(--color-secondary)] text-5xl" />
            <p className="text-[var(--color-muted)] text-lg">Loading sales summary...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.618rem] mb-[2rem]">
              <div className="p-[1.618rem] bg-green-50 rounded-2xl shadow-lg text-center">
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

              <div className="p-[1.618rem] bg-yellow-50 rounded-2xl shadow-lg text-center">
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

              <div className="p-[1.618rem] bg-blue-50 rounded-2xl shadow-lg text-center">
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

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">Payments Overview</h3>
                <Pie data={pieData} />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">Summary Bar Chart</h3>
                <Bar data={barData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}