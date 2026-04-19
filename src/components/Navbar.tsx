export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-logo">Hansika Jain</div>
      <ul className="navbar-links">
        <li>
          <a href="#works" data-cursor-hover className="outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm">Works</a>
        </li>
        <li>
          <a href="#about" data-cursor-hover className="outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm">About</a>
        </li>
        <li>
          <a href="#contact" data-cursor-hover className="outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm">Contact</a>
        </li>
      </ul>
    </nav>
  );
}
