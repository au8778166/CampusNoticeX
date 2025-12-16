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

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* -------------------------------------------------
     ✅ SAFE DATE PARSER (DD/MM/YYYY → Date)
  ------------------------------------------------- */
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);

    // If backend already sends ISO date
    if (!dateStr.includes("/")) {
      return new Date(dateStr);
    }

    // DD/MM/YYYY
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
  };

  /* -------------------------------------------------
     ✅ GLOBAL SORT (Newest → Oldest)
  ------------------------------------------------- */
  const sortByLatest = (data) =>
    data.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  /* -------------------------------------------------
     Fetch Notices (Paginated)
  ------------------------------------------------- */
  const fetchNotices = async (pageNum = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/notices/page/${pageNum}`
      );

      const incoming = res.data.notices || [];

      setNotices((prev) =>
        pageNum === 1
          ? sortByLatest([...incoming])
          : sortByLatest([...prev, ...incoming])
      );

      setFilteredNotices((prev) =>
        pageNum === 1
          ? sortByLatest([...incoming])
          : sortByLatest([...prev, ...incoming])
      );

      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------
     Initial Fetch
  ------------------------------------------------- */
  useEffect(() => {
    fetchNotices(1);
  }, []);

  /* -------------------------------------------------
     Search + Category Filtering
  ------------------------------------------------- */
  useEffect(() => {
    let data = [...notices];

    if (category !== "All") {
      data = data.filter((n) => n.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((n) =>
        n.title.toLowerCase().includes(q)
      );
    }

    setFilteredNotices(data);
  }, [search, category, notices]);

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center mb-6 
          bg-gradient-to-r from-purple-600 to-blue-500 
          bg-clip-text text-transparent">
          📌 Campus Notice Board
        </h1>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Category */}
        <CategoryFilter
          selected={category}
          setSelected={setCategory}
        />

        {/* Section Title */}
        <h2 className="text-2xl font-semibold mt-8 mb-3 text-center text-gray-800">
          Latest Notices
        </h2>

        {/* Empty State */}
        {!loading && filteredNotices.length === 0 && (
          <p className="text-center mt-10 text-gray-500 text-lg">
            No notices found.
          </p>
        )}

        {/* Notice List */}
        {filteredNotices.length > 0 && (
          <div className="mt-4 flex flex-col gap-4 animate-fadeIn">
            {filteredNotices.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        )}

        {/* Load More */}
        {page < totalPages && !loading && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchNotices(nextPage);
              }}
              className="px-6 py-3 bg-blue-600 text-white 
              rounded-lg font-semibold shadow 
              hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-center mt-6 text-gray-500 animate-pulse">
            Loading...
          </p>
        )}
      </div>
    </>
  );
}
