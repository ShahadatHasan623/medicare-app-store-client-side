import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";


export default function ManageBanner() {
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerImage, setNewBannerImage] = useState("");
  const axioseSecure =useAxioseSecure()

  const queryClient = useQueryClient();

  // Fetch banners
  const { data: banners = [], isLoading } = useQuery(["advertisements"], async () => {
    const res = await axioseSecure.get("/advertisements");
    return res.data;
  });

  // Mutation to add new banner
  const addBannerMutation = useMutation(
    (newBanner) => axioseSecure.post("/advertisements", newBanner),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["advertisements"]);
        setNewBannerTitle("");
        setNewBannerImage("");
      }
    }
  );

  // Mutation to delete banner
  const deleteBannerMutation = useMutation(
    (id) => axioseSecure.delete(`/advertisements/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries(["advertisements"]),
    }
  );

  if (isLoading) return <p>Loading banners...</p>;

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImage) return alert("Fill all fields");

    addBannerMutation.mutate({
      title: newBannerTitle,
      image: newBannerImage,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Banner</h1>

      {/* Add new banner form */}
      <form onSubmit={handleAddBanner} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Banner Title"
          value={newBannerTitle}
          onChange={(e) => setNewBannerTitle(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
        <input
          type="text"
          placeholder="Banner Image URL"
          value={newBannerImage}
          onChange={(e) => setNewBannerImage(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
        <button type="submit" className="btn btn-primary">Add Banner</button>
      </form>

      {/* List existing banners */}
      <ul>
        {banners.map((banner) => (
          <li key={banner._id} className="flex justify-between items-center mb-3 border p-2 rounded max-w-md">
            <img src={banner.image} alt={banner.title} className="h-16" />
            <span>{banner.title}</span>
            <button
              onClick={() => deleteBannerMutation.mutate(banner._id)}
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
