import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <p className="text-center mt-20 text-gray-400 animate-pulse">
        Loading profile...
      </p>
    );
  }

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure? This will permanently delete your account."
    );
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/api/user/me`, {
        withCredentials: true,
      });

      navigate("/login");
      window.location.reload();
    } catch {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-emerald-900 via-cyan-900 to-black px-4">

      {/* Glass Card */}
      <div className="relative w-full max-w-xl p-8 rounded-3xl
        bg-black/50 backdrop-blur-xl
        shadow-2xl border border-white/10
        animate-fadeIn">

        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl
          bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10
          blur-2xl -z-10" />

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full
            bg-gradient-to-br from-emerald-500 to-cyan-500
            flex items-center justify-center
            text-black text-3xl font-bold shadow-xl">

            {user.name?.charAt(0).toUpperCase() || "U"}

            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-4 h-4
              bg-green-500 rounded-full ring-2 ring-black" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center mb-6
          bg-gradient-to-r from-emerald-300 to-cyan-300
          bg-clip-text text-transparent">
          Profile
        </h1>

        {/* Info */}
        <div className="space-y-4 text-gray-300 text-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-400">Name</span>
            <span className="text-gray-100">{user.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-400">Email</span>
            <span className="truncate max-w-[60%] text-right text-gray-100">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-400">Joined</span>
            <span className="text-gray-100">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={logout}
            className="py-3 rounded-xl font-semibold text-black
            bg-gradient-to-r from-emerald-500 to-cyan-500
            hover:scale-[1.05] hover:shadow-2xl
            transition-all duration-300"
          >
            Logout
          </button>

          <button
            onClick={handleDelete}
            className="py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-red-600 to-pink-600
            hover:scale-[1.05] hover:shadow-2xl
            transition-all duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
