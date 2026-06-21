import axios from "axios";
import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router";

type TLoginState = {
  userName: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginState>();

  const onSubmit: SubmitHandler<TLoginState> = async (data) => {
    try {
      const finalData = {
        ...data,
        type: "admin",
      };
      const response = await axios.post(
        "http://localhost:3001/api/v1/auth/login",
        finalData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // only if you use cookies
        }
      );

      useAuthStore.getState().login({
        token: response.data.token,
        userName: response.data.data.userName,
      });

      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (useAuthStore.getState().isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#0b0f19] overflow-hidden">
      {/* Animated background grid */}
      {/* <div className="absolute inset-0 bg-[url('https://i.ibb.co/vh7Mb26/grid.png')] opacity-10 animate-pulse"></div> */}

      {/* Glow gradient circles */}
      <div className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl -top-10 -left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl bottom-0 right-0"></div>

      {/* Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl p-8 rounded-2xl w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center text-white tracking-wide drop-shadow-md">
          🔐 Login to Admin Panel
        </h2>

        {/* Username */}
        <div className="flex flex-col">
          <label className="text-gray-300 font-medium mb-1">Username</label>
          <input
            type="text"
            {...register("userName", { required: "Username is required" })}
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition"
            placeholder="Enter your username"
          />
          {errors.userName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.userName.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-gray-300 font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? "Authenticating..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm">
          Secured with decentralized blockchain authentication
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
