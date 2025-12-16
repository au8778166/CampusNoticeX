import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const dropdownRef = useRef(null);

  /* ---------------------------------------------
     Close dropdown on outside click
  ---------------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------------------------------------
     🔔 Enable Notifications
  ---------------------------------------------- */
  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      setNotifyEnabled(true);
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

    setNotifyEnabled(true);
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl
      bg-gradient-to-r from-purple-600/90 via-blue-500/90 to-indigo-600/90
      shadow-xl"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide
          hover:scale-105 transition-transform"
        >
          CampusNoticeX
        </Link>

        <div className="flex items-center gap-4">

          {/* Notification Button */}
          <button
            onClick={enableNotifications}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 
              rounded-full font-semibold backdrop-blur border
              transition-all duration-300 shadow
              ${
                notifyEnabled
                  ? "bg-green-500/90 text-white border-green-400"
                  : "bg-white/20 text-white border-white/30 hover:bg-white hover:text-purple-700"
              }`}
          >
            {notifyEnabled ? "✅ Notifications On" : "🔔 Notify"}
          </button>

          {/* Logged Out */}
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

          {/* Logged In */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar */}
              <div
                onClick={() => setOpen(!open)}
                className="relative w-11 h-11 rounded-full bg-white
                flex items-center justify-center font-bold
                text-purple-700 text-lg cursor-pointer
                ring-2 ring-white shadow-lg
                hover:scale-110 transition-transform"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}

                {/* Online Pulse */}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3
                  bg-green-500 rounded-full ring-2 ring-white
                  animate-pulse"
                />
              </div>

              {/* Dropdown */}
              {open && (
                <div
                  className="absolute right-0 mt-3 w-52
                  bg-white rounded-2xl shadow-2xl
                  overflow-hidden animate-fadeIn"
                >
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
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    👤 Profile
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    📊 Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2
                    text-red-600 hover:bg-red-50 transition"
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
