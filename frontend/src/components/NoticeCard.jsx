import { Link } from "react-router-dom";

export default function NoticeCard({ notice }) {
  return (
    <Link to={`/notice/${notice._id}`}>
      <div className="bg-white p-5 rounded-xl shadow-md mb-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">

        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-800">
            {notice.title}
          </h3>

          <span className="text-xs px-3 py-1 rounded-full text-white bg-purple-600">
            {notice.category || "General"}
          </span>
        </div>

        <p className="text-gray-600 mt-2">📅 {notice.date}</p>

      </div>
    </Link>
  );
}
