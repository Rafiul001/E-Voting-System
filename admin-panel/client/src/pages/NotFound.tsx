import React from "react";
import Container from "../components/ui/Container";
import { useNavigate } from "react-router";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-7xl font-extrabold text-gray-800">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-500 max-w-md">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-2xl border border-gray-400 text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
          >
            Home
          </button>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
