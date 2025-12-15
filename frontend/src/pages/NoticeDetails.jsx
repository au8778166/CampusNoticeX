import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function NoticeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");

  // 🔗 Share logic
  const handleShare = async (notice) => {
    const shareUrl = notice.link || window.location.href;
    const shareText = `📢 Notice: ${notice.title}\n\nCheck here: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: notice.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        console.log("Share cancelled");
      }
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  // 🔐 Fetch protected notice
  const fetchNotice = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/notices/${id}`,
        { withCredentials: true } // 🔥 REQUIRED
      );
      setNotice(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: `/notice/${id}` } });
      } else {
        setError("Notice not found or access denied");
      }
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  if (error) {
    return (
      <p className="text-center mt-20 text-red-600 text-xl">{error}</p>
    );
  }

  if (!notice) {
    return (
      <p className="text-center mt-20 text-gray-600 text-xl">Loading…</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Back Button */}
      <Link to="/" className="text-blue-600 font-medium hover:underline">
        ← Back to Notices
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-extrabold mt-4 mb-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        {notice.title}
      </h1>

      {/* Category */}
      <span className="text-sm px-3 py-1 rounded-full text-white bg-purple-600">
        {notice.category || "General"}
      </span>

      {/* Date */}
      <p className="text-gray-600 mt-3 text-lg">
        📅 {new Date(notice.date).toLocaleDateString()}
      </p>

      {/* Description */}
      <p className="text-gray-700 mt-6 leading-relaxed">
        This notice is published by IIIT Bhopal. Click below to open the official notice.
      </p>

      {/* View Button */}
      {notice.link && (
        <a
          href={notice.link}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          View Official Notice ↗
        </a>
      )}

      {/* Share Button */}
      <button
        onClick={() => handleShare(notice)}
        className="block text-center mt-4 w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition"
      >
        🔗 Share Notice
      </button>
    </div>
  );
}
