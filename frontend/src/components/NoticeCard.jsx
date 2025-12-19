import { Link } from "react-router-dom";

const getRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;

  return date.toLocaleDateString();
};

export default function NoticeCard({ notice }) {
  return (
    <Link to={`/notice/${notice._id}`} className="group block h-full">
      <div
        className="relative h-full flex flex-col justify-between
        overflow-hidden 
        bg-black/50 backdrop-blur-lg 
        p-5 rounded-2xl 
        border border-white/10
        shadow-lg transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Accent Bar */}
        <div
          className="absolute left-0 top-0 h-full w-1 
          bg-gradient-to-b from-emerald-400 via-cyan-400 to-blue-500"
        />

        {/* Content */}
        <div>
          {/* Title (fixed height using line clamp) */}
          <h3
            className="font-semibold text-lg text-gray-100 
            leading-snug mb-3
            line-clamp-2
            group-hover:text-cyan-300 transition-colors"
          >
            {notice.title}
          </h3>

          {/* Category */}
          <span
            className="inline-block text-xs font-semibold px-3 py-1 
            rounded-full text-white 
            bg-gradient-to-r from-emerald-500 to-cyan-500"
          >
            {notice.category || "General"}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-400">
            📅 {getRelativeDate(notice.date)}
          </p>

          <span
            className="text-sm font-medium text-cyan-400 
            opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View →
          </span>
        </div>

        {/* Hover Glow */}
        <div
          className="absolute inset-0 rounded-2xl 
          opacity-0 group-hover:opacity-100 
          transition pointer-events-none
          bg-gradient-to-r 
          from-emerald-400/10 via-cyan-400/10 to-blue-400/10"
        />
      </div>
    </Link>
  );
}
