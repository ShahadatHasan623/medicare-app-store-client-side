import React from "react";
import { useNavigate } from "react-router";
import { FaPills, FaCapsules, FaClinicMedical } from "react-icons/fa";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/categories/${category._id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      aria-label={`View medicines in ${category.categoryName} category`}
      className="cursor-pointer w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300 bg-white border border-gray-200"
    >
      {/* Image */}
      <div className="w-full h-56 relative overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={category.image || "https://i.ibb.co/default-category.png"}
          alt={category.categoryName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Overlay icon on top-left */}
        <div className="absolute top-3 left-3 bg-white bg-opacity-80 rounded-full p-2 shadow-md">
          <FaClinicMedical className="text-green-600" size={24} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col items-center space-y-3">
        <h3 className="text-2xl font-bold capitalize text-gray-900 text-center flex items-center space-x-2">
          <FaPills className="text-green-500" />
          <span>{category.categoryName}</span>
        </h3>

        <p className="text-gray-600 font-medium flex items-center space-x-2">
          <FaCapsules className="text-gray-400" />
          <span>
            {category.medicineCount}{" "}
            {category.medicineCount > 1 ? "Medicines" : "Medicine"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;
