import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import CategoryCard from "./CategoryCard";

const Categories = () => {
  const Axios = useAxios();
  const navigate = useNavigate();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories-with-count"],
    queryFn: async () => {
      const res = await Axios.get("/categories/with-count");
      return res.data;
    },
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
        ❌ Failed to load categories
      </p>
    );

  return (
    <section className="max-w-7xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">
        Browse by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.slice(0, 6).map((category) => (
          <div
            key={category._id} // use _id for better uniqueness
            onClick={() => navigate(`/categories/${category._id}`)} // go to category details
            className="cursor-pointer"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
