const SOCIAL = [
  ['Instagram', 'https://instagram.com/framesbyraqueed'],
  ['YouTube', 'https://youtube.com/@framesbyraqueed'],
  ['Behance', 'https://behance.net/framesbyraqueed'],
  ['Mail', 'mailto:framesbyraqueed@gmail.com'],
];

export default function Footer() {
  return (
    <footer id="contact" className="portfolio-footer">
      <span className="footer-logo">framesbyraqueed</span>
      <div className="social-links">
        {SOCIAL.map(([s, h]) => (
          <a key={s} href={h} target="_blank" rel="noopener noreferrer">
            {s}
          </a>
        ))}
      </div>
      <span className="footer-copy">© 2026 Syed Raqueed Bin Alvee</span>
    </footer>
  );
}
