const ITEMS = [
  'Photography', '·', 'Filmmaking', '·', 'Bangladesh', '·', 'Fujifilm', '·',
  'Street', '·', 'Portrait', '·', 'Landscape', '·', '2026', '·',
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span
            key={i}
            className={`marquee-item${t === '·' ? ' accent' : ''}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
