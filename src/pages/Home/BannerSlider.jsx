import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const BannerSlider = () => {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const res = await axios.get("/advertisements");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading banners...</p>;

  return (
    <div className="px-4 mb-8">
      <h2 className="text-2xl font-bold text-center mb-4">Featured Advertisements</h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3000 }}
      >
        {ads.map((ad) => (
          <SwiperSlide key={ad._id}>
            <div className="w-full h-56 md:h-72 lg:h-80 bg-gray-100 rounded overflow-hidden shadow">
              <img
                src={ad.image}
                alt={ad.medicineName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-40 text-white p-4 w-full text-center">
                <h3 className="text-lg font-semibold">{ad.medicineName}</h3>
                <p>{ad.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
