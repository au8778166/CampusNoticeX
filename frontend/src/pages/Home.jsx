import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import NoticeCard from "../components/NoticeCard";
import CategoryFilter from "../components/CategoryFilter";
import api from "../api";
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Sort newest → oldest
  const sortByLatest = (data) =>
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Fetch all notices
  const fetchNotices = async () => {
    setLoading(true);
    const res = await axios.get(`${API_URL}/api/notices`);
    const sorted = sortByLatest(res.data);
    setNotices(sorted);
    setFilteredNotices(sorted);
    setLoading(false);
  };

  // Search logic
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
      const query = search.toLowerCase();
      const results = notices.filter((n) =>
        n.title.toLowerCase().includes(query)
      );
      setFilteredNotices(results);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, notices, category]);

  // Category filter
  useEffect(() => {
    if (category === "All") {
      setFilteredNotices(notices);
    } else {
      setFilteredNotices(notices.filter((n) => n.category === category));
    }
  }, [category]);

  // Initial Fetch
  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
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

        {/* Display States */}
        {loading ? (
          <p className="text-center mt-10 text-gray-500 text-lg animate-pulse">
            Loading notices...
          </p>
        ) : filteredNotices.length === 0 ? (
          <p className="text-center mt-10 text-gray-500 text-lg">
            No notices found.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4 animate-fadeIn">
            {filteredNotices.map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

