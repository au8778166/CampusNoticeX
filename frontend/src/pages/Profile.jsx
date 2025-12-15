import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <p className="text-center mt-20 text-gray-600">
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
      window.location.reload(); // reset auth state
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white shadow rounded-lg">

      <h1 className="text-3xl font-bold text-center mb-6">
        👤 Profile
      </h1>

      <div className="space-y-4 text-lg">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={logout}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Logout
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
