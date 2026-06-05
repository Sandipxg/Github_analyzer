import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGithubProfile } from "../hooks/useGithubProfile";
import { useExportableAvatarSrc } from "../hooks/useExportableAvatarSrc";
import ScoreBadge from "./ScoreBadge";
import LanguageChart from "./LanguageChart";
import TimelineChart from "./TimelineChart";
import RepoAuditPanel from "./RepoAuditPanel";
import RepoList from "./RepoList";
import Skeleton from "./Skeleton";
import ContributionGraph from "./ContributionGraph";
import { calculateDeveloperScore } from "../utils/scoreCalculator";

export default function ProfileCard({ username, onExportReady }) {
  const { user, repos, loading, error } = useGithubProfile(username);
  const { src: avatarSrc, exportReady: avatarExportReady } =
    useExportableAvatarSrc(user?.avatar_url ?? "");

  useEffect(() => {
    if (!username) {
      onExportReady?.(false);
      return;
    }
    onExportReady?.(!loading && !!user && !error && avatarExportReady);
  }, [username, loading, user, error, onExportReady, avatarExportReady]);

  if (loading) {
    return (
      <div className="profile-card skeleton-container">
        <Skeleton
          width="140px"
          height="140px"
          style={{ borderRadius: "36px" }}
        />
        <div className="profile-info">
          <Skeleton width="40%" height="2rem" />
          <Skeleton width="60%" height="1rem" style={{ marginTop: "1rem" }} />
          <div className="stats-inline" style={{ marginTop: "2rem" }}>
            <Skeleton width="100px" height="1.5rem" />
            <Skeleton width="100px" height="1.5rem" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) return null;

  const score = calculateDeveloperScore(user, repos);
  
  // Dominant Language / Developer Persona
  const getDeveloperPersona = (repositories) => {
    if (!repositories || repositories.length === 0) return "Explorer";
    const languageCounts = {};
    repositories.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const sortedLangs = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);
    if (sortedLangs.length === 0) return "Developer";

    const [topLang] = sortedLangs[0];
    const jsFrameworks = ["JavaScript", "TypeScript", "HTML", "CSS"];
    const sysLangs = ["Go", "Rust", "C++", "C", "Java"];
    const dataLangs = ["Python", "R", "Julia", "Jupyter Notebook"];

    if (jsFrameworks.includes(topLang)) return "Frontend Architect";
    if (sysLangs.includes(topLang)) return "Systems Architect";
    if (dataLangs.includes(topLang)) return "Data Scientist / AI Dev";
    if (topLang === "PHP" || topLang === "Ruby") return "Backend specialist";
    if (topLang === "Shell" || topLang === "PowerShell") return "DevOps Engineer";
    return `${topLang} Developer`;
  };

  const getDeveloperTier = (devScore) => {
    if (devScore > 1000) return { name: "OSS Legend", color: "#da3633" };
    if (devScore > 500) return { name: "Elite Developer", color: "var(--accent-green)" };
    if (devScore > 200) return { name: "Rising Star", color: "var(--accent-blue)" };
    if (devScore > 50) return { name: "Active Contributor", color: "#d29922" };
    return { name: "GitHub Enthusiast", color: "#8b949e" };
  };

  const devPersona = getDeveloperPersona(repos);
  const devTier = getDeveloperTier(score);

  const totalStars = repos.reduce(
    (sum, repo) => sum + (repo.stargazers_count || 0),
    0
  );
  const totalForks = repos.reduce(
    (sum, repo) => sum + (repo.forks_count || 0),
    0
  );
  
  const totalSizeKb = repos.reduce((sum, repo) => sum + (repo.size || 0), 0);
  const totalSizeFormatted = totalSizeKb > 1024 * 1024
    ? `${(totalSizeKb / (1024 * 1024)).toFixed(2)} GB`
    : totalSizeKb > 1024
    ? `${(totalSizeKb / 1024).toFixed(2)} MB`
    : `${totalSizeKb.toLocaleString()} KB`;

  const totalOpenIssues = repos.reduce(
    (sum, repo) => sum + (repo.open_issues_count || 0),
    0
  );

  const updatedAt = repos
    .map((repo) => new Date(repo.updated_at).getTime())
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  const profileMeta = [
    user.location ? `📍 ${user.location}` : null,
    user.company ? `💼 ${user.company}` : null,
    user.blog ? `🔗 ${user.blog.replace(/^https?:\/\//, "")}` : null,
  ].filter(Boolean);

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "";

  const accountAgeYears = user.created_at
    ? Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear())
    : 0;

  return (
    <motion.div
      className="analysis-profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-card">
        <div className="profile-hero-row">
          <img
            className="profile-avatar"
            src={avatarSrc}
            alt={`${user.login}'s avatar`}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            {...(typeof avatarSrc === "string" &&
            (avatarSrc.startsWith("http://") ||
              avatarSrc.startsWith("https://"))
              ? { crossOrigin: "anonymous" }
              : {})}
          />

          <div className="profile-info">
            <span className="profile-kicker">
              Joined {joinedDate} ({accountAgeYears} years active)
            </span>
            <h2>{user.name || user.login}</h2>
            <a href={user.html_url} target="_blank" rel="noreferrer" className="profile-handle">
              @{user.login}
            </a>
            <p className="profile-bio">{user.bio || "No bio available"}</p>

            <div className="profile-badges-row">
              <span className="badge badge--persona">{devPersona}</span>
              <span 
                className="badge badge--tier" 
                style={{ 
                  borderColor: devTier.color, 
                  color: devTier.color,
                  background: `${devTier.color}11`
                }}
              >
                {devTier.name}
              </span>
            </div>

            {profileMeta.length > 0 && (
              <div className="profile-meta">
                {profileMeta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-score-column">
            <ScoreBadge score={score} />
          </div>
        </div>

        <div className="analysis-stat-grid">
          <div className="analysis-stat">
            <span>Followers</span>
            <strong>{user.followers.toLocaleString()}</strong>
          </div>
          <div className="analysis-stat">
            <span>Repositories</span>
            <strong>{repos.length.toLocaleString()}</strong>
          </div>
          <div className="analysis-stat">
            <span>Total Stars</span>
            <strong>{totalStars.toLocaleString()}</strong>
          </div>
          <div className="analysis-stat">
            <span>Total Forks</span>
            <strong>{totalForks.toLocaleString()}</strong>
          </div>
          <div className="analysis-stat">
            <span>Following</span>
            <strong>{user.following.toLocaleString()}</strong>
          </div>
          <div className="analysis-stat">
            <span>Open Issues</span>
            <strong>{totalOpenIssues.toLocaleString()}</strong>
          </div>
          <div className="analysis-stat">
            <span>Codebase Size</span>
            <strong>{totalSizeFormatted}</strong>
          </div>
          <div className="analysis-stat">
            <span>Public Gists</span>
            <strong>{user.public_gists.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="analysis-insights">
        <ContributionGraph username={user.login} />
        <div className="card-vignette analysis-chart-panel">
          <LanguageChart repos={repos} />
        </div>
        <div className="card-vignette analysis-timeline-panel">
          <TimelineChart repos={repos} />
        </div>
        <div className="card-vignette analysis-audit-panel">
          <RepoAuditPanel repos={repos} />
        </div>
        <div className="card-vignette analysis-repo-panel">
          <RepoList repos={repos} />
        </div>
      </div>
    </motion.div>
  );
}
