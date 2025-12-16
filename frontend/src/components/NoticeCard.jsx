import { Link } from "react-router-dom";

/* -----------------------------------------
   Utility: Relative Date (UX boost)
------------------------------------------ */
const getRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor(
    (now - date) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;

  return date.toLocaleDateString();
};

export default function NoticeCard({ notice }) {
  return (
    <Link to={`/notice/${notice._id}`} className="group">
      <div
        className="relative overflow-hidden 
        bg-white p-5 rounded-2xl border border-gray-200
        shadow-md transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1"
      >

        {/* Gradient Accent Bar */}
        <div className="absolute left-0 top-0 h-full w-1 
          bg-gradient-to-b from-purple-600 to-blue-500" />

        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <h3
            className="font-semibold text-lg text-gray-800 
            leading-snug group-hover:text-purple-600 
            transition-colors"
          >
            {notice.title}
          </h3>

          <span
            className="shrink-0 text-xs font-semibold px-3 py-1 
            rounded-full text-white 
            bg-gradient-to-r from-purple-600 to-indigo-500"
          >
            {notice.category || "General"}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            📅 {getRelativeDate(notice.date)}
          </p>

          <span
            className="text-sm font-medium text-blue-600 
            opacity-0 group-hover:opacity-100 
            transition-opacity"
          >
            View →
          </span>
        </div>

        {/* Hover Glow */}
        <div
          className="absolute inset-0 rounded-2xl 
          opacity-0 group-hover:opacity-100 
          transition pointer-events-none
          bg-gradient-to-r from-purple-100/30 to-blue-100/30"
        />
      </div>
    </Link>
  );
}
