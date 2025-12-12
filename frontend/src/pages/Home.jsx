import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import NoticeCard from "../components/NoticeCard";
import CategoryFilter from "../components/CategoryFilter";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sort newest → oldest
  const sortByLatest = (data) =>
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

  /* -------------------------------------------------
     Fetch notices by page (10 per page)
  ------------------------------------------------- */
  const fetchNotices = async (pageNum = 1) => {
    setLoading(true);

    const res = await axios.get(`${API_URL}/api/notices/page/${pageNum}`);

    const newData = sortByLatest(res.data.notices);

    // Page 1 → fresh load
    if (pageNum === 1) {
      setNotices(newData);
      setFilteredNotices(newData);
    } else {
      // Load more → append
      setNotices((prev) => [...prev, ...newData]);
      setFilteredNotices((prev) => [...prev, ...newData]);
    }

    setTotalPages(res.data.totalPages);
    setLoading(false);
  };

  /* -------------------------------------------------
     Search Filtering
  ------------------------------------------------- */
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNotices(
        category === "All"
          ? notices
          : notices.filter((n) => n.category === category)
      );
      return;
    }

    const timeout = setTimeout(() => {
      const q = search.toLowerCase();
      const results = notices.filter((n) =>
        n.title.toLowerCase().includes(q)
      );
      setFilteredNotices(results);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, notices, category]);

  /* -------------------------------------------------
     Category Filtering
  ------------------------------------------------- */
  useEffect(() => {
    if (category === "All") {
      setFilteredNotices(notices);
    } else {
      setFilteredNotices(
        notices.filter((n) => n.category === category)
      );
    }
  }, [category]);

  /* -------------------------------------------------
     Initial Fetch
  ------------------------------------------------- */
  useEffect(() => {
    fetchNotices(1);
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center mb-6 
          bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          📌 Campus Notice Board
        </h1>

        {/* Search Bar */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Category Filter */}
        <CategoryFilter selected={category} setSelected={setCategory} />

        {/* Section Title */}
        <h2 className="text-2xl font-semibold mt-8 mb-3 text-center text-gray-800">
          Latest Notices
        </h2>

        {/* Main Listing */}
        {filteredNotices.length === 0 && !loading ? (
          <p className="text-center mt-10 text-gray-500 text-lg">
            No notices found.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4 animate-fadeIn">
            {filteredNotices.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        )}

        {/* Pagination: Load More */}
        {page < totalPages && !loading && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setPage(page + 1);
                fetchNotices(page + 1);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold 
              shadow hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <p className="text-center mt-6 text-gray-500 animate-pulse">
            Loading...
          </p>
        )}
      </div>
    </>
  );
}
