import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function MyMedicines() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
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

  // ✅ Fetch medicines for this seller
  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["medicines", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/medicines?sellerEmail=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ Add medicine mutation
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
    },
    onError: () => {
      Swal.fire("❌ Error", "Failed to add medicine", "error");
    },
  });

  // ✅ Reset form
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

  // ✅ Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle submit
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

    addMedicineMutation.mutate(medicineData);
  };

  // ✅ Delete medicine
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

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Manage Medicines</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Medicine
        </button>
      </div>

      {/* Medicine Table */}
      {isLoading ? (
        <p className="text-center">Loading medicines...</p>
      ) : medicines.length === 0 ? (
        <p className="text-center text-gray-500">No medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Generic</th>
                <th>Category</th>
                <th>Company</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med._id}>
                  <td>
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td>{med.name}</td>
                  <td>{med.genericName}</td>
                  <td>{med.category}</td>
                  <td>{med.company}</td>
                  <td>{med.unit}</td>
                  <td>৳{med.price}</td>
                  <td>{med.discount}%</td>
                  <td>{med.stock}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(med._id)}
                      className="btn btn-error btn-xs"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Add Medicine Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-lg relative overflow-y-auto max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-3xl font-bold hover:text-red-600"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Add New Medicine</h2>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Item Name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
              <input
                name="genericName"
                placeholder="Generic Name"
                value={formData.genericName}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
              <input
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
              <input
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
              <input
                name="unit"
                placeholder="Unit (mg/ml)"
                value={formData.unit}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
              <input
                name="price"
                placeholder="Price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
              <input
                name="stock"
                placeholder="Stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
              <input
                name="discount"
                placeholder="Discount %"
                type="number"
                value={formData.discount}
                onChange={handleInputChange}
                className="input input-bordered"
              />
              <input
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
                className="input input-bordered col-span-2"
                required
              />
              <textarea
                name="description"
                placeholder="Short Description"
                value={formData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered col-span-2"
                rows={3}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-success mt-4 w-full"
              disabled={addMedicineMutation.isLoading}
            >
              {addMedicineMutation.isLoading ? "Adding..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
