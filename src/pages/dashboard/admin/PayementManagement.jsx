import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function PayementManagement() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, error } = useQuery(
    ["payments"],
    async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    }
  );

  const markPaidMutation = useMutation(
    (id) => axiosSecure.patch(`/payments/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["payments"]);
        Swal.fire("Success", "Payment status updated to paid.", "success");
      },
      onError: () => {
        Swal.fire("Error", "Failed to update payment status.", "error");
      },
    }
  );

  if (isLoading) return <p>Loading payments...</p>;
  if (error) return <p>Error loading payments</p>;

  return (
    <div>
      <h2>Payment Management</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Seller Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Mark Paid</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No payments found.
              </td>
            </tr>
          )}
          {payments.map(({ _id, sellerEmail, amount, status, date }) => (
            <tr key={_id}>
              <td>{_id}</td>
              <td>{sellerEmail}</td>
              <td>${amount}</td>
              <td>{status}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
              <td>
                {status !== "paid" && (
                  <button
                    onClick={() => markPaidMutation.mutate(_id)}
                    disabled={markPaidMutation.isLoading}
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
