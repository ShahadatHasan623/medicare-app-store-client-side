import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

export default function MyMedicines() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 6;

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    description: "",
    image: "",
    category: "",
    company: "",
    unit: "",
    price: "",
    stock: "",
    discount: 0,
  });

  // Static category list
  const categories = [
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Cream",
    "Drops",
  ];

  // Fetch medicines with pagination
  const { data: medicinesResponse, isLoading } = useQuery({
    queryKey: ["medicines", user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/medicines?sellerEmail=${user?.email}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const medicines = Array.isArray(medicinesResponse?.data)
    ? medicinesResponse.data
    : [];
  const currentPage = medicinesResponse?.currentPage || 1;
  const totalPages = medicinesResponse?.totalPages || 1;

  // Add medicine mutation
  const addMedicineMutation = useMutation({
    mutationFn: async (newMedicine) => {
      const res = await axiosSecure.post("/medicines", newMedicine);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medicines", user.email]);
      Swal.fire("✅ Success", "Medicine added successfully", "success");
      setShowModal(false);
      resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
    onError: () => {
      Swal.fire("❌ Error", "Failed to add medicine", "error");
    },
  });

  // Update medicine mutation
  const updateMedicineMutation = useMutation({
    mutationFn: async ({ id, updatedMedicine }) => {
      const res = await axiosSecure.patch(`/medicines/${id}`, updatedMedicine);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medicines", user.email]);
      Swal.fire("✅ Success", "Medicine updated successfully", "success");
      setShowModal(false);
      resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
    onError: () => {
      Swal.fire("❌ Error", "Failed to update medicine", "error");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      genericName: "",
      description: "",
      image: "",
      category: "",
      company: "",
      unit: "",
      price: "",
      stock: "",
      discount: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const medicineData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount),
      stock: parseInt(formData.stock, 10),
      sellerEmail: user?.email,
      status: "available",
      date: new Date(),
    };

    if (isEditMode && editingId) {
      updateMedicineMutation.mutate({ id: editingId, updatedMedicine: medicineData });
    } else {
      addMedicineMutation.mutate(medicineData);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/medicines/${id}`);
      queryClient.invalidateQueries(["medicines", user.email]);
      Swal.fire("Deleted!", "Medicine has been deleted.", "success");
    }
  };

  const handleEdit = (medicine) => {
    setFormData({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      description: medicine.description || "",
      image: medicine.image || "",
      category: medicine.category || "",
      company: medicine.company || "",
      unit: medicine.unit || "",
      price: medicine.price || "",
      stock: medicine.stock || "",
      discount: medicine.discount || 0,
    });
    setIsEditMode(true);
    setEditingId(medicine._id);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-[var(--color-bg)] min-h-screen rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          Manage Medicines
        </h2>
        <button
          onClick={() => {
            resetForm();
            setIsEditMode(false);
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <FaPlus /> Add Medicine
        </button>
      </div>

      {/* Medicine Table */}
      {isLoading ? (
        <p className="text-center text-[var(--color-text)]">Loading medicines...</p>
      ) : medicines.length === 0 ? (
        <p className="text-center text-gray-500">No medicines found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--color-primary)] text-white">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Generic</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr
                    key={med._id}
                    className="border-b hover:bg-[var(--color-bg)] transition"
                  >
                    <td className="px-4 py-2">
                      {med.image ? (
                        <img
                          src={med.image}
                          alt={med.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium">{med.name}</td>
                    <td className="px-4 py-2">{med.genericName}</td>
                    <td className="px-4 py-2">{med.category}</td>
                    <td className="px-4 py-2">{med.company}</td>
                    <td className="px-4 py-2">{med.unit}</td>
                    <td className="px-4 py-2 text-[var(--color-secondary)] font-semibold">
                      ৳{med.price}
                    </td>
                    <td className="px-4 py-2">{med.discount}%</td>
                    <td className="px-4 py-2">{med.stock}</td>
                    <td className="px-4 py-2 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(med)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(med._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="btn-group mt-4 flex justify-center gap-2">
            <button
              className="btn btn-outline"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  className={`btn btn-outline ${
                    pageNumber === currentPage ? "btn-active" : ""
                  }`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className="btn btn-outline"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Add/Edit Medicine Modal */}
      {showModal && (
        <div className="fixed inset-0 shadow-2xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setIsEditMode(false);
                setEditingId(null);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <h2 className="text-3xl font-semibold mb-8 text-center text-[var(--color-primary)]">
              {isEditMode ? "Edit Medicine" : "Add New Medicine"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Name */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Item Name</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Enter medicine name"
                  required
                />
              </label>

              {/* Generic Name */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Generic Name</span>
                <input
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Enter generic name"
                  required
                />
              </label>

              {/* Category */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Category</span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select select-bordered"
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              {/* Company */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Company</span>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Enter company name"
                  required
                />
              </label>

              {/* Unit */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Unit (mg/ml)</span>
                <input
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="e.g. 500mg"
                  required
                />
              </label>

              {/* Price */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Price (৳)</span>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Enter price"
                  min={0}
                  step="0.01"
                  required
                />
              </label>

              {/* Stock */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Stock</span>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Enter stock quantity"
                  min={0}
                  required
                />
              </label>

              {/* Discount */}
              <label className="flex flex-col">
                <span className="mb-2 font-medium text-gray-700">Discount %</span>
                <input
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Enter discount if any"
                  min={0}
                  max={100}
                />
              </label>

              {/* Image URL */}
              <label className="flex flex-col col-span-1 md:col-span-2">
                <span className="mb-2 font-medium text-gray-700">Image URL</span>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Paste image URL here"
                  required
                />
              </label>

              {/* Description */}
              <label className="flex flex-col col-span-1 md:col-span-2">
                <span className="mb-2 font-medium text-gray-700">Description</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  placeholder="Write a short description"
                  required
                ></textarea>
              </label>
            </div>

            <button
              type="submit"
              disabled={addMedicineMutation.isLoading || updateMedicineMutation.isLoading}
              className="mt-8 w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              {(addMedicineMutation.isLoading || updateMedicineMutation.isLoading)
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update"
                : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
