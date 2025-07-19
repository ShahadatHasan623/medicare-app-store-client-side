import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

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
        title: "Failed to fetch payments",
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
      title: "Are you sure?",
      text: "You want to mark this payment as paid.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as paid!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUpdatingId(id);
        try {
          const res = await axiosSecure.patch(`/payments/${id}`);
          if (res.status === 200) {
            // success, আপডেট হয়েছে ধরে নিও
            setPayments((prevPayments) =>
              prevPayments.map((p) =>
                p._id === id ? { ...p, status: "paid" } : p
              )
            );

            Swal.fire("Updated!", "Payment marked as paid.", "success");
          } else {
            Swal.fire("Oops!", "No changes made.", "info");
          }
        } catch {
          Swal.fire("Error!", "Failed to update payment status.", "error");
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Buyer Email</th>
              <th className="border border-gray-300 p-2">Seller Email</th>
              <th className="border border-gray-300 p-2">Total Price</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No payments found.
                </td>
              </tr>
            )}
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {payment.buyerEmail}
                </td>
                <td className="border border-gray-300 p-2">
                  {payment.sellerEmail}
                </td>
                <td className="border border-gray-300 p-2">
                  ${payment.totalPrice?.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2 capitalize">
                  {payment.status}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {payment.status === "pending" ? (
                    <button
                      disabled={updatingId === payment._id}
                      onClick={() => markAsPaid(payment._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {updatingId === payment._id
                        ? "Updating..."
                        : "Mark as Paid"}
                    </button>
                  ) : (
                    <span className="text-green-700 font-semibold">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
