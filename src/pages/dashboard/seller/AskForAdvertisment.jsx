import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

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

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
          Your Advertisements
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-secondary)] text-white px-4 sm:px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          + Add Advertisement
        </button>
      </div>

      {/* Ads List */}
      {ads.length === 0 ? (
        <p className="text-gray-500 font-medium text-base sm:text-lg">
          No advertisements found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={ad.medicineImage}
                alt={ad.medicineName}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] dark:text-black">
                  {ad.medicineName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{ad.description}</p>
                <p className="mt-3 font-medium text-sm sm:text-base dark:text-primary">
                  Status:{" "}
                  {ad.isOnSlider ? (
                    <span className="text-green-600 font-semibold">On Slider</span>
                  ) : (
                    <span className="text-gray-500">Not on Slider</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-2">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] mb-4">
              Add Advertisement
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-[var(--color-text)]">
                  Medicine Name
                </label>
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-[var(--color-text)]">
                  Medicine Image URL
                </label>
                <input
                  type="url"
                  name="medicineImage"
                  value={formData.medicineImage}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-[var(--color-text)]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <button
                type="submit"
                disabled={addAdMutation.isLoading}
                className="w-full bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg shadow hover:bg-opacity-90 transition disabled:opacity-50"
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
