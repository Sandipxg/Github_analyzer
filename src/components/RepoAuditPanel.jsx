export default function RepoAuditPanel({ repos }) {
  if (!repos || repos.length === 0) return null;

  const totalRepos = repos.length;
  const originalRepos = repos.filter((r) => !r.fork).length;
  const documentedRepos = repos.filter((r) => r.description).length;
  const licensedRepos = repos.filter((r) => r.license).length;
  const homepagedRepos = repos.filter((r) => r.homepage).length;

  const originalityRate = totalRepos > 0 ? (originalRepos / totalRepos) * 100 : 0;
  const documentationRate = totalRepos > 0 ? (documentedRepos / totalRepos) * 100 : 0;
  const licenseRate = totalRepos > 0 ? (licensedRepos / totalRepos) * 100 : 0;
  const homepageRate = totalRepos > 0 ? (homepagedRepos / totalRepos) * 100 : 0;

  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
  
  const avgStars = totalRepos > 0 ? (totalStars / totalRepos).toFixed(1) : "0.0";
  const avgForks = totalRepos > 0 ? (totalForks / totalRepos).toFixed(1) : "0.0";

  const metrics = [
    { label: "Original Projects", value: originalityRate, color: "var(--accent-blue)" },
    { label: "Documentation Rate", value: documentationRate, color: "#a371f7" },
    { label: "Open Source Rate", value: licenseRate, color: "var(--accent-green)" },
    { label: "Homepage Rate", value: homepageRate, color: "#db6d28" },
  ];

  return (
    <div className="repo-audit-panel">
      <h3>Repository Quality Audit</h3>
      
      <div className="audit-metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.label} className="audit-metric-item">
            <div className="audit-metric-header">
              <span>{metric.label}</span>
              <strong>{metric.value.toFixed(0)}%</strong>
            </div>
            <div className="audit-progress-bar">
              <div
                className="audit-progress-fill"
                style={{
                  width: `${metric.value}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="audit-stats-summary">
        <div className="audit-stat-box">
          <span>Avg Stars / Repo</span>
          <strong>{avgStars}</strong>
        </div>
        <div className="audit-stat-box">
          <span>Avg Forks / Repo</span>
          <strong>{avgForks}</strong>
        </div>
      </div>
    </div>
  );
}
