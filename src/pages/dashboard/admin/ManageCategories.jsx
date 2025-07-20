import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

const ManageCategories = () => {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    image: "",
  });

  // Fetch All Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });

  // Add Category Mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory) => {
      const res = await axiosSecure.post("/categories", newCategory);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire("✅ Success!", "New category added!", "success");
      closeModal();
    },
  });

  // Update Category Mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, updatedCategory }) => {
      const res = await axiosSecure.patch(`/categories/${id}`, updatedCategory);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire("✅ Updated!", "Category updated successfully!", "success");
      closeModal();
    },
  });

  // Delete Category Mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      Swal.fire("🗑 Deleted!", "Category removed!", "success");
    },
  });

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategoryMutation.mutate(id);
      }
    });
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateCategoryMutation.mutate({
        id: currentId,
        updatedCategory: formData,
      });
    } else {
      addCategoryMutation.mutate(formData);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData({ categoryName: "", image: "" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (category) => {
    setIsEdit(true);
    setCurrentId(category._id);
    setFormData({ categoryName: category.categoryName, image: category.image });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ categoryName: "", image: "" });
  };

  if (isLoading) return <p className="text-center text-[var(--color-primary)]">Loading categories...</p>;

  return (
    <div className="p-6 bg-[var(--color-bg)] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">Manage Categories</h2>
        <button
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg shadow hover:bg-indigo-700 transition"
          onClick={openAddModal}
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr
                key={cat._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-[var(--color-bg)] transition`}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={cat.image}
                    alt={cat.categoryName}
                    className="w-12 h-12 rounded shadow"
                  />
                </td>
                <td className="p-3 font-medium text-[var(--color-text)]">{cat.categoryName}</td>
                <td className="p-3 text-center flex gap-3 justify-center">
                  <button
                    className="p-2 bg-[var(--color-secondary)] text-white rounded hover:bg-orange-600 transition"
                    onClick={() => openEditModal(cat)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    onClick={() => handleDelete(cat._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
              {isEdit ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                className="input input-bordered w-full border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                className="input input-bordered w-full border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-indigo-700"
                >
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
