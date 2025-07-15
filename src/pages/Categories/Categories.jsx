import CategoryCard from "./CategoryCard";

const categories = [
  {
    name: "Pain Relief",
    image: "https://i.ibb.co/kcJ5tpg/pain.png",
    medicineCount: 12,
  },
  {
    name: "Antibiotics",
    image: "https://i.ibb.co/sbhc4gt/antibiotics.png",
    medicineCount: 20,
  },
  {
    name: "Vitamins",
    image: "https://i.ibb.co/QbBPVKk/vitamins.png",
    medicineCount: 15,
  },
  {
    name: "Skin Care",
    image: "https://i.ibb.co/y6zrrbV/skincare.png",
    medicineCount: 8,
  },
  {
    name: "Digestive",
    image: "https://i.ibb.co/Zz2jpRy/digestive.png",
    medicineCount: 10,
  },
  {
    name: "Baby Care",
    image: "https://i.ibb.co/qYspfxh/babycare.png",
    medicineCount: 7,
  },
];

const Categories = () => {
  return (
    <section className="max-w-7xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
         Browse by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
