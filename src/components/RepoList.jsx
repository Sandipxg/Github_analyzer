import { useState } from "react";

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

export default function RepoList({ repos }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const [visibleCount, setVisibleCount] = useState(5);

  if (!repos || repos.length === 0) {
    return <p className="empty-panel-message">No repositories available.</p>;
  }

  // Filter repos
  const filteredRepos = repos.filter((repo) => {
    const term = searchTerm.toLowerCase();
    return (
      repo.name.toLowerCase().includes(term) ||
      (repo.description && repo.description.toLowerCase().includes(term))
    );
  });

  // Sort repos
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === "stars") {
      return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    }
    if (sortBy === "forks") {
      return (b.forks_count || 0) - (a.forks_count || 0);
    }
    if (sortBy === "size") {
      return (b.size || 0) - (a.size || 0);
    }
    if (sortBy === "updated") {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    return 0;
  });

  const displayedRepos = sortedRepos.slice(0, visibleCount);

  return (
    <div className="repo-list-container">
      <div className="repo-header-row">
        <h3>Repositories ({filteredRepos.length})</h3>
        <div className="repo-controls">
          <input
            type="text"
            placeholder="Search repos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(5);
            }}
            className="repo-search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="repo-sort-select"
          >
            <option value="stars">Sort by Stars</option>
            <option value="forks">Sort by Forks</option>
            <option value="size">Sort by Size</option>
            <option value="updated">Sort by Updated</option>
          </select>
        </div>
      </div>

      <div className="repo-list">
        {displayedRepos.map((repo) => {
          const langColor = languageColors[repo.language] || "#8b949e";
          const sizeMb = repo.size ? (repo.size / 1024).toFixed(2) : "0.00";
          return (
            <div key={repo.id} className="repo-item">
              <div className="repo-copy">
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
                <p>{repo.description || "No description provided"}</p>
              </div>

              <div className="repo-meta-row">
                <div className="repo-left-meta">
                  {repo.language && (
                    <span className="repo-lang">
                      <span
                        className="lang-dot"
                        style={{ backgroundColor: langColor }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.size > 0 && (
                    <span className="repo-size">{sizeMb} MB</span>
                  )}
                </div>
                <div className="repo-right-meta">
                  <div className="repo-stats">
                    <span title="Stars">★ {repo.stargazers_count.toLocaleString()}</span>
                    <span title="Forks">⑂ {repo.forks_count.toLocaleString()}</span>
                  </div>
                  <span className="repo-date" title="Last updated">
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {filteredRepos.length === 0 && (
          <p className="empty-panel-message">No matching repositories found.</p>
        )}
      </div>

      {sortedRepos.length > 5 && (
        <div className="repo-pagination-controls">
          {visibleCount < sortedRepos.length && (
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 5, sortedRepos.length))}
              className="repo-page-btn"
            >
              Show More
            </button>
          )}
          {visibleCount > 5 && (
            <button
              onClick={() => setVisibleCount(5)}
              className="repo-page-btn repo-page-btn--secondary"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
