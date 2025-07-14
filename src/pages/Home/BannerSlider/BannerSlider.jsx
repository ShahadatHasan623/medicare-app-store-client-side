import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";

const demoData = [
  {
    _id: "1",
    name: "Napa Extra",
    description: "Fast relief from headache and fever.",
    price: 10,
    originalPrice: 20,
    image: "https://i.ibb.co/N3YqGhC/napa-extra.jpg",
  },
  {
    _id: "2",
    name: "Seclo",
    description: "Used for acidity and stomach issues.",
    price: 20,
    originalPrice: 35,
    image: "https://i.ibb.co/rH0fs2y/seclo.jpg",
  },
];

const BannerSlider = () => {
  const handleViewDetails = (product) => {
    console.log("View Details:", product);
  };

  const handleAddToCart = (product) => {
    console.log("Added to Cart:", product);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="rounded-xl"
      >
        {demoData.map((product) => {
          const savedAmount = product.originalPrice - product.price;

          return (
            <SwiperSlide key={product._id}>
              <div
                className="relative w-full h-[500px] rounded-xl overflow-hidden"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {/* Save ৳ Sticker */}
                {savedAmount > 0 && (
                  <div className="absolute top-4 left-4 z-20 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
                    Save ৳{savedAmount}
                  </div>
                )}

                {/* Left Content Overlay */}
                <div className="absolute top-0 left-0 z-20 flex flex-col justify-center h-full px-8 md:px-16 max-w-lg text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {product.name}
                  </h2>
                  <p className="text-lg md:text-xl mb-6 drop-shadow-md">
                    {product.description}
                  </p>
                  <p className="text-3xl font-semibold mb-8 drop-shadow-md">
                    Now ৳{product.price}{" "}
                    <span className="line-through text-gray-300 text-xl ml-3">
                      ৳{product.originalPrice}
                    </span>
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-shadow shadow-lg"
                    >
                      <FaInfoCircle /> View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full transition-shadow shadow-lg"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
