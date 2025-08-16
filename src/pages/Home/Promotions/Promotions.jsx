import React from "react";

// Dummy promotion data
const promotions = [
  {
    id: 1,
    title: "Buy 2 get 1 free on vitamins",
    description: "Applicable on all vitamin products",
    image: "https://i.ibb.co/YTQBFBKx/nicolas-solerieu-v-Hbw2pf8nbw-unsplash.jpg",
  },
  {
    id: 2,
    title: "20% off on Pain Relievers",
    description: "Limited time discount",
    image: "https://i.ibb.co/JJ38GLQ/towfiqu-barbhuiya-ss-Z6x-ga-O0c-unsplash.jpg",
  },
  {
    id: 3,
    title: "Seasonal Sale on Supplements",
    description: "Grab your supplements now",
    image: "https://i.ibb.co/F4qNG3qT/supliful-supplements-on-demand-UTPZnn-EVW4-E-unsplash.jpg",
  },
  {
    id: 4,
    title: "Exclusive Health Bundles",
    description: "Special combo offers for your wellness",
    image: "https://i.ibb.co.com/S4tVzVFx/elsa-olofsson-6-Iq2-T0-DN7ds-unsplash.jpg",
  },
];

export default function Promotions() {
  return (
    <section className="my-20 max-w-7xl mx-auto px-4 bg-[var(--color-bg)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text)]">
        Sales & Promotions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-[var(--color-surface)] shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition duration-300 border border-[var(--color-border)]"
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-[var(--color-primary)]">
                {promo.title}
              </h3>
              <p className="text-[var(--color-muted)] text-sm">{promo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
