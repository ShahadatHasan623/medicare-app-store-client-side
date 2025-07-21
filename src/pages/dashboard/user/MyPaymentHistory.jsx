import { useQuery } from "@tanstack/react-query";
import { FaMoneyCheckAlt, FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";

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
    return <Loader></Loader>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-700 flex items-center justify-center gap-2">
        <FaMoneyCheckAlt className="text-green-600" /> My Payment History
      </h1>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          <FaRegClock className="mx-auto text-4xl text-gray-400 mb-2" />
          No payment history found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200">
          <table className="table w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="py-3 px-4 text-sm md:text-base font-semibold">Date</th>
                <th className="py-3 px-4 text-sm md:text-base font-semibold">Transaction ID</th>
                <th className="py-3 px-4 text-sm md:text-base font-semibold">Amount</th>
                <th className="py-3 px-4 text-sm md:text-base font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr
                  key={p._id}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 text-gray-600 text-sm md:text-base">
                    {new Date(p.date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm md:text-base">
                    {p.transactionId || "N/A"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600 text-sm md:text-base">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm md:text-base">
                    {p.status === "paid" ? (
                      <span className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                        <FaCheckCircle /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-red-600 font-semibold">
                        <FaTimesCircle /> {p.status}
                      </span>
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
};

export default MyPaymentHistory;
