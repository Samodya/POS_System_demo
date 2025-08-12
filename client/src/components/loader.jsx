// components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center p-4">
        {/* Spinner */}
        <div className="w-20 h-20 rounded-full p-[4px] bg-gradient-to-r from-black via-blue-700 to-blue-500 animate-spin">
          <div className="w-full h-full rounded-full bg-white"></div>
        </div>{" "}
        {/* Text */}
        <p className="text-2xl font-bold bg-gradient-to-r from-black via-blue-700 to-blue-500 bg-clip-text text-transparent">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
