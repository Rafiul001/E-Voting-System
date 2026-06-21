import React from "react";
import { useNavigate } from "react-router";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-center px-4">
      {/* Neon 404 Text */}
      <h1 className="text-[8rem] md:text-[12rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-600 animate-pulse drop-shadow-[0_0_20px_cyan]">
        404
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-lg md:text-2xl text-gray-200">
        Oops! The page you are looking for doesn’t exist.
      </p>

      {/* Go Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-8 py-3 bg-linear-to-r from-cyan-500 to-purple-600 text-white rounded-lg shadow-lg hover:opacity-90 transition font-semibold"
      >
        Go Back Home
      </button>

      {/* Optional Neon Border / Accent */}
    </div>
  );
};

export default NotFound;
