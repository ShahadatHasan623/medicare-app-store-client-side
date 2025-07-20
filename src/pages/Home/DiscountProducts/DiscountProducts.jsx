import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaCartPlus } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useAxios from "../../../hooks/useAxios";
import { useCart } from "../../../utils/CartContext";


const DiscountProducts = () => {
  const axiosInstance = useAxios();
  const { addToCart } = useCart();

  const fetchDiscountProducts = async () => {
    const { data } = await axiosInstance.get("/medicines/discounted");
    return data;
  };

  const { data: discountProducts = [], isLoading, isError, error } = useQuery({
    queryKey: ["discount-products"],
    queryFn: fetchDiscountProducts,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading)
    return (
      <p className="text-center py-20 text-lg font-semibold text-gray-600">
        Loading discount products...
      </p>
    );

  if (isError)
    return (
      <p className="text-center py-20 text-lg font-semibold text-red-600">
        Error: {error.message}
      </p>
    );

  if (discountProducts.length === 0)
    return (
      <p className="text-center py-20 text-lg font-semibold text-gray-600">
        No discount products available.
      </p>
    );

  return (
    <section
      className="my-10"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Discounted Products"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className="text-4xl font-extrabold text-center mb-12"
          style={{ color: "var(--color-primary)" }}
        >
          Discount Products
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          aria-live="polite"
        >
          {discountProducts.map((product) => {
            const discountedPrice = Math.round(
              product.price - (product.price * product.discount) / 100
            );

            return (
              <SwiperSlide key={product._id}>
                <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.03]">
                  <div className="relative overflow-hidden rounded-t-2xl h-56">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-4 left-4 bg-[var(--color-secondary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 select-none">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3
                      className="text-lg font-semibold mb-1 truncate"
                      title={product.name}
                      style={{ color: "var(--color-text)" }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm text-gray-500 mb-4 truncate"
                      title={product.company}
                    >
                      {product.company}
                    </p>

                    <div className="mb-6">
                      <span className="line-through text-gray-400 mr-3 text-base">
                        ৳{product.price}
                      </span>
                      <span
                        className="font-bold text-2xl"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ৳{discountedPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="mt-auto flex items-center justify-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-semibold text-base py-3 rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--color-secondary)]"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <FaCartPlus className="text-xl" />
                      Add to Cart
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default DiscountProducts;
