import useAxioseSecure from "../../hooks/useAxioseSecure";
import CategoryCard from "./CategoryCard";
import { useQuery } from "@tanstack/react-query";


const Categories = () => {
  const axioseSecure =useAxioseSecure()

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axioseSecure.get("/categories");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading categories...</p>;
  if (error) return <p className="text-red-500">Failed to load categories</p>;

  return (
    <section className="max-w-7xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Browse by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {categories.slice(0, 6).map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
