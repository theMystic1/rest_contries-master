export function Nav({ isDark, onDarkMode }) {
  return (
    <nav className="nav">
      <p className="where">Where in the world?</p>
      <button className="dark-btn" onClick={onDarkMode}>
        <span>
          {isDark ? (
            <img src="./moon.svg" alt="moon" />
          ) : (
            <img src="/moon-outline.svg" alt="moon" />
          )}
        </span>
        Dark mode
      </button>
    </nav>
  );
}
