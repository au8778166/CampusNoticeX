import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function NoticeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  /* -----------------------------
     Share logic
  ----------------------------- */
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

  /* -----------------------------
     Fetch protected notice
  ----------------------------- */
  const fetchNotice = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/notices/${id}`,
        { withCredentials: true }
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
      <p className="text-center mt-20 text-red-400 text-xl">
        {error}
      </p>
    );
  }

  if (!notice) {
    return (
      <p className="text-center mt-20 text-gray-400 text-xl">
        Loading…
      </p>
    );
  }

  /* -----------------------------
     AI Summary
  ----------------------------- */
  const generateSummary = async () => {
    try {
      setLoadingSummary(true);

      const res = await axios.post(
        `${API_URL}/api/ai/summarize`,
        {
          title: notice.title,
          link: notice.link,
        },
        { withCredentials: true }
      );

      setSummary(res.data.summary);
    } catch {
      setSummary("Failed to generate summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-cyan-900 to-black">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 
          text-cyan-400 font-medium hover:underline"
        >
          ← Back to Notices
        </Link>

        {/* Main Card */}
        <div
          className="mt-6 bg-black/50 backdrop-blur-xl 
          rounded-2xl shadow-2xl p-6 
          border border-white/10"
        >
          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl font-extrabold leading-snug 
            bg-gradient-to-r from-emerald-300 to-cyan-300 
            bg-clip-text text-transparent"
          >
            {notice.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span
              className="text-sm px-3 py-1 rounded-full 
              text-white bg-gradient-to-r 
              from-emerald-500 to-cyan-500"
            >
              {notice.category || "General"}
            </span>

            <span className="text-sm text-gray-400 flex items-center gap-1">
              📅 {new Date(notice.date).toLocaleDateString()}
            </span>
          </div>

          <hr className="my-6 border-white/10" />

          {/* Description */}
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
            This notice has been officially published by
            <span className="font-semibold text-gray-100">
              {" "}IIIT Bhopal
            </span>.
            Please refer to the official document for complete details.
          </p>

          {/* 🧠 AI Summary */}
          <div
            className="mt-8 p-5 rounded-xl 
            bg-black/40 backdrop-blur 
            border border-white/10"
          >
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-gray-100">
              🧠 AI Summary
            </h2>

            {!summary && !loadingSummary && (
              <button
                onClick={generateSummary}
                className="px-4 py-2 
                bg-emerald-600 text-white rounded-lg 
                hover:bg-emerald-700 transition"
              >
                Generate Summary
              </button>
            )}

            {loadingSummary && (
              <p className="text-gray-400 animate-pulse mt-2">
                Generating summary...
              </p>
            )}

            {summary && (
              <pre
                className="whitespace-pre-wrap text-gray-300 
                mt-3 text-sm leading-relaxed"
              >
                {summary}
              </pre>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* View Notice */}
            {notice.link && (
              <a
                href={notice.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 
                px-6 py-3 bg-cyan-600 text-white 
                rounded-xl font-semibold
                shadow hover:bg-cyan-700 
                hover:shadow-xl transition-all"
              >
                📄 View Official Notice
              </a>
            )}

            {/* Share */}
            <button
              onClick={() => handleShare(notice)}
              className="flex items-center justify-center gap-2 
              px-6 py-3 bg-emerald-600 text-white 
              rounded-xl font-semibold
              shadow hover:bg-emerald-700 
              hover:shadow-xl transition-all"
            >
              🔗 Share Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
