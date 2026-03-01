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

  const categories = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops"];

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

  const medicines = Array.isArray(medicinesResponse?.data) ? medicinesResponse.data : [];
  const currentPage = medicinesResponse?.currentPage || 1;
  const totalPages = medicinesResponse?.totalPages || 1;

  // Mutations
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
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
          Manage Medicines
        </h2>
        <button
          onClick={() => { resetForm(); setIsEditMode(false); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg hover:scale-105 transition dark:from-teal-700 dark:to-emerald-600"
        >
          <FaPlus /> Add Medicine
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading Medicines...</p>
      ) : medicines.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500">No medicines found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl shadow-lg backdrop-blur-md bg-white/70 dark:bg-gray-900/70">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gradient-to-r from-emerald-400 to-teal-300 dark:from-teal-700 dark:to-emerald-600 text-white">
                <tr>
                  {["Image","Name","Generic","Category","Company","Unit","Price","Discount","Stock","Action"].map(col => (
                    <th key={col} className="px-4 py-3 text-left font-medium">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {medicines.map(med => (
                  <tr key={med._id} className="hover:bg-white/20 dark:hover:bg-gray-700/30 transition rounded-lg">
                    <td className="px-4 py-2">{med.image ? <img src={med.image} alt={med.name} className="w-12 h-12 object-cover rounded-xl shadow-sm"/> : "N/A"}</td>
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-200">{med.name}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{med.genericName}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{med.category}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{med.company}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{med.unit}</td>
                    <td className="px-4 py-2 font-semibold text-emerald-600 dark:text-emerald-400">${med.price}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{med.discount}%</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{med.stock}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button onClick={() => handleEdit(med)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition" title="Edit"><FaEdit/></button>
                      <button onClick={() => handleDelete(med._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition" title="Delete"><FaTrash/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <button onClick={() => setPage(p=>Math.max(p-1,1))} className="btn btn-outline rounded-full" disabled={currentPage===1}>Previous</button>
            {[...Array(totalPages)].map((_, idx)=>(
              <button key={idx} onClick={()=>setPage(idx+1)} className={`btn rounded-full ${currentPage===idx+1 ? "bg-emerald-500 text-white dark:bg-teal-600" : "btn-outline"}`}>{idx+1}</button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(p+1,totalPages))} className="btn btn-outline rounded-full" disabled={currentPage===totalPages}>Next</button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-scaleIn relative">
            <button type="button" onClick={()=>{setShowModal(false); setIsEditMode(false); setEditingId(null); resetForm();}} className="absolute top-4 right-4 text-red-500 dark:text-red-400 text-3xl font-bold">&times;</button>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-emerald-700 dark:text-emerald-400">{isEditMode ? "Edit Medicine" : "Add New Medicine"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[{label:"Item Name",name:"name",type:"text"},{label:"Generic Name",name:"genericName",type:"text"},{label:"Company",name:"company",type:"text"},{label:"Unit (mg/ml)",name:"unit",type:"text"},{label:"Price (৳)",name:"price",type:"number"},{label:"Stock",name:"stock",type:"number"},{label:"Discount %",name:"discount",type:"number"}].map(field=>(
                <label key={field.name} className="relative flex flex-col">
                  <input name={field.name} type={field.type} value={formData[field.name]} onChange={handleInputChange} placeholder=" " className="input input-bordered w-full border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring focus:ring-emerald-300/50 dark:focus:ring-emerald-400/50 rounded-lg peer text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800"/>
                  <span className="absolute left-3 -top-2 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">{field.label}</span>
                </label>
              ))}

              {/* Category */}
              <label className="relative flex flex-col">
                <select name="category" value={formData.category} onChange={handleInputChange} className="select select-bordered w-full border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring focus:ring-emerald-300/50 dark:focus:ring-emerald-400/50 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat=><option key={cat} value={cat}>{cat}</option>)}
                </select>
                <span className="absolute left-3 -top-2 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 px-1">Category</span>
              </label>

              {/* Image URL */}
              <label className="relative flex flex-col md:col-span-2">
                <input name="image" value={formData.image} onChange={handleInputChange} placeholder=" " className="input input-bordered w-full border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring focus:ring-emerald-300/50 dark:focus:ring-emerald-400/50 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"/>
                <span className="absolute left-3 -top-2 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 px-1 transition-all">Image URL</span>
              </label>

              {/* Description */}
              <label className="relative flex flex-col md:col-span-2">
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder=" " rows={4} className="textarea textarea-bordered w-full border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring focus:ring-emerald-300/50 dark:focus:ring-emerald-400/50 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"></textarea>
                <span className="absolute left-3 -top-2 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 px-1 transition-all">Description</span>
              </label>
            </div>

            <button type="submit" disabled={addMedicineMutation.isLoading || updateMedicineMutation.isLoading} className="mt-6 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-teal-700 dark:to-emerald-600 text-white rounded-2xl font-semibold hover:scale-105 transition">
              {addMedicineMutation.isLoading || updateMedicineMutation.isLoading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update" : "Submit")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}