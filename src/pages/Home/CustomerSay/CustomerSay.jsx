import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

// Testimonials Data
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
      "Affordable prices and excellent customer support. I trust this platform for my family’s medicines.",
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

// Rating Stars Component
const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
  }
  return <div className="flex justify-center mb-2">{stars}</div>;
};

const CustomerSay = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    infinite: true,
    speed: 500,
    arrows: false,
    dots: true,
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
    <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6edf3] py-16 px-4 my-12 rounded-3xl shadow-lg max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-3 text-gray-800 drop-shadow-lg">
          🌟 What Our Customers Say
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We are trusted by thousands of happy customers for their healthcare needs.
        </p>
      </div>

      {/* Slider */}
      <div className="max-w-7xl mx-auto relative">
        <Slider ref={sliderRef} {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="px-4">
              <div
                className={`bg-white rounded-2xl shadow-xl p-8 h-72 flex flex-col justify-between text-center transition-all duration-500 transform ${
                  index === currentSlide
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-60"
                } hover:shadow-2xl hover:scale-105`}
              >
                {/* Rating Stars */}
                <RatingStars rating={item.rating} />

                <p className="text-gray-700 mb-4 text-sm leading-relaxed italic">
                  "{item.review}"
                </p>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-full border-2 border-green-500"
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Arrows */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => sliderRef.current.slickNext()}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transition"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSay;
