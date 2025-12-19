import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
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

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl
      bg-gradient-to-r from-emerald-900/80 via-cyan-900/80 to-black/80
      border-b border-white/10 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide
          bg-gradient-to-r from-emerald-300 to-cyan-300
          bg-clip-text text-transparent
          hover:scale-105 transition-transform"
        >
          CampusNoticeX
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">

          {/* Logged Out */}
          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full
                bg-emerald-600 text-white
                font-semibold shadow
                hover:bg-emerald-700 hover:scale-105
                transition-all"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-full
                border border-white/30 text-white
                font-semibold
                hover:bg-white hover:text-black
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
                className="relative w-11 h-11 rounded-full
                bg-gradient-to-br from-emerald-500 to-cyan-500
                flex items-center justify-center
                font-bold text-black text-lg
                cursor-pointer shadow-lg
                hover:scale-110 transition-transform"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}

                {/* Online dot */}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3
                  bg-green-500 rounded-full ring-2 ring-black"
                />
              </div>

              {/* Dropdown */}
              {open && (
                <div
                  className="absolute right-0 mt-3 w-56
                  bg-black/80 backdrop-blur-xl
                  border border-white/10
                  rounded-2xl shadow-2xl
                  overflow-hidden animate-fadeIn"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2
                    text-gray-200 hover:bg-white/10 transition"
                  >
                    👤 Profile
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2
                    text-gray-200 hover:bg-white/10 transition"
                  >
                    📊 Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2
                    text-red-400 hover:bg-red-500/10 transition"
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
