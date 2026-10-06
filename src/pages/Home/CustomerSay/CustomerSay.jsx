import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaArrowLeft, FaArrowRight, FaStar, FaStarHalfAlt, FaRegStar,
  FaQuoteLeft, FaCheckCircle, FaCommentDots,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

/* 🗣️ Testimonials Data */
const testimonials = [
  {
    name: "Sarah Khan",
    title: "Regular Customer",
    review:
      "I always order my medicines from here. Delivery is fast and the products are 100% genuine. Highly satisfied!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.5,
  },
  {
    name: "Rafiq Ahmed",
    title: "Entrepreneur",
    review:
      "Great service! The ordering process is easy, and I got my medicines the same day. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
  },
  {
    name: "Fatima Noor",
    title: "Mother",
    review:
      "Affordable prices and excellent customer support. I trust this platform for my family's medicines.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 4,
  },
  {
    name: "Tanvir Hasan",
    title: "Software Engineer",
    review:
      "I loved the smooth checkout process and quick delivery. The medicines were properly packaged.",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 4.5,
  },
];

/* ⭐ Rating Stars — half-star support */
const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="text-amber-400" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-slate-300 dark:text-slate-600" />);
    }
  }
  return <div className="flex justify-center gap-1">{stars}</div>;
};

const CustomerSay = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  const settings = {
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    infinite: true,
    speed: 600,
    arrows: false,
    dots: false, // custom dots niche banabo
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes quote-pulse {
          0%, 100% { opacity: .15; transform: scale(1); }
          50%      { opacity: .25; transform: scale(1.05); }
        }
        .animate-fade-up   { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-quote-pulse { animation: quote-pulse 4s ease-in-out infinite; }
      `}</style>

      <section
        className="relative mx-auto my-20 max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-50/80 via-transparent to-cyan-50/80 px-4 py-12 transition-colors duration-300 sm:px-6 dark:from-emerald-950/20 dark:via-transparent dark:to-cyan-950/20"
        data-aos="zoom-out-right"
        aria-label="Customer testimonials"
      >
        {/* 🌫️ Background decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        {/* 🔤 Giant faded quote — background e */}
        <FaQuoteLeft className="animate-quote-pulse pointer-events-none absolute left-8 top-16 text-8xl text-emerald-500/10 sm:text-9xl" />

        {/* ================= 📝 Header ================= */}
        <div className="animate-fade-up relative mb-12 flex flex-col items-center gap-3 text-center">
          <h2 className="flex flex-wrap items-center justify-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
              <FaCommentDots className="text-lg" />
            </span>
            <span style={{ color: "var(--color-primary)" }}>
              {t("testimonialsHeading")}
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-transparent to-emerald-500" />
            <p className="max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
              {t("testimonialsSubtitle")}
            </p>
            <span className="h-[3px] w-10 rounded-full bg-gradient-to-l from-transparent to-emerald-500" />
          </div>
        </div>

        {/* ================= 🎠 Slider ================= */}
        <div className="relative mx-auto max-w-7xl">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((item, index) => (
              <div key={index} className="px-3 sm:px-4">
                <div
                  className={`relative flex h-auto min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl border bg-[var(--color-surface)] p-6 text-center shadow-lg shadow-black/5 transition-all duration-500 sm:min-h-[280px] sm:p-7 ${
                    index === currentSlide
                      ? "scale-100 border-emerald-400/40 opacity-100 shadow-emerald-900/15"
                      : "scale-90 border-[var(--color-border)] opacity-50"
                  }`}
                >
                  {/* Top gradient line — active card e */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 origin-left bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-transform duration-500 ${
                      index === currentSlide ? "scale-x-100" : "scale-x-0"
                    }`}
                  />

                  {/* 💬 Quote icon */}
                  <FaQuoteLeft className="absolute right-5 top-5 text-2xl text-emerald-500/15" />

                  {/* ⭐ Rating + number */}
                  <div>
                    <RatingStars rating={item.rating} />
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                      {item.rating.toFixed(1)} / 5.0
                    </p>
                  </div>

                  {/* 📝 Review */}
                  <p className="my-5 flex-1 text-sm italic leading-relaxed text-[var(--color-text)]">
                    “{item.review}”
                  </p>

                  {/* 👤 Author */}
                  <div className="mt-auto flex flex-col items-center gap-2.5">
                    {/* Avatar — gradient ring */}
                    <div className="rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[2.5px] shadow-lg shadow-emerald-500/25">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-full border-2 border-[var(--color-surface)] object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="flex items-center justify-center gap-1.5 text-sm font-black text-[var(--color-text)]">
                        {item.name}
                        {/* ✅ Verified badge */}
                        <span
                          className="text-emerald-500"
                          title={t("verifiedBuyer")}
                        >
                          <FaCheckCircle className="text-xs" />
                        </span>
                      </h4>
                      <p className="text-xs text-[var(--color-muted)]">{item.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* ================= 🎮 Controls ================= */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => sliderRef.current.slickPrev()}
              className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] shadow-lg ring-1 ring-[var(--color-border)] transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:text-white hover:ring-emerald-400 active:scale-95"
              aria-label="Previous testimonial"
            >
              <FaArrowLeft className="text-sm" />
            </button>

            {/* 🎯 Custom dots — pill style */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => sliderRef.current.slickGoTo(i)}
                  className={`h-2 rounded-full transition-all duration-400 ${
                    i === currentSlide
                      ? "w-8 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/40"
                      : "w-2 bg-slate-300 hover:bg-emerald-400 dark:bg-slate-600"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => sliderRef.current.slickNext()}
              className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] shadow-lg ring-1 ring-[var(--color-border)] transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:text-white hover:ring-emerald-400 active:scale-95"
              aria-label="Next testimonial"
            >
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerSay;