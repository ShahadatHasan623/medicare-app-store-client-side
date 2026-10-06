import React from "react";
import DigitalClock from "./DigitalClock";

const TopBar = () => {
  return (
    <div
      className="w-full flex justify-end items-center px-4 py-1 select-none"
      style={{
        fontFamily: "monospace",
        backgroundColor: "#1A202C", 
        color: "#F7FAFC", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <DigitalClock />
    </div>
  );
};

export default TopBar;
