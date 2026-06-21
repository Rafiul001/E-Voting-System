import { useCallback, useState, type FormEvent } from "react";
import Flex from "../components/ui/Flex";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

type TUserLoginCredentials = { username?: string; password?: string };

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [userLoginCredentials, setUserLoginCredentials] =
    useState<TUserLoginCredentials>({ username: "", password: "" });

  const [inputErrors, setInputError] = useState<{ [str: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const onChangeFormInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserLoginCredentials((state) => ({
        ...state,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const errors: { [key: string]: string } = {};

      if (!userLoginCredentials.username) {
        errors.username = "Username cannot be empty";
      }

      if (!userLoginCredentials.password) {
        errors.password = "Password cannot be empty";
      }

      if (Object.keys(errors).length > 0) {
        setInputError(errors);
        return;
      }

      try {
        await login(
          userLoginCredentials.username!,
          userLoginCredentials.password!
        );
        navigate("/");
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
    [
      login,
      navigate,
      userLoginCredentials.username,
      userLoginCredentials.password,
    ]
  );

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-100 via-white to-teal-50 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-teal-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <Flex className="h-full px-4 items-center justify-center relative z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 p-10 w-full max-w-md transition-all hover:shadow-indigo-200/60">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2v6m0 0l3-3m-3 3l-3-3M4 10v10h16V10M4 10l8-8m0 0l8 8"
                />
              </svg>
              <h2 className="text-3xl font-extrabold text-indigo-700">
                Election Commission
              </h2>
            </div>
            <p className="text-gray-500 mt-2 text-center">
              Secure Private Blockchain Voting System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={userLoginCredentials.username}
                onChange={onChangeFormInput}
                placeholder="Enter your username"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400 transition"
              />
              {inputErrors.username && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {inputErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={userLoginCredentials.password}
                  onChange={onChangeFormInput}
                  placeholder="Enter your password"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400 transition"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {inputErrors.password && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {inputErrors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-center text-red-600 font-semibold">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>© 2025 Private Blockchain Voting System</p>
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default Login;
