import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function NoticeDetails() {
    const handleShare = async (notice) => {
        const shareUrl = notice.link || window.location.href;
        const shareText = `📢 Notice: ${notice.title}\n\nCheck here: ${shareUrl}`;
      
        // 1️⃣ Mobile Native Share (Android, iPhone)
        if (navigator.share) {
          try {
            await navigator.share({
              title: notice.title,
              text: shareText,
              url: shareUrl,
            });
            return;
          } catch (err) {
            console.log("Native share cancelled.");
          }
        }
      
        // 2️⃣ WhatsApp Share (web)
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          shareText
        )}`;
        window.open(whatsappUrl, "_blank");
      };
      
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  const fetchNotice = async () => {
    const res = await axios.get(`${API_URL}/api/notices/${id}`);
    setNotice(res.data);
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  if (!notice) {
    return (
      <p className="text-center mt-20 text-gray-600 text-xl">Loading…</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Back Button */}
      <Link
        to="/"
        className="text-blue-600 font-medium hover:underline"
      >
        ← Back to Notices
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-extrabold mt-4 mb-3 bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        {notice.title}
      </h1>

      {/* Category Tag */}
      <span className="text-sm px-3 py-1 rounded-full text-white bg-purple-600">
        {notice.category || "General"}
      </span>

      {/* Date */}
      <p className="text-gray-600 mt-3 text-lg">
        📅 <span>{notice.date}</span>
      </p>

      {/* Description (Optional later) */}
      <p className="text-gray-700 mt-6 leading-relaxed">
        This notice is published by IIIT Bhopal. Click the button below to open the official notice.
      </p>

      {/* View Notice Button */}
      {notice.link && (
        <a
          href={notice.link}
          target="_blank"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          View Official Notice ↗
        </a>
      )}

      {/* Share Notice Button */}
<button
  onClick={() => handleShare(notice)}
  className="block text-center mt-4 w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition"
>
  🔗 Share Notice
</button>


    </div>
  );
}
