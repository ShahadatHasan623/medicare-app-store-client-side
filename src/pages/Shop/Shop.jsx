import React, { useState } from "react";
import { FaEye, FaCartPlus } from "react-icons/fa";
import { useLocalStorageCart } from "../../utils/useLocalStorageCart";

const demoMedicines = [
  {
    _id: "1",
    name: "Napa Extra",
    company: "Beximco Pharma",
    unit: "1 strip",
    category: "Pain Relief",
    price: 10,
    originalPrice: 12,
    stock: 50,
    quantity: 2,
    image: "https://i.ibb.co/N3YqGhC/napa-extra.jpg",
    type: "Tablet",
    strength: "500mg",
    generic: "Paracetamol + Caffeine",
    description: "Fast relief from headache and fever.",
  },
  {
    _id: "2",
    name: "Seclo",
    company: "Square Pharma",
    unit: "1 capsule",
    category: "Antibiotics",
    price: 20,
    originalPrice: 22,
    stock: 25,
    quantity: 2,
    image: "https://i.ibb.co/rH0fs2y/seclo.jpg",
    type: "Capsule",
    strength: "250mg",
    generic: "Acid reducer",
    description: "Used for acidity and stomach issues.",
  },
  // Add more demo data as needed
];

const ShopPage = () => {
  const [modalData, setModalData] = useState(null);
  const { addToCart } = useLocalStorageCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name"); // name or category
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc


  // Filtered & Sorted Medicines
  const filteredMedicines = demoMedicines
    .filter((med) => {
      const matchesName = med.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      return matchesName;
    })
    .sort((a, b) => {
      let fieldA = a[sortField].toLowerCase();
      let fieldB = b[sortField].toLowerCase();
      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 my-10">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">Shop Medicines</h1>

      {/* Search, Sort, Filter Controls */}
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

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="price">Price</option> {/* নতুন অপশন */}
        </select>
      </div>

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
            {filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No medicines found.
                </td>
              </tr>
            ) : (
              filteredMedicines.map((med) => (
                <tr key={med._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-14 h-14 object-cover rounded shadow"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {med.name}
                  </td>
                  <td className="px-4 py-3">{med.company}</td>
                  <td className="px-4 py-3">{med.unit}</td>
                  <td className="px-4 py-3">{med.category}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    ৳{med.price}
                  </td>
                  <td className="px-4 py-3">{med.stock}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setModalData(med)}
                      title="View Details"
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                      <FaEye />
                    </button>
                    <button
                      disabled={med.stock === 0}
                      onClick={() => addToCart(med)}
                      title={med.stock === 0 ? "Out of stock" : "Add to cart"}
                      className={`p-2 rounded text-white ${
                        med.stock === 0
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
              alt={modalData.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{modalData.name}</h2>
            <p className="mb-2 text-gray-700">{modalData.description}</p>
            <p>
              <strong>Company:</strong> {modalData.company}
            </p>
            <p>
              <strong>Unit:</strong> {modalData.unit}
            </p>
            <p>
              <strong>Category:</strong> {modalData.category}
            </p>
            <p>
              <strong>Price:</strong> ৳{modalData.price}
            </p>
            <p>
              <strong>Stock:</strong> {modalData.stock}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
