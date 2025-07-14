import React, { useEffect, useState } from "react";
import axios from "axios";

const Shop = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/medicines")
      .then(res => {
        setMedicines(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching medicines:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading medicines...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Medicines</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Generic Name</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Company</th>
            <th className="border border-gray-300 p-2">Price (per unit)</th>
            <th className="border border-gray-300 p-2">Discount (%)</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(med => (
            <tr key={med._id}>
              <td className="border border-gray-300 p-2">{med.itemName}</td>
              <td className="border border-gray-300 p-2">{med.genericName}</td>
              <td className="border border-gray-300 p-2">{med.category}</td>
              <td className="border border-gray-300 p-2">{med.company}</td>
              <td className="border border-gray-300 p-2">${med.pricePerUnit}</td>
              <td className="border border-gray-300 p-2">{med.discount || 0}</td>
              <td className="border border-gray-300 p-2">
                <button className="btn btn-sm btn-info mr-2" onClick={() => alert(`View details of ${med.itemName}`)}>View</button>
                <button className="btn btn-sm btn-primary" onClick={() => alert(`Selected ${med.itemName}`)}>Select</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shop;
