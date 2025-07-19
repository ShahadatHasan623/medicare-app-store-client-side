import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function ManageBanner() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  // সকল বিজ্ঞাপন আনার query
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["allAdvertisements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertisements/admin/all");
      return res.data || [];
    },
  });

  // Toggle slider status করার mutation
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

  if (isLoading) return <p>Loading advertisements...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Advertisement Banners</h2>

      {ads.length === 0 ? (
        <p>No advertisements found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Medicine Name</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Seller Email</th>
                <th className="border border-gray-300 px-4 py-2">On Slider</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={ad.medicineImage}
                      alt={ad.medicineName}
                      className="w-20 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{ad.medicineName}</td>
                  <td className="border border-gray-300 px-4 py-2">{ad.description}</td>
                  <td className="border border-gray-300 px-4 py-2">{ad.sellerEmail}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {ad.isOnSlider ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => toggleSliderMutation.mutate(ad._id)}
                      disabled={toggleSliderMutation.isLoading}
                      className={`px-3 py-1 rounded text-white ${
                        ad.isOnSlider
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } disabled:opacity-50`}
                    >
                      {ad.isOnSlider ? "Remove from Slider" : "Add to Slider"}
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
