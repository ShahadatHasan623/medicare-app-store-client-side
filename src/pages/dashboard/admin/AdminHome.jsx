import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";


export default function AdminHome() {
  const axiosSecure = useAxioseSecure();

  const { data: summary = {}, isLoading } = useQuery({
    queryKey: ["admin-sales-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-sales-summary");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading summary...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-green-100 border border-green-400 p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-green-800">Total Paid Revenue</h2>
        <p className="text-3xl font-bold mt-2 text-green-700">${summary.paidTotal?.toFixed(2)}</p>
      </div>
      <div className="bg-yellow-100 border border-yellow-400 p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-yellow-800">Total Pending Revenue</h2>
        <p className="text-3xl font-bold mt-2 text-yellow-700">${summary.pendingTotal?.toFixed(2)}</p>
      </div>
    </div>
  );
}
