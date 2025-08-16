import React from "react";

const Loader = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]"
      role="status"
    >
      <div className="relative w-24 h-24">
        {/* Orbiting capsules */}
        <div className="absolute w-full h-full animate-spin-slow">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-4 h-8 bg-[var(--color-primary)] rounded-full shadow-md transform origin-center"
              style={{
                transform: `rotate(${i * 60}deg) translateX(40px)`,
              }}
            ></div>
          ))}
        </div>

        {/* Center subtle circle for depth */}
        <div className="absolute inset-8 rounded-full bg-[var(--color-bg)] shadow-inner"></div>
      </div>
    </div>
  );
};

export default Loader;
