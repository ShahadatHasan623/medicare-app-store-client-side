import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import CategoryCard from "./CategoryCard";
import Loader from "../../components/Loader";

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
    return <Loader></Loader>;

  if (error)
    return (
      <p className="text-center text-lg text-red-600 font-semibold py-12">
        ❌ Failed to load categories
      </p>
    );

  return (
    <section
      className="max-w-7xl mx-auto my-20 px-5 sm:px-8 lg:px-0"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Browse categories"
    >
      <h2
        className="text-5xl font-extrabold text-center mb-16 tracking-wide"
        style={{ color: "var(--color-primary)" }}
      >
        Browse by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {categories.slice(0, 6).map((category) => (
          <div
            key={category._id}
            onClick={() => navigate(`/categories/${category._id}`)}
            className="cursor-pointer rounded-3xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-shadow duration-500 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-secondary)]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/categories/${category._id}`);
              }
            }}
            aria-label={`View category ${category.categoryName}`}
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
