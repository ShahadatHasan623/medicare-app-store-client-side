import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

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
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "var(--color-muted)",
      confirmButtonText: "Yes, mark as paid!",
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
    <div className="p-6 min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
        Payment Management
      </h2>

      {loading ? (
        <p className="text-[var(--color-primary)] font-semibold">Loading payments...</p>
      ) : (
        <div
          className="overflow-x-auto shadow-lg rounded-lg"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}>
                <th className="p-3 text-left">Buyer Email</th>
                <th className="p-3 text-left">Seller Email(s)</th>
                <th className="p-3 text-left">Total Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-[var(--color-muted)] font-medium"
                  >
                    No payments found.
                  </td>
                </tr>
              )}
              {payments.map((payment, index) => (
                <tr
                  key={payment._id}
                  className={`${
                    index % 2 === 0 ? "bg-[var(--color-bg)]" : "bg-[var(--color-surface)]"
                  } hover:bg-[var(--color-border)] transition`}
                >
                  <td className="p-3">{payment.buyerEmail}</td>
                  <td className="p-3 text-sm text-[var(--color-text)]">
                    {Array.isArray(payment.sellerEmails)
                      ? payment.sellerEmails.join(", ")
                      : "N/A"}
                  </td>
                  <td className="p-3 font-semibold text-[var(--color-secondary)]">
                    ${payment.totalPrice?.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        payment.status === "paid"
                          ? "bg-[var(--color-success)]"
                          : "bg-[var(--color-warning)]"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {(payment.status === "pending" || payment.status === "unpaid") ? (
                      <button
                        disabled={updatingId === payment._id}
                        onClick={() => markAsPaid(payment._id)}
                        className="bg-[var(--color-secondary)] text-white px-4 py-1 rounded hover:opacity-90 transition disabled:opacity-50"
                      >
                        {updatingId === payment._id
                          ? "Updating..."
                          : "Mark as Paid"}
                      </button>
                    ) : (
                      <span className="text-[var(--color-success)] font-semibold">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
