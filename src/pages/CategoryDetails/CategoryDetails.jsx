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

  if (isLoading)
    return (
      <p className="text-center py-12 text-lg text-[var(--color-primary)] font-semibold">
        Loading medicines...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 py-12 font-semibold">
        ❌ Failed to load medicines.
      </p>
    );

  const { category, medicines = [] } = data || {};

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedicine(null);
    setIsModalOpen(false);
  };

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
    toast.success(`Added "${medicine.name}" to cart!`);
  };

  return (
    <div
      className="max-w-7xl mx-auto p-6 my-14 bg-[var(--color-bg)] rounded-2xl shadow-lg min-h-screen"
      role="main"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-semibold transition-colors duration-300"
        aria-label="Back to categories"
      >
        ← Back to Categories
      </button>

      <h2
        className="text-4xl font-extrabold mb-10 text-center text-[var(--color-text)] tracking-wide"
        aria-live="polite"
      >
        {category?.categoryName || "Category"} Medicines
      </h2>

      {medicines.length === 0 ? (
        <p className="text-center text-gray-600 italic text-lg">
          No medicines found in this category.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full table-auto border-collapse bg-white rounded-xl">
            <thead className="bg-[var(--color-primary)] text-white uppercase tracking-wide select-none">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Company</th>
                <th className="px-6 py-4 text-left font-semibold">Stock</th>
                <th className="px-6 py-4 text-left font-semibold">Price</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr
                  key={med._id}
                  className="border-b last:border-none hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  <td className="px-6 py-3">{med.name}</td>
                  <td className="px-6 py-3">{med.company}</td>
                  <td className="px-6 py-3">{med.stock}</td>
                  <td className="px-6 py-3 text-[var(--color-secondary)] font-bold">
                    ৳{med.price}
                  </td>
                  <td className="px-6 py-3 text-center space-x-6">
                    <button
                      onClick={() => openModal(med)}
                      className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors"
                      title={`View details of ${med.name}`}
                      aria-label={`View details of ${med.name}`}
                    >
                      <FaEye size={20} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(med)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title={`Add ${med.name} to cart`}
                      aria-label={`Add ${med.name} to cart`}
                    >
                      <FaCartPlus size={20} />
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
          className="fixed inset-0 shadow-2xl bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-xl transform transition-transform duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 bg-gray-200 hover:bg-gray-400 text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              title="Close modal"
              aria-label="Close modal"
            >
              <FaTimes size={26} />
            </button>

            <h3
              id="modal-title"
              className="text-3xl font-bold mb-5 text-[var(--color-primary)]"
            >
              {selectedMedicine.name}
            </h3>

            <img
              src={selectedMedicine.image || "https://via.placeholder.com/400x200?text=No+Image"}
              alt={selectedMedicine.name}
              className="w-full h-56 object-contain rounded-lg mb-6 bg-[var(--color-bg)]"
              loading="lazy"
            />

            <div className="space-y-3 text-[var(--color-text)] text-base leading-relaxed">
              <p>
                <strong>Company:</strong> {selectedMedicine.company}
              </p>
              <p>
                <strong>Price:</strong> ৳{selectedMedicine.price}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedMedicine.status?.toLowerCase() === "available"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {selectedMedicine.status || "Unknown"}
                </span>
              </p>
              <p>
                <strong>Stock:</strong> {selectedMedicine.stock}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedMedicine.description || (
                  <em className="text-gray-500">No description available.</em>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
