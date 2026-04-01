export default function HeroContent() {
  return (
    <main className="hero-content">
      <div className="hero-eyebrow">
        <span>Portfolio</span>
        <span className="eyebrow-sep" aria-hidden="true">·</span>
        <span>2025</span>
      </div>

      <h1 className="hero-name">Samaksh</h1>

      <div className="hero-rule" aria-hidden="true" />

      <div className="hero-footer">
        <p className="hero-description">
          Builder.&nbsp;&nbsp;Thinker.&nbsp;&nbsp;Creator.
        </p>
        <div className="hero-actions">
          <a href="#work" className="btn-primary">View My Work</a>
          <a href="#contact" className="btn-ghost">Get In Touch ↗</a>
        </div>
      </div>
    </main>
  )
}
