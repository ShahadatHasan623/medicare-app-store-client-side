import React from "react";
import { FaLightbulb, FaArrowRight } from "react-icons/fa";

const sampleArticles = [
  {
    id: 1,
    title: "How to Maintain a Healthy Diet",
    summary:
      "Discover simple tips to keep your diet balanced and nutritious for a healthier lifestyle.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
    url: "#",
  },
  {
    id: 2,
    title: "The Importance of Regular Exercise",
    summary:
      "Learn why exercising regularly can improve your overall health and wellbeing.",
    image:
      "https://i.ibb.co/Swkw2pG2/n-Nir91l-Ji-X.jpg",
    url: "#",
  },
  {
    id: 3,
    title: "Tips to Boost Your Immunity",
    summary:
      "Simple lifestyle changes and foods that help strengthen your immune system naturally.",
    image:
      "https://i.ibb.co/5h16SGcR/boosting-your-immune-system-s.jpg",
    url: "#",
  },
];

export default function HealthTips() {
  return (
    <section
      className="py-16  px-6 bg-[var(--color-bg)] rounded-xl shadow-lg max-w-7xl mx-auto my-12"
      style={{ color: "var(--color-text)" }}
    >
      <h2
        className="text-4xl font-extrabold mb-12 text-center tracking-tight flex items-center justify-center gap-3"
        style={{ color: "var(--color-primary)" }}
      >
        <FaLightbulb className="text-[var(--color-secondary)]" size={36} />
        Health Tips & Articles
      </h2>

      <div className="grid gap-10 md:grid-cols-3">
        {sampleArticles.map(({ id, title, summary, image, url }) => (
          <article
            key={id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-[1.03] hover:shadow-xl cursor-pointer flex flex-col"
            onClick={() => window.open(url, "_blank")}
            role="link"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && window.open(url, "_blank")}
          >
            <div className="h-46 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3
                className="text-2xl font-semibold mb-3 leading-snug flex items-center gap-2"
                style={{ color: "var(--color-primary)" }}
              >
                {title}
                <FaLightbulb className="text-[var(--color-secondary)]" />
              </h3>
              <p className="text-[var(--color-text)] flex-grow">{summary}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, "_blank");
                }}
                className="mt-6 self-start bg-[var(--color-secondary)] text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600 transition flex items-center gap-2"
                aria-label={`Read more about ${title}`}
              >
                Read More <FaArrowRight />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
