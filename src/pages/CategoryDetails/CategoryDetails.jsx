import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaCartPlus, FaTimes } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

import { toast } from "react-toastify";
import { useCart } from "../../utils/CartContext";

const fetchMedicinesByCategoryId = async (Axios, categoryId) => {
  const res = await Axios.get(`/categories/${categoryId}/medicines`);
  return res.data;
};

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const Axios = useAxios();
 const { addToCart } = useCart();

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const { data, isLoading, error } = useQuery({
    queryKey: ["category-medicines", categoryId],
    queryFn: () => fetchMedicinesByCategoryId(Axios, categoryId),
  });

  if (isLoading) return <p className="text-center py-8 text-lg text-[var(--color-primary)]">Loading medicines...</p>;
  if (error) return <p className="text-center text-red-600">Failed to load medicines.</p>;

  const { category, medicines = [] } = data || {};

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedicine(null);
    setIsModalOpen(false);
  };

  // **Add to cart with toast notification**
  const handleAddToCart = (medicine) => {
    addToCart(medicine);
    toast.success(`Added "${medicine.name}" to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[var(--color-bg)] min-h-screen rounded-lg shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-semibold transition"
      >
        ← Back to Categories
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-text)]">
        {category?.categoryName} Medicines
      </h2>

      {medicines.length === 0 ? (
        <p className="text-gray-600 text-center">No medicines found in this category.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-[var(--color-primary)] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {medicines.map((med) => (
                <tr key={med._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{med.name}</td>
                  <td className="px-4 py-2">{med.company}</td>
                  <td className="px-4 py-2">{med.status}</td>
                  <td className="px-4 py-2">{med.stock}</td>
                  <td className="px-4 py-2 text-[var(--color-secondary)] font-bold">
                    ${med.price}
                  </td>
                  <td className="px-4 py-2 text-center space-x-4">
                    <button
                      onClick={() => openModal(med)}
                      className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition"
                      title="View Details"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(med)}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Add to Cart"
                    >
                      <FaCartPlus size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedMedicine && (
        <div
          className="fixed inset-0 shadow-2xl bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg transform transition-all scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
          <button
                       onClick={() => closeModal(null)}
                       className="absolute top-5 right-5 bg-gray-200 hover:bg-gray-400 text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-md transition duration-300 ease-in-out"
                       title="Close"
                       aria-label="Close modal"
                     >
                       <FaTimes size={24} />
                     </button>

            <h3 className="text-2xl font-semibold mb-4 text-[var(--color-primary)]">
              {selectedMedicine.name}
            </h3>
            <img
              src={selectedMedicine.image || "https://via.placeholder.com/300"}
              alt={selectedMedicine.name}
              className="w-full h-48 object-contain mb-4 rounded bg-[var(--color-bg)]"
            />
            <div className="space-y-2 text-[var(--color-text)]">
              <p><strong>Company:</strong> {selectedMedicine.company}</p>
              <p><strong>Price:</strong> ${selectedMedicine.price}</p>
              <p><strong>Status:</strong> {selectedMedicine.status}</p>
              <p><strong>Stock:</strong> {selectedMedicine.stock}</p>
              <p><strong>Description:</strong> {selectedMedicine.description || "No description available."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
