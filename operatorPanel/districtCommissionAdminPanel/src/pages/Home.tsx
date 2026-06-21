import React from "react";
import { useNavigate } from "react-router";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      label: "Operators",
      href: "/operators",
      description: "Manage your operators efficiently.",
    },
    {
      label: "Machines",
      href: "/machines",
      description: "Track and control machines in real-time.",
    },
  ];

  return (
    <div className="min-h-full bg-transparent text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4 bg-linear-to-b from-[#0b0f19] via-[#0b0f19] to-[#111622]">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-600 animate-pulse drop-shadow-lg">
          Welcome to District Commission
        </h1>
        <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-2xl">
          Manage operators, machines, and analytics in a 
          blockchain-powered admin panel.
        </p>
        <button
          onClick={() => navigate("/operators")}
          className="mt-10 px-8 py-3 bg-linear-to-r from-cyan-500 to-purple-600 text-white rounded-lg shadow-lg hover:opacity-90 transition font-semibold"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="bg-[#111622] rounded-xl p-6 shadow-lg border border-gray-800 hover:shadow-cyan-500/50 transition cursor-pointer"
            onClick={() => navigate(feature.href)}
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 mb-2">
              {feature.label}
            </h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
