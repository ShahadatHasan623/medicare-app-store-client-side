import { useParams } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaCartPlus } from "react-icons/fa";
import useAxioseSecure from "../../hooks/useAxioseSecure";
import { useLocalStorageCart } from "../../utils/useLocalStorageCart";

const CategoryDetails = () => {
  const { id } = useParams(); // id = categoryId
  const axiosSecure = useAxioseSecure();
  const { addToCart } = useLocalStorageCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch category & medicines by ID
  const { data, isLoading, error } = useQuery({
    queryKey: ["category-medicines", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/categories/${id}/medicines`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner text-primary text-4xl"></span>
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center text-lg">
        ❌ Failed to load medicines
      </p>
    );

  const { category, medicines = [] } = data || {};

  // ✅ Filter & Sort
  const filteredMedicines = medicines
    .filter((med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div className="max-w-7xl mx-auto px-4 my-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">
        Category: {category?.categoryName}
      </h2>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <input
          type="text"
          placeholder="🔍 Search medicine name..."
          className="border px-4 py-2 rounded w-full md:w-1/2 focus:outline-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label className="font-semibold">Sort by Name:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredMedicines.length === 0 ? (
        <p className="text-red-500">No medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md text-sm md:text-base">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredMedicines.map((med) => (
                <tr key={med._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-12 h-12 object-cover rounded shadow"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{med.name}</td>
                  <td className="px-4 py-3">{med.company}</td>
                  <td className="px-4 py-3">{med.unit}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    ৳{med.price}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      title="View"
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                      onClick={() => {
                        setSelectedMedicine(med);
                        setShowModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      title="Add to Cart"
                      disabled={med.stock === 0}
                      onClick={() => addToCart(med)}
                      className={`p-2 rounded text-white ${
                        med.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <FaCartPlus />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <img
              src={selectedMedicine.image}
              alt={selectedMedicine.name}
              className="w-24 h-24 object-contain mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-center mb-2">
              {selectedMedicine.name}
            </h2>
            <p className="text-center text-gray-600 mb-1">
              Company: {selectedMedicine.company}
            </p>
            <p className="text-center text-gray-600 mb-1">
              Unit: {selectedMedicine.unit}
            </p>
            <p className="text-center text-green-600 text-lg font-semibold mb-2">
              ৳{selectedMedicine.price}
            </p>
            <button
              onClick={() => {
                addToCart(selectedMedicine);
                setShowModal(false);
              }}
              disabled={selectedMedicine.stock === 0}
              className={`w-full py-2 rounded font-medium text-white ${
                selectedMedicine.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
