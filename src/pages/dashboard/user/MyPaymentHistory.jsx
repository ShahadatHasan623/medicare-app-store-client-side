import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";

const MyPaymentHistory = () => {
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["userPayments", user?.email],
    queryFn: async () => {
      console.log("Fetching payments for user:", user?.email);
      const res = await axiosSecure.get(`/payments/user/${user?.email}`);
      console.log("Payments API response:", res.data);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{new Date(p.date).toLocaleString()}</td>
              <td>{p.transactionId || "N/A"}</td>
              <td>${p.amount}</td>
              <td
                className={
                  p.status === "paid" ? "text-green-500" : "text-red-500"
                }
              >
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPaymentHistory;
