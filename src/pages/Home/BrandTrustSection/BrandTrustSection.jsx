import React from "react";

const brands = [
  { name: "Pfizer", logo: "https://i.ibb.co.com/YFBYtpjL/Pfizer-Logo.png" },
  { name: "Johnson & Johnson", logo: "https://i.ibb.co.com/k2X7r8R6/JJ-Logo-Stacked-Red-RGB.webp" },
  { name: "Novartis", logo: "https://i.ibb.co.com/gFWvzfnX/D8-Jv-HC8-Wq-Tql-Ejox4-Zi434-NJ8v-Alr-G.png" },
  { name: "GSK", logo: "https://i.ibb.co.com/fG4mWZrV/GSK-logo.png" },
];

const certifications = [
  { name: "FDA Approved", logo: "https://i.ibb.co.com/zTbQJt9D/fda-approved-label-fda-validated-quality-and-safety-assurance-png.webp" },
  { name: "GMP Certified", logo: "https://i.ibb.co.com/cXbmg7ss/Certified-GMP-Logo-PNG-Transparent-Image.png" },
  { name: "ISO 9001", logo: "https://i.ibb.co.com/8LgKLnVD/261-2610411-free-consultancy-for-selecting-right-rudraksha-iso-9001.png" },
];

export default function BrandTrustSection() {
  return (
    <section data-aos="zoom-in-left">
      <div className="max-w-7xl mx-auto px-5 my-20 lg:px-0">
        <h2 className="text-[2.618rem] font-extrabold mb-[3.618rem] text-center text-[var(--color-primary)]">
          Trusted Brands & Certifications
        </h2>

        {/* Brand Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[3.618rem] items-center justify-items-center mb-[5.236rem]">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-4 rounded-xl bg-[var(--color-surface)] shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-16 sm:h-20 md:h-24 object-contain"
              />
            </div>
          ))}
        </div>

        {/* Certifications */}
        <h3 className="text-[1.618rem] font-semibold mb-[2.618rem] text-center text-[var(--color-text)]">
          Certifications & Trust Badges
        </h3>
        <div className="flex flex-wrap justify-center gap-[2.618rem]">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col items-center p-4 w-36 bg-[var(--color-surface)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={cert.logo}
                alt={cert.name}
                className="h-16 w-16 mb-3 object-contain"
              />
              <p className="text-[var(--color-muted)] font-medium text-sm text-center">
                {cert.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
