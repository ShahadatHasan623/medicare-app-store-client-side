import React, { useState } from "react";
import { FaEye, FaCartPlus, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { useCart } from "../../utils/CartContext";
import { ReTitle } from "re-title";

const Shop = () => {
  const { addToCart } = useCart();
  const axios = useAxios();

  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 5;

  // Fetch medicines
  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicines", page],
    queryFn: async () => {
      const res = await axios.get(`/medicines?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const medicines = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const filteredMedicines = medicines
    .filter(
      (med) =>
        typeof med.name === "string" &&
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      if (
        (sortField === "name" || sortField === "category") &&
        typeof fieldA === "string" &&
        typeof fieldB === "string"
      ) {
        return sortOrder === "asc"
          ? fieldA.toLowerCase().localeCompare(fieldB.toLowerCase())
          : fieldB.toLowerCase().localeCompare(fieldA.toLowerCase());
      }
      if (
        (sortField === "price" || sortField === "perUnitPrice") &&
        typeof fieldA === "number" &&
        typeof fieldB === "number"
      ) {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });

  const handleAddToCart = (med) => {
    addToCart(med);
    toast.success(`${med.name ?? "Medicine"} added to cart!`, {
      position: "top-right",
      autoClose: 2500,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (isError)
    return (
      <div className="text-center text-red-600 mt-16 font-semibold text-lg">
        ❌ Error loading medicines. Please try again later.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 my-12">
      <ReTitle title="Medicare | Shop"></ReTitle>
      <h1 className="text-5xl font-extrabold text-blue-700 mb-10 text-center tracking-wide drop-shadow-md">
        🛒 Shop Medicines
      </h1>

      {/* Search & Sort */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <input
          type="text"
          placeholder="🔍 Search medicine name..."
          className="border border-gray-300 rounded-lg px-5 py-3 w-full md:max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      {isLoading ? (
        <p className="text-center text-gray-600 text-lg">
          Loading medicines...
        </p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {[
                    "Image",
                    "Medicine",
                    "Company",
                    "Unit",
                    "Category",
                    "Price (৳)",
                    "Stock",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 font-semibold tracking-wide"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-8 text-gray-500 italic"
                    >
                      No medicines found.
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((med) => (
                    <tr
                      key={med._id}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={med.image}
                          alt={med.name ?? "medicine image"}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {med.name ?? "N/A"}
                      </td>
                      <td className="px-6 py-4">{med.company ?? "N/A"}</td>
                      <td className="px-6 py-4">{med.unit ?? "N/A"}</td>
                      <td className="px-6 py-4">{med.category ?? "N/A"}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        ৳{med.price ?? med.perUnitPrice ?? "N/A"}
                      </td>
                      <td className="px-6 py-4">{med.stock ?? "N/A"}</td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          onClick={() => setModalData(med)}
                          className="bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg p-3 shadow-md"
                        >
                          <FaEye className="text-lg" />
                        </button>
                        <button
                          disabled={!med.stock || med.stock === 0}
                          onClick={() => handleAddToCart(med)}
                          className={`p-3 rounded-lg text-white shadow-md ${
                            !med.stock || med.stock === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 transition"
                          }`}
                        >
                          <FaCartPlus className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {filteredMedicines.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No medicines found.
              </p>
            ) : (
              filteredMedicines.map((med) => (
                <div
                  key={med._id}
                  className="bg-white rounded-xl shadow-lg p-4 flex flex-col"
                >
                  <img
                    src={med.image}
                    alt={med.name ?? "medicine image"}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-bold">{med.name}</h3>
                  <p className="text-sm text-gray-500">{med.company}</p>
                  <p className="text-sm text-gray-500">
                    {med.category} • {med.unit}
                  </p>
                  <p className="text-green-600 font-semibold text-lg mt-2">
                    ৳{med.price ?? med.perUnitPrice}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setModalData(med)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      disabled={!med.stock || med.stock === 0}
                      onClick={() => handleAddToCart(med)}
                      className={`flex-1 py-2 rounded-lg text-white ${
                        !med.stock || med.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md ${
            page === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 shadow-2xl bg-opacity-60 flex justify-center items-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl p-8 relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-5 right-5 bg-gray-200 hover:bg-gray-400 text-gray-700 rounded-full p-2 shadow-md"
            >
              <FaTimes size={24} />
            </button>
            <img
              src={modalData.image}
              alt={modalData.name ?? "medicine image"}
              className="w-full h-56 object-cover rounded-lg mb-6 shadow"
            />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {modalData.name ?? "N/A"}
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              {modalData.description ?? "No description available."}
            </p>
            <div className="grid grid-cols-2 gap-x-8 text-gray-800 font-medium">
              <p>
                <span className="font-semibold">Company:</span>{" "}
                {modalData.company ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Unit:</span>{" "}
                {modalData.unit ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {modalData.category ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Price:</span> ৳
                {modalData.price ?? modalData.perUnitPrice ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Stock:</span>{" "}
                {modalData.stock ?? "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
