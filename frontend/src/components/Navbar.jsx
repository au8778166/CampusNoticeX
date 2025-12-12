import { Link } from "react-router-dom";

export default function Navbar() {
  // Notification Permission + Subscription
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

    // Register service worker
    const sw = await navigator.serviceWorker.register("/sw.js");

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });

    // Save subscription to backend
    await fetch(`${import.meta.env.VITE_API_URL}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    alert("🔔 Notifications Enabled!");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-purple-600 to-blue-500 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide hover:opacity-90 transition"
        >
          CampusNoticeX
        </Link>

        <div className="flex items-center gap-4">

          {/* Enable Notifications Button */}
          <button
            onClick={enableNotifications}
            className="px-4 py-2 bg-white/20 backdrop-blur text-white border border-white/40 
                       rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition"
          >
            🔔 Enable Notifications
          </button>

          {/* Dashboard Button */}
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-white text-purple-700 rounded-lg font-semibold 
                       shadow hover:bg-gray-200 transition"
          >
            Dashboard
          </Link>

        </div>
      </div>
    </nav>
  );
}
