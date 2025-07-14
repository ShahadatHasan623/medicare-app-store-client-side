import { useNavigate } from "react-router";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-all p-4 flex flex-col items-center text-center"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-24 h-24 object-cover mb-4 rounded-full border"
      />
      <h3 className="text-xl font-semibold">{category.name}</h3>
      <p className="text-gray-500 text-sm">
        {category.medicineCount} Medicines
      </p>
    </div>
  );
};

export default CategoryCard;
