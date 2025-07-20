import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";

const MyPaymentHistory = () => {
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["userPayments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        My Payment History
      </h1>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No payment history found.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="table w-full text-center">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 text-gray-700 font-semibold">Date</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">
                  Transaction ID
                </th>
                <th className="py-3 px-4 text-gray-700 font-semibold">
                  Amount
                </th>
                <th className="py-3 px-4 text-gray-700 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr
                  key={p._id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(p.date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {p.transactionId || "N/A"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      p.status === "paid" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPaymentHistory;
