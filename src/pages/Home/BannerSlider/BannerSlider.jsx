import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import Loader from "../../../components/Loader"


const BannerSlider = () => {
  const axiosSecure = useAxios()

  const {
    data: sliderData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["slider-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertisements/slider");
      return res.data;
    },
  });


  if (isLoading)
    return <Loader></Loader> ;

  if (error)
    return (
      <p className="text-center text-red-500 py-10 font-semibold">
        Failed to load banners
      </p>
    );

  if (sliderData.length === 0)
    return (
      <p className="text-center py-10 text-gray-600 font-medium">
        No banners to display
      </p>
    );

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-0">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={sliderData.length > 2}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {sliderData.map((product) => (
          <SwiperSlide key={product._id}>
            <div
              className="relative w-full h-[400px] md:h-[500px] flow-hidden shadow-lg"
              style={{
                backgroundImage: `url(${
                  product.medicineImage || "/default-banner.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

              {/* Text Section */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                  {product.medicineName}
                </h2>
                <p className="text-sm md:text-lg drop-shadow-md opacity-90 max-w-2xl">
                  {product.description || "No description available."}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
