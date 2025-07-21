import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

export default function ManageBanner() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["allAdvertisements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertisements/admin/all");
      return res.data || [];
    },
  });

  // Toggle slider status
  const toggleSliderMutation = useMutation({
    mutationFn: (adId) =>
      axiosSecure.patch(`/advertisements/admin/toggle-slider/${adId}`),
    onSuccess: (data) => {
      Swal.fire("Success", data.data.message, "success");
      queryClient.invalidateQueries(["allAdvertisements"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update slider status", "error");
    },
  });

  if (isLoading)
    return <Loader></Loader>;

  return (
    <div className="p-6 min-h-screen bg-[var(--color-bg)]">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
        Manage Advertisement Banners
      </h2>

      {ads.length === 0 ? (
        <p className="text-[var(--color-text)] font-medium">No advertisements found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary)] text-white">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Medicine Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Seller Email</th>
                <th className="p-3 text-center">On Slider</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, index) => (
                <tr
                  key={ad._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-[var(--color-bg)] transition`}
                >
                  <td className="p-3">
                    <img
                      src={ad.medicineImage}
                      alt={ad.medicineName}
                      className="w-20 h-16 object-cover rounded shadow"
                    />
                  </td>
                  <td className="p-3 font-medium text-[var(--color-text)]">{ad.medicineName}</td>
                  <td className="p-3 text-gray-600">{ad.description}</td>
                  <td className="p-3 text-sm text-gray-700">{ad.sellerEmail}</td>
                  <td className="p-3 text-center">
                    {ad.isOnSlider ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-semibold text-sm">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-semibold text-sm">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleSliderMutation.mutate(ad._id)}
                      disabled={toggleSliderMutation.isLoading}
                      className={`px-4 py-1 rounded text-white font-medium shadow-md transition ${
                        ad.isOnSlider
                          ? "bg-[var(--color-secondary)] hover:bg-orange-600"
                          : "bg-[var(--color-primary)] hover:bg-indigo-700"
                      } disabled:opacity-50`}
                    >
                      {ad.isOnSlider ? "Remove" : "Add"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
