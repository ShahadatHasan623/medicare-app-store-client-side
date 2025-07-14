import React, { useState } from "react";
import { FaEye, FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useLocalStorageCart } from "../../utils/useLocalStorageCart";

const demoMedicines =  [
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
    generic: "Paracetamol + Caffeine"
  },
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
    generic: "Paracetamol + Caffeine"
  },
  
  

  
];

const ShopPage = () => {
  const [modalData, setModalData] = useState(null);
  const { addToCart } = useLocalStorageCart();
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">Shop Medicines</h1>

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
            {demoMedicines.map((med) => (
              <tr key={med._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={med.image}
                    alt={med.name}
                    className="w-14 h-14 object-cover rounded shadow"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{med.name}</td>
                <td className="px-4 py-3">{med.company}</td>
                <td className="px-4 py-3">{med.unit}</td>
                <td className="px-4 py-3">{med.category}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">৳{med.price}</td>
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
            ))}
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
            <p><strong>Company:</strong> {modalData.company}</p>
            <p><strong>Unit:</strong> {modalData.unit}</p>
            <p><strong>Category:</strong> {modalData.category}</p>
            <p><strong>Price:</strong> ৳{modalData.price}</p>
            <p><strong>Stock:</strong> {modalData.stock}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
