import React from "react";
import medicareLogo from "../../assets/medicarelogo.png";
import { Link } from "react-router";

const MedicareLogo = ({ compact = false }) => {
  return (
    <Link
      to="/"
      aria-label="MediCare — Go to homepage"
      className="group flex select-none items-center gap-2.5 p-1"
    >
      {/* 🖼️ Logo icon — gradient glow ring + hover tilt */}
      <div className="relative shrink-0">
        {/* পেছনের glow — hover এ জ্বলে ওঠে */}
        <div className="absolute inset-0 rounded-2xl bg-emerald-400/40 blur-md transition-all duration-500 group-hover:bg-emerald-400/70" />

        {/* Gradient ring + image */}
        <div className="relative rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/25 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
          <div className="h-10 w-10 overflow-hidden rounded-[14px] bg-white">
            <img
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={medicareLogo}
              alt="MediCare Logo"
            />
          </div>
        </div>

        {/* 🟢 Live dot — active feel */}
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--color-primary)]" />
        </span>
      </div>

      {/* 🔤 Brand text — gradient + hover shimmer */}
      <h1
        className={`hidden font-poppins font-black leading-none tracking-tight text-white md:block ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent transition-all duration-300 group-hover:from-emerald-200 group-hover:to-cyan-200">
          Medi
        </span>
        <span className="relative text-white">
          Care
          {/* 🎯 Animated underline — hover এ স্লাইড করে আসে */}
          <span className="absolute -bottom-1 left-0 h-[2.5px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
        </span>
      </h1>
    </Link>
  );
};

export default MedicareLogo;