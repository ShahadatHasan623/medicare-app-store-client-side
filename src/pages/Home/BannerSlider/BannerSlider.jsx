import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";
import {
  FaArrowRight, FaChevronLeft, FaChevronRight, FaPills,
  FaExclamationTriangle, FaRedo, FaImages, FaTag, FaPercent,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const BannerSlider = () => {
  const axiosSecure = useAxios();
  const { t } = useTranslation();

  const {
    data: sliderData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["slider-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertisements/slider");
      return res.data;
    },
  });

  /* 💀 Skeleton — banner shape */
  if (isLoading)
    return (
      <div className="mx-auto w-full">
        <div className="relative h-[420px] w-full animate-pulse overflow-hidden bg-slate-300/40 md:h-[540px]">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 via-transparent to-slate-400/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="h-5 w-40 rounded-full bg-slate-400/40" />
            <div className="h-12 w-80 rounded-2xl bg-slate-400/50" />
            <div className="h-4 w-64 rounded-full bg-slate-400/30" />
            <div className="mt-2 h-12 w-44 rounded-full bg-slate-400/40" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
          <FaExclamationTriangle className="text-xl" />
        </span>
        <p className="text-lg font-bold text-rose-600">{t("bannerLoadError")}</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
        >
          <FaRedo className="text-xs" /> {t("retry")}
        </button>
      </div>
    );

  if (sliderData.length === 0)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
          <FaImages className="text-xl" />
        </span>
        <p className="font-semibold text-[var(--color-muted)]">{t("noBanners")}</p>
      </div>
    );

  return (
    <div className="group/slider relative mx-auto w-full">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-custom-bullet",
          bulletActiveClass: "swiper-custom-bullet-active",
        }}
        navigation={{
          nextEl: ".banner-next",
          prevEl: ".banner-prev",
        }}
        loop={sliderData.length > 2}
        speed={900}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="banner-swiper"
      >
        {sliderData.map((product) => (
          <SwiperSlide key={product._id}>
            <div
              className="relative h-[420px] w-full overflow-hidden md:h-[560px]"
              style={{
                backgroundImage: `url(${product.medicineImage || "/default-banner.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* 🌗 Multi-layer gradient overlay — left side dark for text */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/10" />
              {/* Bottom fade — pagination er sathe blend */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 to-transparent" />

              {/* 📝 Content — left aligned, animated */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-7xl px-6 sm:px-12 lg:px-20">
                  <div className="max-w-2xl">
                    {/* 🏷️ Featured badge */}
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 ring-1 ring-emerald-400/40 backdrop-blur sm:text-xs">
                      <FaPills className="text-[10px]" />
                      {t("featuredProduct")}
                    </span>

                    {/* Medicine name */}
                    <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white drop-shadow-2xl sm:text-4xl md:text-6xl">
                      {product.medicineName}
                    </h2>

                    {/* Description */}
                    <p className="mb-7 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80 drop-shadow-md sm:text-base md:text-lg">
                      {product.description || t("descriptionNA")}
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to="/shop"
                        className="group/btn inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/60 active:scale-95"
                      >
                        {t("shopNow")}
                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>

                      {/* Discount badge (jodi ache) */}
                      {product.discount > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-3.5 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur">
                          <FaPercent className="text-xs text-amber-400" />
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ◀️ Custom navigation arrows — hover e dekhabe (mobile e always) */}
      <button
        className="banner-prev absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:ring-emerald-400 active:scale-95 md:opacity-0 md:group-hover/slider:opacity-100"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-sm" />
      </button>
      <button
        className="banner-next absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:ring-emerald-400 active:scale-95 md:opacity-0 md:group-hover/slider:opacity-100"
        aria-label="Next slide"
      >
        <FaChevronRight className="text-sm" />
      </button>

      {/* 🎨 Custom pagination bullets */}
      <style>{`
        .swiper-custom-bullet {
          width: 22px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.35);
          transition: all .4s ease;
          cursor: pointer;
        }
        .swiper-custom-bullet-active {
          width: 42px;
          background: linear-gradient(90deg, #34d399, #2dd4bf);
          box-shadow: 0 0 12px rgba(52, 211, 153, .6);
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;  