const ENTRIES = [
  ['Fuji', 'Film Simulation'],
  ['Street', '& Portrait'],
  ['Travel', '& Everyday'],
  ['Bangladesh', 'Home Base'],
];

export default function Stats() {
  return (
    <div className="stats fi">
      {ENTRIES.map(([n, l]) => (
        <div key={l} className="stat">
          <div className="stat-num">{n}</div>
          <div className="stat-label">{l}</div>
        </div>
      ))}
    </div>
  );
}
