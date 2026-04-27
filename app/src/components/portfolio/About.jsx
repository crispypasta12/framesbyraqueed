const GEAR = [
  ['Fujifilm X100VI', 'Street & Everyday'],
  ['Fujifilm XT-30 ii', 'Travel & Landscape'],
  ['Fujifilm XH2S', 'Video & Motion'],
];

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-quote-wrap fi">
        <p className="about-quote">
          “Light is the first language. Everything else is translation —
          and I'm still learning to speak.”
          <cite>— Syed Raqueed Bin Alvee</cite>
        </p>
      </div>

      <div className="about-body">
        <div className="about-portrait fi">
          <img src="/about-portrait.jpg" alt="Syed Raqueed Bin Alvee" loading="lazy" decoding="async" />
          <div className="portrait-label">self-portrait, Dhaka</div>
        </div>
        <div className="about-text fi">
          <p>
            I'm Syed Raqueed Bin Alvee — a hobbyist photographer and
            filmmaker from Bangladesh. This is something I do for the love
            of it. No clients, no briefs, just me and whatever catches my
            eye.
          </p>
          <p>
            Whether it's the chaos of Sadarghat at dawn or the quiet gold
            of a Sylhet afternoon, I just want to hold onto moments that
            would otherwise disappear.
          </p>
          <p>
            I shoot on Fujifilm because the colors feel right and the
            cameras are a joy to carry. That's really all the reason I
            need.
          </p>
          <div className="gear-list">
            <div className="gear-label">Equipment</div>
            {GEAR.map(([n, u]) => (
              <div key={n} className="gear-row">
                <span className="gear-name">{n}</span>
                <span className="gear-use">{u}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
