// src/pages/Dashboard/Seller/AskForAdvertisement.jsx

import useAxiosSecure from "../../../hooks/useAxioseSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export default function AskForAdvertisement() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();

  const { data: ads = [], refetch } = useQuery({
    queryKey: ["ads", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/advertisements/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const onSubmit = async (data) => {
    const ad = {
      medicineName: data.name,
      description: data.description,
      medicineImage: data.image,
      sellerEmail: user.email,
    };

    const res = await axiosSecure.post("/advertisements", ad);
    if (res.data.insertedId) {
      Swal.fire("Submitted!", "Advertisement request sent.", "success");
      reset();
      refetch();
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Ask for Advertisement</h2>

      {/* 🔘 Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-4 bg-base-200 p-6 rounded-lg"
      >
        <input
          {...register("name")}
          className="input input-bordered w-full"
          placeholder="Medicine Name"
          required
        />
        <input
          {...register("image")}
          className="input input-bordered w-full"
          placeholder="Image URL"
          required
        />
        <textarea
          {...register("description")}
          className="textarea textarea-bordered md:col-span-2"
          placeholder="Short Description"
          required
        />
        <button type="submit" className="btn btn-primary md:col-span-2">
          Submit Advertisement Request
        </button>
      </form>

      {/* 🧾 Current Requests */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">My Ad Requests</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Status</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, index) => (
                <tr key={ad._id}>
                  <td>{index + 1}</td>
                  <td>{ad.medicineName}</td>
                  <td>
                    <span
                      className={`badge ${
                        ad.status === "approved" ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>
                  <td>
                    <img src={ad.medicineImage} alt="" className="w-12 h-12 rounded" />
                  </td>
                </tr>
              ))}
              {ads.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500">
                    No advertisement requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
