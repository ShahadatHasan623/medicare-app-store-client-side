import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function ManageCategories() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery(
    ["categories"],
    async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    }
  );

  const addCategoryMutation = useMutation(
    (newCategory) => axiosSecure.post("/categories", newCategory),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        Swal.fire("Added!", "Category added successfully.", "success");
      },
      onError: () => {
        Swal.fire("Error!", "Failed to add category.", "error");
      },
    }
  );

  const updateCategoryMutation = useMutation(
    ({ id, data }) => axiosSecure.patch(`/categories/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        Swal.fire("Updated!", "Category updated successfully.", "success");
      },
      onError: () => {
        Swal.fire("Error!", "Failed to update category.", "error");
      },
    }
  );

  const deleteCategoryMutation = useMutation(
    (id) => axiosSecure.delete(`/categories/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        Swal.fire("Deleted!", "Category deleted successfully.", "success");
      },
      onError: () => {
        Swal.fire("Error!", "Failed to delete category.", "error");
      },
    }
  );

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return Swal.fire("Warning", "Category name required", "warning");
    addCategoryMutation.mutate({ name: newCategoryName });
    setNewCategoryName("");
  };

  const startEdit = (category) => {
    setEditId(category._id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const saveEdit = () => {
    if (!editName.trim()) return Swal.fire("Warning", "Category name required", "warning");
    updateCategoryMutation.mutate({ id: editId, data: { name: editName } });
    setEditId(null);
    setEditName("");
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories</p>;

  return (
    <div>
      <h2>Manage Categories</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory} disabled={addCategoryMutation.isLoading}>
          Add Category
        </button>
      </div>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                No categories found.
              </td>
            </tr>
          )}

          {categories.map((category) => (
            <tr key={category._id}>
              <td>
                {editId === category._id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editId === category._id ? (
                  <>
                    <button onClick={saveEdit} disabled={updateCategoryMutation.isLoading}>
                      Save
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(category)}>Edit</button>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          cancelButtonColor: "#3085d6",
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteCategoryMutation.mutate(category._id);
                          }
                        });
                      }}
                      disabled={deleteCategoryMutation.isLoading}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
