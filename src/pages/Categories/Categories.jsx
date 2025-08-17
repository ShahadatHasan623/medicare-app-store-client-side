import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import CategoryCard from "./CategoryCard";
import Loader from "../../components/Loader";
import { FaArrowRight } from "react-icons/fa";

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

  if (isLoading) return <Loader></Loader>;

  if (error)
    return (
      <p className="text-center text-lg text-red-600 font-semibold py-12">
        ❌ Failed to load categories
      </p>
    );

  return (
    <section
      className="max-w-7xl mx-auto my-20 lg:px-0 sm:px-8 px-5" data-aos="fade-right"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine"
      aria-label="Browse categories"
    >
      <div className="flex justify-between items-center mb-8">
        <h2
          className="text-2xl font-extrabold tracking-wide"
          style={{ color: "var(--color-primary)" }}
        >
          Explore by Category
        </h2>

        {/* ✅ Clickable View All with icon */}
        <div
          className="flex items-center gap-1 text-[var(--color-secondary)] font-semibold cursor-pointer hover:underline transition"
          onClick={() => navigate("/categories")}
        >
          <span>View All</span>
          <FaArrowRight />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-3 gap-5">
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
