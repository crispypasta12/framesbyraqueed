const LINKS = [
  ['Photography', '#gallery'],
  ['Videography', '#video'],
  ['About', '#about'],
  ['Contact', '#contact'],
];

export default function Nav() {
  return (
    <nav className="portfolio-nav">
      <a href="#top" className="nav-logo">
        framesbyraqueed
      </a>
      <ul className="nav-links">
        {LINKS.map(([l, h]) => (
          <li key={l}>
            <a href={h}>{l}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
