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
      className="cursor-pointer w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all transform hover:-translate-y-3 duration-500 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200"
    >
      {/* Image Section */}
      <div className="relative h-44 overflow-hidden group">
        <img
          src={category.image || "https://i.ibb.co/default-category.png"}
          alt={category.categoryName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition duration-500" />

        {/* Top-left Icon */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md rounded-full p-2 shadow-md">
          <FaClinicMedical className="text-green-600" size={22} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col items-center space-y-3">
        <h3 className="text-xl md:text-2xl font-bold capitalize text-gray-900 text-center flex items-center gap-2">
          <FaPills className="text-green-500" />
          <span>{category.categoryName}</span>
        </h3>

        <p className="text-gray-500 font-medium flex items-center gap-2">
          <FaCapsules className="text-gray-400" />
          <span>
            {category.medicineCount}{" "}
            {category.medicineCount > 1 ? "Medicines" : "Medicine"}
          </span>
        </p>

        {/* Call to action */}
        <button className="mt-3 px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow hover:from-green-600 hover:to-emerald-700 transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
