import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


export default function ManageCategories() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery(
    ["categories"],
    async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    }
  );

  // Add category mutation
  const addCategoryMutation = useMutation(
    (category) => axiosSecure.post("/categories", category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        setNewCategoryName("");
      },
    }
  );

  // Delete category mutation
  const deleteCategoryMutation = useMutation(
    (id) => axiosSecure.delete(`/categories/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries(["categories"]),
    }
  );

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return alert("Please enter a category name");

    addCategoryMutation.mutate({ name: newCategoryName });
  };

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {/* Add New Category */}
      <form onSubmit={handleAddCategory} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="input input-bordered flex-grow"
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      {/* List Categories */}
      <ul>
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategoryMutation.mutate(cat._id)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
