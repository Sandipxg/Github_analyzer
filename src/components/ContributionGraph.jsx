export default function ContributionGraph({ username }) {
  if (!username) return null;

  return (
    <div className="card-vignette contribution-graph-card">
      <h3>GitHub Activity Calendar</h3>
      <div className="contribution-graph-wrapper">
        <img
          src={`https://ghchart.rshah.org/238636/${username}`}
          alt={`${username}'s GitHub contribution calendar`}
          className="contribution-graph-img"
          crossOrigin="anonymous"
          loading="lazy"
        />
      </div>
    </div>
  );
}
