
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";

const ManageMedicines = () => {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Load medicines by seller email
  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["seller-medicines", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/medicines/seller/${user?.email}`);
      return res.data;
    },
  });

  const { mutate: deleteMedicine } = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/medicines/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Medicine has been deleted", "success");
      queryClient.invalidateQueries(["seller-medicines"]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the medicine.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((res) => {
      if (res.isConfirmed) {
        deleteMedicine(id);
      }
    });
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Manage Your Medicines</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, idx) => (
              <tr key={med._id}>
                <td>{idx + 1}</td>
                <td>{med.name}</td>
                <td>{med.category}</td>
                <td>${med.price}</td>
                <td>{med.stock}</td>
                <td>
                  <button onClick={() => handleDelete(med._id)} className="btn btn-sm btn-error">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {medicines.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No medicines added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageMedicines;
