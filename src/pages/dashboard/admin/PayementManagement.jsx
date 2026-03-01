import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";
import { FaCheckCircle, FaClock, FaHistory, FaEnvelope } from "react-icons/fa";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const axiosSecure = useAxioseSecure();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/payments");
      setPayments(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const markAsPaid = (id) => {
    Swal.fire({
      title: "Confirm Payment?",
      text: "Has the customer paid for these medicines?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Mark Paid",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUpdatingId(id);
        try {
          const res = await axiosSecure.patch(`/payments/${id}`);
          if (res.status === 200) {
            setPayments((prevPayments) =>
              prevPayments.map((p) =>
                p._id === id ? { ...p, status: "paid" } : p
              )
            );
            Swal.fire("Success", "Transaction finalized.", "success");
          }
        } catch {
          Swal.fire("Error!", "Failed to update database.", "error");
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-10 min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <FaHistory className="text-emerald-500" /> Payment History
          </h2>
          <p className="text-slate-500 mt-1">Manage and verify all medical transactions</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-emerald-100">
          <span className="text-sm font-medium text-slate-500">Total Transactions: </span>
          <span className="text-xl font-bold text-emerald-600">{payments.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-5 font-semibold text-sm uppercase tracking-wider">Buyer Detail</th>
                <th className="p-5 font-semibold text-sm uppercase tracking-wider">Sellers</th>
                <th className="p-5 font-semibold text-sm uppercase tracking-wider">Amount</th>
                <th className="p-5 font-semibold text-sm uppercase tracking-wider text-center">Status</th>
                <th className="p-5 font-semibold text-sm uppercase tracking-wider">Date</th>
                <th className="p-5 font-semibold text-sm uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400">
                    No payment records found in the system.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <FaEnvelope size={12} />
                        </div>
                        <span className="font-medium text-slate-700">{payment.buyerEmail}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm text-slate-500 max-w-xs truncate">
                        {Array.isArray(payment.sellerEmails) ? payment.sellerEmails.join(", ") : "N/A"}
                      </p>
                    </td>
                    <td className="p-5 font-bold text-slate-800">
                      ${payment.totalPrice?.toFixed(2)}
                    </td>
                    <td className="p-5 text-center">
                      {payment.status === "paid" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
                          <FaCheckCircle /> PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600">
                          <FaClock /> PENDING
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-slate-500 text-sm italic">
                      {new Date(payment.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-5 text-right">
                      {(payment.status === "pending" || payment.status === "unpaid") ? (
                        <button
                          disabled={updatingId === payment._id}
                          onClick={() => markAsPaid(payment._id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {updatingId === payment._id ? "Processing..." : "Confirm Payment"}
                        </button>
                      ) : (
                        <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}