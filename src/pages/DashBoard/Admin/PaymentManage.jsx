import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function PaymentManage() {
  const axiosSecure = useAxioseSecure();
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch payments (optionally filter by email client-side)
  const { data: payments = [], isLoading, isError } = useQuery(
    ["payments"],
    async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    }
  );

  if (isLoading) return <p>Loading payments...</p>;
  if (isError) return <p>Error loading payments.</p>;

  // Filter payments by email client-side
  const filteredPayments = payments.filter((p) =>
    p.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payment Management</h2>

      {/* Search by Email */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="input input-bordered w-full max-w-sm"
        />
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.transactionId || "N/A"}</td>
                  <td>{payment.email}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        payment.status === "paid"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>{new Date(payment.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
