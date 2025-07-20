import React from "react";
import { useNavigate } from "react-router";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/categories/${category._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border rounded-lg shadow hover:shadow-xl p-4 flex flex-col items-center space-y-3 transition-transform transform hover:-translate-y-1 duration-200"
    >
      <img
        src={category.image || "https://i.ibb.co/default-category.png"}
        alt={category.categoryName}
        className="w-32 h-32 object-contain rounded bg-gray-100"
      />
      <h3 className="text-xl font-semibold capitalize">
        {category.categoryName}
      </h3>
      <p className="text-gray-600">
        {category.medicineCount} {category.medicineCount > 1 ? "Medicines" : "Medicine"}
      </p>
    </div>
  );
};

export default CategoryCard;
