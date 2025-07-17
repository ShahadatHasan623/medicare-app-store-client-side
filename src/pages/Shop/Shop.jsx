import React, { useState } from "react";
import { FaEye, FaCartPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../hooks/useAxioseSecure";
import { useLocalStorageCart } from "../../utils/useLocalStorageCart";
import useAxios from "../../hooks/useAxios";

const Shop= () => {
  const axiosSecure = useAxioseSecure();
  const { addToCart } = useLocalStorageCart();
  const useaxios =useAxios()

  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: medicines = [], isLoading, isError } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await useaxios.get(`/medicines`);
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
  console.log(medicines)
  

  // Safely filter and sort medicines
  const filteredMedicines = medicines
    .filter((med) => {
      // check if med.name is string before calling toLowerCase
      if (typeof med.name === "string") {
        return med.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false; // ignore if no valid name
    })
    .sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      // Handle string sorting (name, category)
      if ((sortField === "name" || sortField === "category") && typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc"
          ? fieldA.toLowerCase().localeCompare(fieldB.toLowerCase())
          : fieldB.toLowerCase().localeCompare(fieldA.toLowerCase());
      }

      // Handle numeric sorting (price or perUnitPrice)
      if ((sortField === "price" || sortField === "perUnitPrice") && typeof fieldA === "number" && typeof fieldB === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }

      return 0; // fallback no sorting
    });

  if (isError) {
    return (
      <div className="text-center text-red-600 mt-10">
        Error loading medicines. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 my-10">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">Shop Medicines</h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row flex-wrap justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search medicine name..."
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div>
          <label className="font-semibold mr-2">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div>
          <label className="font-semibold mr-2">Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      {isLoading ? (
        <p className="text-center text-gray-600">Loading medicines...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md text-sm md:text-base">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Medicine</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price (৳)</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No medicines found.
                  </td>
                </tr>
              ) : (
                medicines.map((med) => (
                  <tr key={med._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={med.image}
                        alt={med.name ?? "medicine image"}
                        className="w-14 h-14 object-cover rounded shadow"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{med.name ?? "N/A"}</td>
                    <td className="px-4 py-3">{med.company ?? "N/A"}</td>
                    <td className="px-4 py-3">{med.unit ?? "N/A"}</td>
                    <td className="px-4 py-3">{med.category ?? "N/A"}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      ৳{med.price ?? med.perUnitPrice ?? "N/A"}
                    </td>
                    <td className="px-4 py-3">{med.stock ?? "N/A"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => setModalData(med)}
                        title="View Details"
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                      >
                        <FaEye />
                      </button>
                      <button
                        disabled={!med.stock || med.stock === 0}
                        onClick={() => addToCart(med)}
                        title={!med.stock || med.stock === 0 ? "Out of stock" : "Add to cart"}
                        className={`p-2 rounded text-white ${
                          !med.stock || med.stock === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 transition"
                        }`}
                      >
                        <FaCartPlus />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg p-6 relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              title="Close"
            >
              &times;
            </button>

            <img
              src={modalData.image}
              alt={modalData.name ?? "medicine image"}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{modalData.name ?? "N/A"}</h2>
            <p className="mb-2 text-gray-700">
              {modalData.description ?? "No description available."}
            </p>
            <p><strong>Company:</strong> {modalData.company ?? "N/A"}</p>
            <p><strong>Unit:</strong> {modalData.unit ?? "N/A"}</p>
            <p><strong>Category:</strong> {modalData.category ?? "N/A"}</p>
            <p><strong>Price:</strong> ৳{modalData.price ?? modalData.perUnitPrice ?? "N/A"}</p>
            <p><strong>Stock:</strong> {modalData.stock ?? "N/A"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
