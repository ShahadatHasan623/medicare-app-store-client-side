
import { useQuery } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

const MyOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["user-orders", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/user/${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🛍️ My Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full shadow bg-white rounded">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Price</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.medicineName}</td>
                <td>${order.price}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td className="text-green-600 font-semibold flex items-center gap-1">
                  <FaCheckCircle /> Paid
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          You haven’t placed any orders yet.
        </p>
      )}
    </div>
  );
};

export default MyOrders;
