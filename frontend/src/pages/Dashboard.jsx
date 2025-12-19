import { useEffect, useState } from "react";
import api from "../api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

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

  // Chart colors
  const COLORS = [
    "#34D399", "#22D3EE", "#60A5FA",
    "#A78BFA", "#F472B6", "#FBBF24", "#F87171"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-cyan-900 to-black">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Heading */}
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-center mb-10
          bg-gradient-to-r from-emerald-300 to-cyan-300
          bg-clip-text text-transparent"
        >
          📊 Notice Statistics Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Total Notices */}
          <div
            className="bg-black/50 backdrop-blur-xl
            p-6 rounded-2xl border border-white/10
            shadow-xl hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-semibold text-gray-400">
              Total Notices
            </h2>
            <p className="text-5xl font-bold mt-3
              bg-gradient-to-r from-cyan-400 to-emerald-400
              bg-clip-text text-transparent">
              {total}
            </p>
          </div>

          {/* Weekly Notices */}
          <div
            className="bg-black/50 backdrop-blur-xl
            p-6 rounded-2xl border border-white/10
            shadow-xl hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-semibold text-gray-400">
              Added This Week
            </h2>
            <p className="text-5xl font-bold mt-3
              bg-gradient-to-r from-purple-400 to-pink-400
              bg-clip-text text-transparent">
              {weekly}
            </p>
          </div>
        </div>

        {/* Category Distribution */}
        <div
          className="bg-black/50 backdrop-blur-xl
          p-6 rounded-2xl border border-white/10
          shadow-xl mb-12"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-200 text-center">
            Category Distribution
          </h2>

          <div className="flex justify-center overflow-x-auto">
            <PieChart width={360} height={320}>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                label
              >
                {categoryStats.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#fff",
                }}
              />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div
          className="bg-black/50 backdrop-blur-xl
          p-6 rounded-2xl border border-white/10
          shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-200 text-center">
            Weekly Notice Activity
          </h2>

          <div className="flex justify-center overflow-x-auto">
            <BarChart
              width={380}
              height={300}
              data={[{ name: "Last 7 Days", notices: weekly }]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#CBD5E1" />
              <YAxis allowDecimals={false} stroke="#CBD5E1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="notices"
                fill="#22D3EE"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </div>
        </div>

      </div>
    </div>
  );
}
