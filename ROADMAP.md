# 🗺️ Product Roadmap

This roadmap outlines the planned enhancements and future directions for the **GitHub Profile Analyzer & Comparer**.

---

## Phase 1: Performance & Rate Limit Shield (Short-Term)

* [ ] **GitHub Personal Access Token (PAT) Support**: Add an optional settings input allowing users to provide a PAT. This upgrades their rate limits from 60 requests/hour to 5,000 requests/hour.
* [ ] **Session Caching**: Cache fetched profiles and repository lists in `sessionStorage` or `localStorage` to prevent duplicate API queries upon returning to recently viewed profiles.
* [ ] **Advanced Error Recovery**: Provide descriptive error screens when rate limits are hit, including countdown timers showing when the limit resets.

---

## Phase 2: Analytics Enrichment & Deep Diagnostics (Medium-Term)

* [ ] **Code Frequency Breakdown**: Expand the repository analyzer to evaluate commit frequencies and monthly coding intensity.
* [ ] **Issue & PR Analytics**: Fetch and display metrics regarding public PR contributions, issue resolutions, and open-source collaboration metrics.
* [ ] **Shareable Comparison URLs**: Encode compared usernames in URL query parameters (e.g. `/compare?u1=userA&u2=userB`) so users can share direct comparison results.

---

## Phase 3: Advanced Exporters & Team Features (Long-Term)

* [ ] **PDF Template Customization**: Introduce a PDF settings builder allowing users to choose print layouts (one-page resume style vs. multi-page report style).
* [ ] **Team Dashboards**: Allow aggregating up to 5-10 developer profiles simultaneously to audit collective repository qualities or team stats.
* [ ] **Browser Extension**: Build a companion browser extension that adds a "GPA Dashboard" shortcut button directly to GitHub user profiles.
