import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/AuthStore";

const RootLayout: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const expiresAt = useAuthStore((s) => s.expiresAt);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (isLoggedIn) {
      if (expiresAt && Date.now() > expiresAt) {
        logout();
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <div className="relative flex flex-col min-h-screen bg-[#0b0f19]">
      {/* Glow gradient circles */}
      {/* <div className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl -top-10 -left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl bottom-0 right-0"></div> */}

      <Header className="shrink" />
      <div className="flex-1 ">
        <Outlet />
      </div>
      <Footer className="shrink" />
    </div>
  );
};

export default RootLayout;
