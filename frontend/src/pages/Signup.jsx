import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 px-4"
    >
      {/* Glass Card */}
      <form
        onSubmit={handleSignup}
        className="relative w-full max-w-md
        bg-white/80 backdrop-blur-xl
        p-8 rounded-2xl shadow-2xl border border-white/30"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-extrabold
            bg-gradient-to-r from-green-600 to-teal-500
            bg-clip-text text-transparent"
          >
            Create Account
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Join CampusNoticeX today 🚀
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full mt-1 p-3 rounded-lg border
            focus:ring-2 focus:ring-green-500 focus:outline-none
            transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-1 p-3 rounded-lg border
            focus:ring-2 focus:ring-green-500 focus:outline-none
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
            focus:ring-2 focus:ring-green-500 focus:outline-none
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
          bg-gradient-to-r from-green-600 to-teal-600
          hover:scale-[1.02] hover:shadow-xl
          transition-all duration-300"
        >
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
