export default function About({ data }) {
  if (!data) return null;
  const stats = data.stats || [];

  return (
    <section className="section about" id="about">
      <div className="about-grid">
        <div className="about-visual reveal">
          <div className="about-frame"></div>
          <div className="about-visual-inner">
            <div className="about-monogram">L<span style={{color:'#d4a64a'}}>G</span></div>
            <div className="about-monogram-sub">Lady Glow · Atelier</div>
          </div>
        </div>

        <div className="about-text reveal">
          <div className="section-eyebrow"><div className="diamond"></div>{data.eyebrow}</div>
          <h2>{data.title} <em>{data.title_accent}</em> {data.title_end}</h2>
          <p dangerouslySetInnerHTML={{ __html: data.text1 }}></p>
          <p dangerouslySetInnerHTML={{ __html: data.text2 }}></p>

          <div className="about-stats">
            {stats.map((s, i) => (
              <div className="about-stat" key={i}>
                <div className="about-stat-num">
                  {s.num}
                  {s.label.includes('opinii') && <i className="ti ti-star-filled" style={{fontSize:24, verticalAlign:'middle', marginLeft:4}}></i>}
                </div>
                <div className="about-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
