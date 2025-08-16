import React, { useState } from "react";
import { FaEye, FaCartPlus, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
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
  const [page, setPage] = useState(1);
  const limit = 5;

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
    .filter((med) => med.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });

  const handleAddToCart = (med) => {
    addToCart(med);
    toast.success(`${med.name ?? "Medicine"} added to cart!`, {
      position: "top-right",
      autoClose: 2500,
    });
  };

  return (
    <div className="max-w-7xl mx-auto lg:px-0 px-5 my-12">
      <ReTitle title="Medicare | Shop" />
      <h1 className="text-5xl font-extrabold text-[var(--color-primary)] mb-10 text-center tracking-wide drop-shadow-md">
        🛒 Shop Medicines
      </h1>

      {/* Search & Sort */}
      <div className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center border border-[var(--color-border)]">
        <input
          type="text"
          placeholder="🔍 Search medicine..."
          className="border border-[var(--color-border)] rounded-xl px-5 py-3 w-full md:max-w-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition backdrop-blur-sm bg-white/70"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-4">
          <label className="font-semibold text-[var(--color-text)]">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-[var(--color-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition backdrop-blur-sm bg-white/70"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="font-semibold text-[var(--color-text)]">Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-[var(--color-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition backdrop-blur-sm bg-white/70"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-[var(--color-border)]">
        <table className="min-w-full text-left text-[var(--color-text)]">
          <thead className="bg-[var(--color-primary)] text-white">
            <tr>
              {["Image", "Medicine", "Company", "Unit", "Category", "Price", "Stock", "Actions"].map(
                (heading) => (
                  <th key={heading} className="px-8 py-6 font-semibold tracking-wide text-lg">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[var(--color-muted)]">
                  Loading medicines...
                </td>
              </tr>
            ) : filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[var(--color-muted)] italic">
                  No medicines found.
                </td>
              </tr>
            ) : (
              filteredMedicines.map((med) => (
                <tr
                  key={med._id}
                  className="hover:bg-[var(--color-primary)]/10 transition-colors duration-300 rounded-xl"
                >
                  <td className="px-8 py-6">
                    <img
                      src={med.image}
                      alt={med.name ?? "medicine"}
                      className="w-20 h-20 object-cover rounded-xl shadow-lg"
                    />
                  </td>
                  <td className="px-8 py-6 font-semibold text-lg">{med.name ?? "N/A"}</td>
                  <td className="px-8 py-6 text-base">{med.company ?? "N/A"}</td>
                  <td className="px-8 py-6 text-base">{med.unit ?? "N/A"}</td>
                  <td className="px-8 py-6 text-base">{med.category ?? "N/A"}</td>
                  <td className="px-8 py-6 font-bold text-[var(--color-secondary)] text-lg">
                    ৳{med.price ?? med.perUnitPrice ?? "N/A"}
                  </td>
                  <td className="px-8 py-6">{med.stock ?? "N/A"}</td>
                  <td className="px-8 py-6 flex gap-4">
                    <button
                      onClick={() => setModalData(med)}
                      className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-2xl p-4 shadow-lg transition"
                    >
                      <FaEye className="text-xl" />
                    </button>
                    <button
                      disabled={!med.stock || med.stock === 0}
                      onClick={() => handleAddToCart(med)}
                      className={`p-4 rounded-2xl text-white shadow-lg ${
                        !med.stock || med.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 transition"
                      }`}
                    >
                      <FaCartPlus className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className={`px-5 py-3 rounded-2xl flex items-center gap-2 ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
          }`}
        >
          <FaArrowLeft /> Prev
        </button>
        <span className="text-[var(--color-text)] font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
          disabled={page === totalPages}
          className={`px-5 py-3 rounded-2xl flex items-center gap-2 ${
            page === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
          }`}
        >
          Next <FaArrowRight />
        </button>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-6">
          <div className="bg-[var(--color-surface)] backdrop-blur-md rounded-3xl max-w-xl w-full shadow-2xl p-8 relative border border-[var(--color-border)]">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-5 right-5 bg-gray-200 hover:bg-gray-400 text-gray-700 rounded-full p-3 shadow-lg transition"
            >
              <FaTimes className="text-xl" />
            </button>
            <img
              src={modalData.image}
              alt={modalData.name}
              className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg"
            />
            <h2 className="text-3xl font-bold mb-3 text-[var(--color-text)]">{modalData.name}</h2>
            <p className="text-[var(--color-muted)] mb-5">{modalData.description ?? "No description available."}</p>
            <div className="grid grid-cols-2 gap-4 text-[var(--color-text)] font-medium text-lg">
              <p>
                <span className="font-semibold">Company:</span> {modalData.company ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Unit:</span> {modalData.unit ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Category:</span> {modalData.category ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Price:</span> ৳{modalData.price ?? modalData.perUnitPrice ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Stock:</span> {modalData.stock ?? "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
