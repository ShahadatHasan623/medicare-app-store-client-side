import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios';
import { useCart } from '../../../utils/CartContext';

export default function Promotions({ category = "" }) {
  const axios = useAxios();
  const { addToCart } = useCart();

  // Fetch promotions data
  const { data: promotions = [], isLoading, error } = useQuery({
    queryKey: ['promotions', category],
    queryFn: async () => {
      let url = '/categories/promotions/all';
      if (category) url += `?category=${category}`;
      const res = await axios.get(url);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  // Add to cart logic based on discount
  const handleAddToCart = (item) => {
    const cartItem = {
      ...item,
      price: item.discountPrice || item.price, // use discount price if available
      offerType: item.discountPrice ? "Discount" : undefined, // only add if discounted
    };
    addToCart(cartItem);
  };

  if (isLoading)
    return (
      <p className="text-center py-20 text-lg text-[var(--color-muted)] animate-pulse">
        Loading Promotions...
      </p>
    );

  if (error)
    return (
      <p className="text-center py-20 text-lg text-[var(--color-error)]">
        Failed to load promotions!
      </p>
    );

  return (
    <section data-aos="fade-up"
     data-aos-anchor-placement="top-center">
      <div className="max-w-7xl mx-auto px-5 lg:px-0">
        <h2 className="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
          🎉 Promotions & Discounts
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {promotions.map((item) => (
            <div
              key={item._id}
              className="relative bg-[var(--color-surface)] rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 px-4 py-4 flex flex-col justify-between border border-[var(--color-border)]"
            >
              {/* Only show Discount badge if discountPrice exists */}
              {item.discountPrice && (
                <span className="absolute top-3 left-3 inline-block px-3 py-1 text-xs rounded-full bg-[var(--color-warning)] text-[var(--color-text)] font-semibold uppercase tracking-wide z-10">
                  Discount
                </span>
              )}

              <div className="overflow-hidden rounded-xl mb-4">
                <img
                  src={item.image || 'https://i.ibb.co/default-category.png'}
                  alt={item.name}
                  className="w-full h-30 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2 text-wrap">
                {item.name}
              </h3>

              <div className="mb-4">
                {item.discountPrice ? (
                  <>
                    <p className="text-[var(--color-muted)] line-through text-sm">
                      ${item.price}
                    </p>
                    <p className="text-[var(--color-primary)] font-bold text-lg">
                      ${item.discountPrice}
                    </p>
                  </>
                ) : (
                  <p className="text-[var(--color-primary)] font-bold text-lg">
                    ${item.price}
                  </p>
                )}
              </div>

              <button
                className="mt-4 w-full py-2 bg-[var(--color-primary)] text-[var(--navbar-text)] font-semibold rounded-lg shadow-md hover:bg-[var(--navbar-hover)] transition-colors duration-300"
                onClick={() => handleAddToCart(item)}
              >
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
