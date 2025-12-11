import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-linear-to-r from-purple-600 to-blue-500 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold text-white tracking-wide">
          CampusNoticeX
        </Link>

        <Link
          to="/dashboard"
          className="px-4 py-2 bg-white text-purple-700 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
        >
          Dashboard
        </Link>

      </div>
    </nav>
  );
}
