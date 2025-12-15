import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // 🔔 Notification Permission + Subscription
  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Please allow notifications.");
      return;
    }

    const sw = await navigator.serviceWorker.register("/sw.js");

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });

    await fetch(`${import.meta.env.VITE_API_URL}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    alert("🔔 Notifications Enabled!");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-purple-600/90 to-blue-500/90 shadow-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform"
        >
          CampusNoticeX
        </Link>

        <div className="flex items-center gap-4">

          {/* Notification Button */}
          <button
            onClick={enableNotifications}
            className="hidden sm:flex items-center gap-2 px-4 py-2 
                       bg-white/20 text-white rounded-full 
                       border border-white/30 backdrop-blur
                       hover:bg-white hover:text-purple-700 
                       transition-all duration-300 shadow"
          >
            🔔 <span className="font-semibold">Notify</span>
          </button>

          {/* 🔓 Not Logged In */}
          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-white text-purple-700 
                           font-semibold shadow hover:shadow-lg 
                           hover:scale-105 transition-all"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-full border border-white 
                           text-white font-semibold 
                           hover:bg-white hover:text-purple-700 
                           hover:scale-105 transition-all"
              >
                Signup
              </Link>
            </>
          )}

          {/* 🔐 Logged In */}
          {user && (
            <div className="relative">
              {/* Avatar */}
              <div
                onClick={() => setOpen(!open)}
                className="w-11 h-11 rounded-full bg-white 
                           flex items-center justify-center 
                           font-bold text-purple-700 text-lg 
                           cursor-pointer select-none 
                           ring-2 ring-white shadow-lg
                           hover:scale-110 transition-transform"
              >
                {user?.name
                  ? user.name.trim().charAt(0).toUpperCase()
                  : "U"}
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-48 
                                bg-white rounded-xl shadow-2xl 
                                overflow-hidden animate-fadeIn">

                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-700">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    👤 Profile
                  </Link>

                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    📊 Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 
                               hover:bg-red-50 text-red-600 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
