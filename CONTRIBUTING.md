# 🤝 Contributing to GitHub Profile Analyzer

Thank you for considering contributing to the GitHub Profile Analyzer & Comparer! We want to make contributing to this project as easy and transparent as possible.

---

## 1. Local Development Setup

To start developing locally:

1. **Fork the Repository** on GitHub.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Github_analyzer.git
   cd Github_analyzer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the local dev server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** and navigate to `http://localhost:5173`.

---

## 2. Coding Conventions

To keep the codebase clean and maintainable, we enforce the following conventions:

* **Semicolons**: Do not use semicolons at the end of statements.
* **Quotes**: Use single quotes (`'`) instead of double quotes (`"`) for strings (except in JSX attributes).
* **Indentation**: Use **2 spaces** for indentation. No tabs.
* **Component Exports**: Use named exports or default components in functional form:
  ```javascript
  export default function MyComponent() {
    return <div>Content</div>
  }
  ```
* **CSS Properties**: Style components using Vanilla CSS and reference global variables (e.g. `var(--accent-blue)`) to ensure Light/Dark mode compatibility. Do not hardcode colors in stylesheets.

---

## 3. Linting

Before pushing your changes, run the linter to verify formatting and detect syntax issues:

```bash
npm run lint
```

If the linter reports warnings or errors, resolve them before submitting your pull request.

---

## 4. Pull Request Guidelines

1. **Create a Feature Branch** off `main` for your modifications:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit with Conventional Commits** rules:
   * `feat:` new feature
   * `fix:` bug fix
   * `refactor:` code restructuring without feature/fix
   * `docs:` documentation updates
   * `style:` layout or formatting updates
   Example: `feat(pdf): add custom download page header`
3. **Push to your fork** and open a Pull Request (PR) to the `main` branch of the upstream repository.
4. **Describe your changes**: Explain *why* you are making the change, what issues it resolves, and provide screenshots or animations of any visual changes.
