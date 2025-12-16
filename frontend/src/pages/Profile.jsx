import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <p className="text-center mt-20 text-gray-600 animate-pulse">
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
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 px-4"
    >
      {/* Card */}
      <div
        className="w-full max-w-xl p-8 rounded-2xl
        bg-white/80 backdrop-blur-xl
        shadow-2xl border border-white/30 animate-fadeIn"
      >
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full
            bg-gradient-to-r from-purple-600 to-blue-500
            flex items-center justify-center
            text-white text-3xl font-bold shadow-lg"
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-extrabold text-center mb-6
          bg-gradient-to-r from-purple-600 to-blue-500
          bg-clip-text text-transparent"
        >
          Profile
        </h1>

        {/* Info */}
        <div className="space-y-4 text-gray-700 text-lg">
          <div className="flex justify-between">
            <span className="font-semibold">Name</span>
            <span>{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Email</span>
            <span className="truncate max-w-[60%] text-right">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Joined</span>
            <span>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={logout}
            className="py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:scale-[1.03] hover:shadow-xl
            transition-all duration-300"
          >
            Logout
          </button>

          <button
            onClick={handleDelete}
            className="py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-red-600 to-pink-600
            hover:scale-[1.03] hover:shadow-xl
            transition-all duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
