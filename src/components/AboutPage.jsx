import React from "react";
import { FaUserMd, FaShippingFast, FaShieldAlt } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-16 md:py-24">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mb-4">
          About Our Pharmacy
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-muted)]">
          Trusted healthcare platform providing genuine medicines and fast delivery across the country.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Feature 1 */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition">
          <FaUserMd className="text-[var(--color-primary)] text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Certified Pharmacists</h3>
          <p className="text-[var(--color-muted)]">
            Our team of licensed pharmacists ensures every medicine you buy is safe and genuine.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition">
          <FaShippingFast className="text-[var(--color-primary)] text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-[var(--color-muted)]">
            We ensure your orders reach you quickly, safely, and in perfect condition.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition">
          <FaShieldAlt className="text-[var(--color-primary)] text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Quality & Safety</h3>
          <p className="text-[var(--color-muted)]">
            Every product is checked for quality and authenticity, giving you peace of mind.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] text-center mb-8">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Dr. Sarah Khan", role: "Chief Pharmacist", img: "https://randomuser.me/api/portraits/women/68.jpg" },
            { name: "Rafiq Ahmed", role: "Operations Manager", img: "https://randomuser.me/api/portraits/men/45.jpg" },
            { name: "Fatima Noor", role: "Customer Support", img: "https://randomuser.me/api/portraits/women/32.jpg" },
            { name: "Tanvir Hasan", role: "Delivery Head", img: "https://randomuser.me/api/portraits/men/33.jpg" },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-[var(--color-surface)] rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 object-cover rounded-full mb-4 border-2 border-[var(--color-primary)]"
              />
              <h4 className="font-semibold text-lg">{member.name}</h4>
              <p className="text-[var(--color-muted)] text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-6xl mx-auto text-center bg-[var(--color-primary)] text-white rounded-3xl p-12 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Your Health Journey Today
        </h2>
        <p className="text-lg mb-6">
          Browse our medicines and experience a seamless shopping experience.
        </p>
        <a
          href="/shop"
          className="inline-block bg-white text-[var(--color-primary)] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Shop Now
        </a>
      </section>
    </div>
  );
}
