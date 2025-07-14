import { useParams } from "react-router";
import { useState } from "react";
import { FaEye, FaCartPlus } from "react-icons/fa";

const demoMedicines = [
  {
    _id: "1",
    name: "Napa Extra",
    company: "Beximco Pharma",
    unit: "1 strip",
    category: "Pain Relief",
    price: 10,
    stock: 50,
    image: "https://i.ibb.co/N3YqGhC/napa-extra.jpg",
  },
  {
    _id: "2",
    name: "Ace 500",
    company: "ACI Limited",
    unit: "1 strip",
    category: "Pain Relief",
    price: 8,
    stock: 30,
    image: "https://i.ibb.co/3Tm7pyF/ace.jpg",
  },
  {
    _id: "3",
    name: "Seclo",
    company: "Square Pharma",
    unit: "1 capsule",
    category: "Antibiotics",
    price: 20,
    stock: 25,
    image: "https://i.ibb.co/rH0fs2y/seclo.jpg",
  },
  {
    _id: "4",
    name: "Maxpro",
    company: "Opsonin",
    unit: "1 capsule",
    category: "Antibiotics",
    price: 22,
    stock: 0,
    image: "https://i.ibb.co/TWbKk1z/maxpro.jpg",
  },
  {
    _id: "5",
    name: "Ceevit",
    company: "Square Pharma",
    unit: "1 tablet",
    category: "Vitamins",
    price: 12,
    stock: 40,
    image: "https://i.ibb.co/hgTN1KR/ceevit.jpg",
  },
  {
    _id: "6",
    name: "Rupa Vitamin C",
    company: "Renata",
    unit: "1 tablet",
    category: "Vitamins",
    price: 15,
    stock: 80,
    image: "https://i.ibb.co/mS44sYw/vitamin-c.jpg",
  },
  {
    _id: "7",
    name: "Orsaline-N",
    company: "SMC",
    unit: "1 sachet",
    category: "Digestive",
    price: 5,
    stock: 100,
    image: "https://i.ibb.co/qF6p0Bz/orsaline.jpg",
  },
  {
    _id: "8",
    name: "Eno Lemon",
    company: "GSK",
    unit: "1 bottle",
    category: "Digestive",
    price: 18,
    stock: 65,
    image: "https://i.ibb.co/yhkbp1W/eno.jpg",
  },
  {
    _id: "9",
    name: "Bepanthen",
    company: "Bayer",
    unit: "1 tube",
    category: "Skin Care",
    price: 35,
    stock: 10,
    image: "https://i.ibb.co/wMTh3PX/bepanthen.jpg",
  },
  {
    _id: "10",
    name: "Baby Derma Cream",
    company: "Himalaya",
    unit: "1 tube",
    category: "Baby Care",
    price: 28,
    stock: 5,
    image: "https://i.ibb.co/Bzt3T3c/baby-cream.jpg",
  },
];

const CategoryDetails = () => {
  const { name } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredMedicines = demoMedicines
    .filter(
      (med) => med.category.toLowerCase() === name.toLowerCase()
    )
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
        Category: {name}
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
        <p className="text-red-500">No matching medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md text-sm md:text-base">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Category</th>
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
                  <td className="px-4 py-3">{med.category}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">৳{med.price}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      title="View"
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                      <FaEye />
                    </button>
                    <button
                      title="Add to Cart"
                      disabled={med.stock === 0}
                      className={`p-2 rounded text-white ${
                        med.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onClick={() => alert(`Added ${med.name} to cart`)}
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
    </div>
  );
};

export default CategoryDetails;
