import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

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
        // Backend থেকে ডাটা ফেচ করো
        const res = await axiosSecure.get(`/payments/summary/seller/${user.email}`);
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
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Seller Dashboard</h2>

      {loading ? (
        <p className="text-center">Loading sales summary...</p>
      ) : (
        <div className="space-y-4 text-center">
          <div className="text-lg">
            <span className="font-semibold">Paid Total: </span>
            <span className="text-green-600">${summary.paidTotal?.toFixed(2)}</span>
          </div>
          <div className="text-lg">
            <span className="font-semibold">Pending Total: </span>
            <span className="text-yellow-600">${summary.pendingTotal?.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
