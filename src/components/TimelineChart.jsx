import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TimelineChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  // Group repos by year of creation
  const yearsCount = {};
  repos.forEach((repo) => {
    if (repo.created_at) {
      const year = new Date(repo.created_at).getFullYear();
      if (!isNaN(year)) {
        yearsCount[year] = (yearsCount[year] || 0) + 1;
      }
    }
  });

  const data = Object.keys(yearsCount)
    .map((year) => ({
      year: parseInt(year, 10),
      count: yearsCount[year],
    }))
    .sort((a, b) => a.year - b.year);

  if (data.length === 0) {
    return <p className="empty-panel-message">No timeline data available.</p>;
  }

  return (
    <div className="chart-card timeline-chart-card">
      <h3>Project Creation Timeline</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
          <XAxis 
            dataKey="year" 
            stroke="var(--text-secondary)" 
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            stroke="var(--text-secondary)" 
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            tickLine={false} 
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              color: "var(--text-primary)",
              boxShadow: "var(--shadow-md)"
            }}
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          />
          <Bar 
            dataKey="count" 
            fill="var(--accent-blue)" 
            radius={[4, 4, 0, 0]} 
            name="Repos Created" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
