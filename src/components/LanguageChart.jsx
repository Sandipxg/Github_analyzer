import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2f81f7",
  "#238636",
  "#d29922",
  "#db6d28",
  "#a371f7",
  "#1f9d55",
  "#da3633",
  "#bf8700",
];

const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
};

export default function LanguageChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  const languageCount = {};
  let totalWithLanguage = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      totalWithLanguage++;
    }
  });

  const rawData = Object.keys(languageCount).map((lang) => ({
    name: lang,
    value: languageCount[lang],
  }));

  const sortedData = rawData.sort((a, b) => b.value - a.value);

  if (sortedData.length === 0) {
    return <p className="empty-panel-message">No language data available.</p>;
  }

  const languagesWithPercent = sortedData.map((item, index) => {
    const pct = totalWithLanguage > 0 ? (item.value / totalWithLanguage) * 100 : 0;
    const color = languageColors[item.name] || COLORS[index % COLORS.length];
    return {
      ...item,
      percentage: pct,
      color,
    };
  });

  return (
    <div className="language-analytics-card">
      <h3>Most Used Languages</h3>
      <div className="lang-analytics-content">
        <div className="lang-chart-wrapper">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={languagesWithPercent}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={50}
                paddingAngle={3}
              >
                {languagesWithPercent.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-md)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lang-list-wrapper">
          {languagesWithPercent.slice(0, 5).map((lang) => (
            <div key={lang.name} className="lang-list-item">
              <div className="lang-item-header">
                <span className="lang-name-label">
                  <span
                    className="lang-dot"
                    style={{ backgroundColor: lang.color }}
                  />
                  {lang.name}
                </span>
                <span className="lang-percentage-label">
                  {lang.percentage.toFixed(1)}% ({lang.value})
                </span>
              </div>
              <div className="lang-progress-bar">
                <div
                  className="lang-progress-fill"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
