const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20">
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

const CheckIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20">
    <path d="m5 10 3 3 7-7" />
  </svg>
);

function App() {
  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow">
          <span className="status-dot" />
          Figma Make starter
        </div>

        <h1 id="page-title">
          Your canvas is
          <span>ready to build.</span>
        </h1>

        <p className="intro">
          A clean Vite and React foundation, configured for fast iteration,
          live preview, and static deployment.
        </p>

        <a className="primary-action" href="#setup">
          Explore the setup
          <ArrowIcon />
        </a>
      </section>

      <section className="setup-card" id="setup" aria-labelledby="setup-title">
        <div>
          <p className="section-label">Project foundation</p>
          <h2 id="setup-title">Everything in place</h2>
        </div>

        <ul>
          <li>
            <span className="check">
              <CheckIcon />
            </span>
            React application shell
          </li>
          <li>
            <span className="check">
              <CheckIcon />
            </span>
            Hot module replacement
          </li>
          <li>
            <span className="check">
              <CheckIcon />
            </span>
            Production-ready build
          </li>
        </ul>
      </section>
    </main>
  );
}

export default App;
