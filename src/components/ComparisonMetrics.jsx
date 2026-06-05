import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Repositories", key: "public_repos" },
  { label: "Followers", key: "followers" },
  { label: "Following", key: "following" },
  { label: "Gists", key: "public_gists" },
  { label: "Stars", key: "total_stars" },
  { label: "Forks", key: "total_forks" },
  { label: "Watchers", key: "total_watchers" },
  { label: "Final Score", key: "final_score", featured: true },
];

const formatNumber = (value) => Number(value || 0).toLocaleString();

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

function getWinner(profile1, profile2, key) {
  const value1 = profile1?.[key] || 0;
  const value2 = profile2?.[key] || 0;

  if (value1 > value2) return "first";
  if (value2 > value1) return "second";
  return "tie";
}

function ProfileSummary({ profile, username, side, isOverallWinner }) {
  return (
    <div className={`compare-profile-summary ${side}`}>
      <div className="compare-profile-main">
        <img
          src={profile.avatar_url}
          alt={`${profile.login}'s avatar`}
          referrerPolicy="no-referrer"
        />
        <div>
          <span className="compare-profile-kicker">{side}</span>
          <h3>{profile.name || profile.login}</h3>
          <a href={profile.html_url} target="_blank" rel="noreferrer">
            @{username}
          </a>
        </div>
      </div>

      <p>{profile.bio || "No bio available"}</p>

      <div className="compare-profile-stats">
        <span>
          <strong>{formatNumber(profile.public_repos)}</strong>
          repos
        </span>
        <span>
          <strong>{formatNumber(profile.followers)}</strong>
          followers
        </span>
        <span>
          <strong>{formatNumber(profile.final_score)}</strong>
          score
        </span>
      </div>

      {isOverallWinner && <div className="compare-win-chip">Top score</div>}
    </div>
  );
}

export default function ComparisonMetrics({ usernames, onExportReady }) {
  const [profile1, setProfile1] = useState(null);
  const [profile2, setProfile2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usernames.first || !usernames.second) {
      onExportReady?.(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      onExportReady?.(false);

      try {
        const [data1, data2] = await Promise.all([
          fetch(`https://api.github.com/users/${usernames.first}`).then((r) =>
            r.json()
          ),
          fetch(`https://api.github.com/users/${usernames.second}`).then((r) =>
            r.json()
          ),
        ]);

        if (data1.message || data2.message) {
          setProfile1(null);
          setProfile2(null);
          setError("One of these GitHub users could not be found.");
          return;
        }

        const [repos1, repos2] = await Promise.all([
          fetch(
            `https://api.github.com/users/${usernames.first}/repos?per_page=100`
          ).then((r) => r.json()),
          fetch(
            `https://api.github.com/users/${usernames.second}/repos?per_page=100`
          ).then((r) => r.json()),
        ]);

        if (!Array.isArray(repos1) || !Array.isArray(repos2)) {
          setProfile1(null);
          setProfile2(null);
          setError("GitHub did not return repository data for this comparison.");
          return;
        }

        const computeTotals = (repos) => ({
          total_stars: repos.reduce(
            (sum, repo) => sum + (repo.stargazers_count || 0),
            0
          ),
          total_forks: repos.reduce(
            (sum, repo) => sum + (repo.forks_count || 0),
            0
          ),
          total_watchers: repos.reduce(
            (sum, repo) => sum + (repo.watchers_count || 0),
            0
          ),
        });

        const totals1 = computeTotals(repos1);
        const totals2 = computeTotals(repos2);

        setProfile1({
          ...data1,
          ...totals1,
          final_score:
            totals1.total_stars + totals1.total_forks + totals1.total_watchers,
        });
        setProfile2({
          ...data2,
          ...totals2,
          final_score:
            totals2.total_stars + totals2.total_forks + totals2.total_watchers,
        });
        onExportReady?.(true);
      } catch (fetchError) {
        console.error("Error fetching profiles:", fetchError);
        setError("Could not load comparison data right now.");
        onExportReady?.(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [usernames, onExportReady]);

  const overallWinner = useMemo(() => {
    if (!profile1 || !profile2) return "tie";
    return getWinner(profile1, profile2, "final_score");
  }, [profile1, profile2]);

  if (loading) {
    return (
      <div className="comparison-metrics comparison-metrics--loading">
        <div className="skeleton"></div>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
      </div>
    );
  }

  if (error) {
    return <div className="comparison-error">{error}</div>;
  }

  if (!profile1 || !profile2) return null;

  return (
    <motion.div
      className="comparison-metrics comparison-scoreboard"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="comparison-scoreboard-header">
        <div>
          <span className="section-eyebrow">Profile comparison</span>
          <h2>
            {usernames.first} vs {usernames.second}
          </h2>
        </div>
        <div className="overall-result">
          <span>Winner</span>
          <strong>
            {overallWinner === "tie"
              ? "Tie"
              : overallWinner === "first"
              ? usernames.first
              : usernames.second}
          </strong>
        </div>
      </div>

      <div className="compare-summary-grid">
        <ProfileSummary
          profile={profile1}
          username={usernames.first}
          side="first"
          isOverallWinner={overallWinner === "first"}
        />
        <div className="compare-vs-pill">VS</div>
        <ProfileSummary
          profile={profile2}
          username={usernames.second}
          side="second"
          isOverallWinner={overallWinner === "second"}
        />
      </div>

      <div className="compare-table" aria-label="GitHub profile metrics">
        <div className="compare-table-head">
          <span>{usernames.first}</span>
          <span>Metric</span>
          <span>{usernames.second}</span>
        </div>

        {metrics.map((metric) => {
          const value1 = profile1[metric.key] || 0;
          const value2 = profile2[metric.key] || 0;
          const max = Math.max(value1, value2, 1);
          const firstWidth = `${(value1 / max) * 100}%`;
          const secondWidth = `${(value2 / max) * 100}%`;
          const winner = getWinner(profile1, profile2, metric.key);

          return (
            <div
              className={`compare-row ${
                metric.featured ? "compare-row--featured" : ""
              }`}
              key={metric.key}
            >
              <div className={`compare-value ${winner === "first" ? "is-leader" : ""}`}>
                <strong>{formatNumber(value1)}</strong>
                <div className="compare-bar compare-bar--left">
                  <span style={{ width: firstWidth }}></span>
                </div>
              </div>

              <div className="compare-label">{metric.label}</div>

              <div className={`compare-value ${winner === "second" ? "is-leader" : ""}`}>
                <strong>{formatNumber(value2)}</strong>
                <div className="compare-bar compare-bar--right">
                  <span style={{ width: secondWidth }}></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="compare-timeline">
        <div>
          <span>Created</span>
          <strong>{formatDate(profile1.created_at)}</strong>
          <small>{usernames.first}</small>
        </div>
        <div>
          <span>Updated</span>
          <strong>{formatDate(profile1.updated_at)}</strong>
          <small>{usernames.first}</small>
        </div>
        <div>
          <span>Created</span>
          <strong>{formatDate(profile2.created_at)}</strong>
          <small>{usernames.second}</small>
        </div>
        <div>
          <span>Updated</span>
          <strong>{formatDate(profile2.updated_at)}</strong>
          <small>{usernames.second}</small>
        </div>
      </div>
    </motion.div>
  );
}
