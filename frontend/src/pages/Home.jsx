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

  /* ---------------- SAFE DATE PARSER ---------------- */
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    if (!dateStr.includes("/")) return new Date(dateStr);
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
  };

  /* ---------------- SORT BY LATEST ---------------- */
  const sortByLatest = (data) =>
    data.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  /* ---------------- FETCH ALL PAGES ---------------- */
  const fetchAllNotices = async () => {
    try {
      setLoading(true);

      let page = 1;
      let totalPages = 1;
      let allNotices = [];

      while (page <= totalPages) {
        const res = await axios.get(
          `${API_URL}/api/notices/page/${page}`
        );

        totalPages = res.data.totalPages;
        allNotices.push(...res.data.notices);
        page++;
      }

      const sorted = sortByLatest(allNotices);

      setNotices(sorted);
      setFilteredNotices(sorted);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL FETCH ---------------- */
  useEffect(() => {
    fetchAllNotices();
  }, []);

  /* ---------------- SEARCH + FILTER ---------------- */
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

      {/* 🌑 DARK UI BACKGROUND */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-cyan-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

          {/* Heading */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold 
            text-center mb-6 
            bg-gradient-to-r from-emerald-300 to-cyan-300 
            bg-clip-text text-transparent"
          >
            📌 Campus Notice Board
          </h1>

          {/* Search */}
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl shadow mb-4">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Category Filter */}
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl shadow mb-6">
            <CategoryFilter
              selected={category}
              setSelected={setCategory}
            />
          </div>

          {/* Section Title */}
          <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-6 text-center text-gray-100">
            Latest Notices
          </h2>

          {/* Loading */}
          {loading && (
            <p className="text-center mt-10 text-gray-400 animate-pulse">
              Loading notices...
            </p>
          )}

          {/* Empty State */}
          {!loading && filteredNotices.length === 0 && (
            <p className="text-center mt-10 text-gray-400">
              No notices found.
            </p>
          )}

          {/* 🔳 GRID (ALL NOTICES, SAME HEIGHT) */}
          {!loading && filteredNotices.length > 0 && (
            <div
              className="grid gap-6 items-stretch animate-fadeIn
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3"
            >
              {filteredNotices.map((n) => (
                <NoticeCard key={n._id} notice={n} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
