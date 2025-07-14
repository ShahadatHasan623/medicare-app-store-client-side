import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";

const AddMedicine = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();

  // Get categories from server
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });

  // Mutation for inserting medicine
  const { mutate } = useMutation({
    mutationFn: async (newMedicine) => {
      const res = await axiosSecure.post("/medicines", newMedicine);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Medicine Added Successfully", "success");
      reset();
    },
    onError: () => {
      Swal.fire("Error", "Failed to add medicine", "error");
    },
  });

  const onSubmit = (data) => {
    const newMed = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      sellerEmail: user?.email,
      sellerName: user?.displayName,
      createdAt: new Date(),
    };
    mutate(newMed);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Add New Medicine</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name", { required: true })} placeholder="Medicine Name" className="input input-bordered w-full" />
        <input {...register("price", { required: true })} type="number" placeholder="Price" className="input input-bordered w-full" />
        <input {...register("stock", { required: true })} type="number" placeholder="Stock Quantity" className="input input-bordered w-full" />
        <input {...register("image", { required: true })} placeholder="Image URL" className="input input-bordered w-full" />
        <select {...register("category", { required: true })} className="select select-bordered w-full">
          <option disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary w-full">Add Medicine</button>
      </form>
    </div>
  );
};

export default AddMedicine;
