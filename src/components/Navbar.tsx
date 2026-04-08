export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Hansika Jain</div>
      <ul className="navbar-links">
        <li>
          <a href="#works" data-cursor-hover>Works</a>
        </li>
        <li>
          <a href="#about" data-cursor-hover>About</a>
        </li>
        <li>
          <a href="#contact" data-cursor-hover>Contact</a>
        </li>
      </ul>
    </nav>
  );
}
