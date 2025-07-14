
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

const AddAdvertisement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  // Fetch seller's own medicines
  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["seller-medicines", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/medicines/seller/${user?.email}`);
      return res.data;
    },
  });

  const { mutate: advertiseMedicine } = useMutation({
    mutationFn: async (med) => {
      const adData = {
        name: med.name,
        category: med.category,
        price: med.price,
        image: med.image,
        sellerEmail: user.email,
        created_at: new Date().toISOString(),
      };
      return await axiosSecure.post("/advertisements", adData);
    },
    onSuccess: () => {
      Swal.fire("Success", "Medicine added to advertisement", "success");
      queryClient.invalidateQueries(["seller-medicines"]);
    },
  });

  const handleAdvertise = (med) => {
    advertiseMedicine(med);
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        📢 Advertise Your Medicines
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((med) => (
          <div key={med._id} className="card shadow-md p-4 bg-base-100 border rounded-lg">
            <img src={med.image} alt={med.name} className="h-40 w-full object-cover rounded mb-3" />
            <h3 className="text-lg font-bold">{med.name}</h3>
            <p className="text-sm text-gray-600">Category: {med.category}</p>
            <p className="font-semibold text-green-700">Price: ${med.price}</p>
            <button
              onClick={() => handleAdvertise(med)}
              className="btn btn-outline btn-success mt-3"
            >
              Advertise
            </button>
          </div>
        ))}
      </div>
      {medicines.length === 0 && (
        <p className="text-center text-gray-500 mt-6">You have no medicines to advertise.</p>
      )}
    </div>
  );
};

export default AddAdvertisement;
