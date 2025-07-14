
import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

const SalesReport = () => {
  const axiosSecure = useAxioseSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["all-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  // গণনা
  const totalRevenue = payments.reduce((acc, item) => acc + item.amount, 0);
  const totalTransactions = payments.length;

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
        💹 Sales Report
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-blue-100 rounded-xl text-center">
          <h3 className="text-xl font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-800">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-xl text-center">
          <h3 className="text-xl font-semibold">Transactions</h3>
          <p className="text-2xl font-bold text-green-800">{totalTransactions}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => (
              <tr key={payment._id}>
                <td>{idx + 1}</td>
                <td>{payment.email}</td>
                <td>${payment.amount}</td>
                <td>{payment.transactionId}</td>
                <td>{new Date(payment.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
