import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function SalesReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxioseSecure();

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        title: "Please select both start and end dates",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.get("/sales-report", {
        params: { startDate, endDate },
      });
      setPayments(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to fetch report",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.totalPrice || 0), 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Report</h2>

      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Fetch Report"}
        </button>
      </div>

      {payments.length > 0 && (
        <>
          <div className="mb-4 font-semibold text-lg">
            Total Sales: ${totalAmount.toFixed(2)}
          </div>

          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Buyer Email</th>
                <th className="border border-gray-300 p-2">Seller Email</th>
                <th className="border border-gray-300 p-2">Total Price</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{payment.buyerEmail}</td>
                  <td className="border border-gray-300 p-2">{payment.sellerEmail}</td>
                  <td className="border border-gray-300 p-2">${payment.totalPrice?.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 capitalize">{payment.status}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!loading && payments.length === 0 && (
        <p className="text-center mt-8 text-gray-600">No data to display.</p>
      )}
    </div>
  );
}
