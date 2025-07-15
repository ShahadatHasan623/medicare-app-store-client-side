// src/pages/Dashboard/Seller/PaymentHistory.jsx

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

export default function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [] } = useQuery({
    queryKey: ["seller-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/seller-payments/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Payment History</h2>
      <div className="overflow-x-auto bg-base-200 p-4 rounded-lg">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay, index) => (
              <tr key={pay._id}>
                <td>{index + 1}</td>
                <td>{pay.medicineName}</td>
                <td>{pay.buyerEmail}</td>
                <td>${pay.amount}</td>
                <td>{pay.status}</td>
                <td>{new Date(pay.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
