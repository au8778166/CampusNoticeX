import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/";

  const { fetchUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      await fetchUser();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 px-4"
    >
      {/* Glass Card */}
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md
        bg-white/80 backdrop-blur-xl
        p-8 rounded-2xl shadow-2xl border border-white/30"
      >
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-extrabold
            bg-gradient-to-r from-purple-600 to-blue-500
            bg-clip-text text-transparent"
          >
            CampusNoticeX
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-1 p-3 rounded-lg border
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full mt-1 p-3 rounded-lg border
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white font-semibold
          bg-gradient-to-r from-blue-600 to-indigo-600
          hover:scale-[1.02] hover:shadow-xl
          transition-all duration-300"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
