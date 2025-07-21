import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/loading.json";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-32 h-32">
        <Lottie animationData={loaderAnimation} loop={true} />
      </div>
    </div>
  );
};

export default Loader;
