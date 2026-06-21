import React from "react";

const Footer: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <footer
      className={`bg-[#0b0f19] text-gray-200 border-t border-gray-800 py-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* Footer Info */}
        <span>&copy; 2025 District Commission Voting Machine</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
