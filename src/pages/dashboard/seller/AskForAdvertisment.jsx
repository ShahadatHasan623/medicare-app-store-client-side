import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function AskForAdvertisement() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const fetchSellerAds = async (sellerEmail) => {
  const res = await axiosSecure.get(`/advertisements/seller/${sellerEmail}`);
  return res.data || [];
};

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["sellerAds", user.email],
    queryFn: () => fetchSellerAds(user.email),
    enabled: !!user.email,
  });
  console.log(ads)

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: "",
    medicineImage: "",
    description: "",
  });

  const addAdMutation = useMutation({
    mutationFn: (newAd) => axiosSecure.post("/advertisements/seller/add", newAd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerAds", user.email] });
      setShowModal(false);
      Swal.fire("Success", "Advertisement request added", "success");
      setFormData({ medicineName: "", medicineImage: "", description: "" });
    },
    onError: () => {
      Swal.fire("Error", "Failed to add advertisement", "error");
    },
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAdMutation.mutate({ ...formData, sellerEmail: user.email });
  };

  if (isLoading) return <p>Loading your advertisements...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Medicine Advertisements</h2>
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Advertisement
      </button>

      {ads.length === 0 ? (
        <p>No advertisements found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="border p-4 rounded shadow">
              <img
                src={ad.medicineImage}
                alt={ad.medicineName}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{ad.medicineName}</h3>
              <p className="text-sm mt-1">{ad.description}</p>
              <p className="mt-2 font-medium">
                Status:{" "}
                {ad.isOnSlider ? (
                  <span className="text-green-600">On Slider</span>
                ) : (
                  <span className="text-gray-600">Not on Slider</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Add Advertisement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Medicine Name</label>
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Medicine Image URL</label>
                <input
                  type="url"
                  name="medicineImage"
                  value={formData.medicineImage}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={addAdMutation.isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {addAdMutation.isLoading ? "Adding..." : "Add Advertisement"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
