
import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

const ManageOrders = () => {
  const axiosSecure = useAxioseSecure();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        📦 Manage All Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Medicine</th>
              <th>Price</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.email}</td>
                <td>{order.medicineName}</td>
                <td>${order.price}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      )}
    </div>
  );
};

export default ManageOrders;
