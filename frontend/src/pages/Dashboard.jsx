import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
const API_URL = import.meta.env.VITE_API_URL;


export default function Dashboard() {
  const [categoryStats, setCategoryStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [weekly, setWeekly] = useState(0);

  // Fetch all stats from backend
  const fetchStats = async () => {
    const cat = await api.get("/api/notices/stats/categories");
    const t   = await api.get("/api/notices/stats/total");
    const w   = await api.get("/api/notices/stats/weekly");
    setCategoryStats(
      cat.data.map((item) => ({
        name: item._id,
        value: item.count,
      }))
    );

    setTotal(t.data.total);
    setWeekly(w.data.last7days);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Colors for pie chart
  const COLORS = ["#6366F1", "#F97316", "#10B981", "#EF4444", "#3B82F6", "#EAB308", "#A855F7"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        📊 Notice Statistics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-600">Total Notices</h2>
          <p className="text-5xl font-bold text-blue-600 mt-2">{total}</p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-600">Added This Week</h2>
          <p className="text-5xl font-bold text-purple-600 mt-2">{weekly}</p>
        </div>

      </div>

      {/* Pie Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Category Distribution</h2>

        <PieChart width={380} height={350}>
          <Pie
            data={categoryStats}
            cx={180}
            cy={160}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {categoryStats.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Weekly Chart (Bar) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Weekly Notice Activity</h2>
        
        <BarChart width={400} height={300} data={[{ name: "Last 7 Days", notices: weekly }]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="notices" fill="#6366F1" />
        </BarChart>
      </div>

    </div>
  );
}
