import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
const MyMedicines = () => {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // 🔃 Load seller's own medicines
  const { data: medicines = [], refetch } = useQuery({
    queryKey: ["my-medicines", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/medicines?sellerEmail=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // 🔃 Load categories for dropdown (optional)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });

  // 📤 Add Medicine
  const onSubmit = async (data) => {
    setLoading(true);

    const medicineData = {
      itemName: data.itemName,
      genericName: data.genericName,
      shortDescription: data.shortDescription,
      image: data.image,
      category: data.category,
      company: data.company,
      unit: data.unit,
      price: parseFloat(data.price),
      discount: parseFloat(data.discount || 0),
      sellerEmail: user?.email,
    };

    try {
      const res = await axiosSecure.post("/medicines", medicineData);
      if (res.data.insertedId) {
        Swal.fire("Success!", "Medicine Added", "success");
        refetch();
        reset();
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete Medicine
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/medicines/${id}`);
        Swal.fire("Deleted!", "Medicine has been removed.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage My Medicines</h2>

      {/* ✅ Add Medicine Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-4 bg-base-200 p-6 rounded-lg mb-6"
      >
        <input
          {...register("itemName")}
          className="input input-bordered w-full"
          placeholder="Item Name"
          required
        />
        <input
          {...register("genericName")}
          className="input input-bordered w-full"
          placeholder="Generic Name"
          required
        />
        <input
          {...register("shortDescription")}
          className="input input-bordered w-full"
          placeholder="Short Description"
          required
        />
        <input
          {...register("image")}
          className="input input-bordered w-full"
          placeholder="Image URL"
          required
        />
        <select
          {...register("category")}
          className="select select-bordered w-full"
          required
        >
          <option disabled value="">
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.categoryName}>
              {cat.categoryName}
            </option>
          ))}
        </select>
        <input
          {...register("company")}
          className="input input-bordered w-full"
          placeholder="Company"
          required
        />
        <select
          {...register("unit")}
          className="select select-bordered w-full"
          required
        >
          <option disabled value="">
            Select Unit
          </option>
          <option value="mg">mg</option>
          <option value="ml">ml</option>
        </select>
        <input
          type="number"
          {...register("price")}
          className="input input-bordered w-full"
          placeholder="Price"
          required
        />
        <input
          type="number"
          {...register("discount")}
          className="input input-bordered w-full"
          placeholder="Discount (%)"
          defaultValue={0}
        />
        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary col-span-2"
        >
          {loading ? "Adding..." : "Add Medicine"}
        </button>
      </form>

      {/* ✅ Medicine Table */}
      <div className="overflow-x-auto bg-base-200 rounded-lg p-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Generic</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Company</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, index) => (
              <tr key={med._id}>
                <td>{index + 1}</td>
                <td>{med.itemName}</td>
                <td>{med.genericName}</td>
                <td>${med.price}</td>
                <td>{med.discount || 0}%</td>
                <td>{med.company}</td>
                <td>
                  <button
                    onClick={() => handleDelete(med._id)}
                    className="btn btn-error btn-sm text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500">
                  No medicines added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyMedicines;
