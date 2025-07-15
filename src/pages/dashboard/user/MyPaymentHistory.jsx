import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function MyPaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/seller-payments/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p className="text-center">Loading payment history...</p>;
  if (error) return <p className="text-red-500 text-center">Failed to fetch data</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Payment History</h2>
      {payments.length === 0 ? (
        <p>No payment found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item, idx) => (
                <tr key={item._id}>
                  <td>{idx + 1}</td>
                  <td>${item.amount}</td>
                  <td className="capitalize">{item.status}</td>
                  <td>{item.transactionId || "N/A"}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
