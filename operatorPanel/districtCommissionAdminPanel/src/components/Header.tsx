import React, { useCallback, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router";

const Header: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);

  const navItems = [
    { label: "Operators", href: "/operators" },
    { label: "Machines", href: "/machines" },
  ];

  const handleLogOut = useCallback(() => {
    logout();
    navigate("/login");
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        className={`bg-[#0b0f19] backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-linear-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">DC</span>
                </div>
                <span className="hidden sm:block text-xl font-semibold text-white">
                  District Commission
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-200 hover:text-cyan-400 font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogOut}
                    className="bg-linear-to-r from-cyan-500 to-purple-500 text-white px-5 py-2.5 rounded-lg shadow-lg hover:opacity-90 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-gray-200 hover:text-white font-medium transition"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="bg-linear-to-r from-cyan-500 to-purple-500 text-white px-5 py-2.5 rounded-lg shadow-lg hover:opacity-90 transition"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-200 hover:bg-gray-800 transition"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu (Drawer) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0b0f19] shadow-2xl z-50 md:hidden flex flex-col border-r border-gray-800">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-linear-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">LM</span>
                </div>
                <span className="text-lg font-semibold text-white">
                  LogisticsManager
                </span>
              </a>

              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-gray-800 transition"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Drawer Navigation */}
            <nav className="flex-1 px-6 py-8 space-y-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-gray-200 hover:text-cyan-400 transition"
                >
                  {item.label}
                </a>
              ))}

              {/* Auth Section */}
              <div className="pt-6 border-t border-gray-800 space-y-4">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={handleLogOut}
                      className="w-full text-left text-lg font-medium text-red-500 hover:text-red-600 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-gray-200 hover:text-white transition"
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-semibold text-cyan-500 hover:text-cyan-400 transition"
                    >
                      Sign Up
                    </a>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
