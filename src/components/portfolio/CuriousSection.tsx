import SectionWrapper from './SectionWrapper'

interface Hobby {
  icon: string
  label: string
}

const HOBBIES: Hobby[] = [
  { icon: '🎵', label: 'Music' },
  { icon: '✈️', label: 'Travel' },
  { icon: '📚', label: 'Reading' },
  { icon: '🎮', label: 'Gaming' },
  { icon: '🍜', label: 'Cooking' },
  { icon: '🎨', label: 'Design' },
  { icon: '🏃', label: 'Running' },
  { icon: '📷', label: 'Photography' },
]

const hobbyPill: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: '999px',
  border: '1.5px solid rgba(74,63,92,0.12)',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: '13px',
  color: 'var(--text-dark)',
  background: 'transparent',
  transition: 'background 0.2s, border-color 0.2s',
}

export default function CuriousSection() {
  return (
    <SectionWrapper id="curious">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--text-dark)',
          marginBottom: '1.5rem',
        }}
      >
        If You Are Curious
      </h2>

      {/* About me */}
      <div style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(74,63,92,0.5)',
            marginBottom: '12px',
          }}
        >
          About Me
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'var(--text-dark)',
            marginBottom: '12px',
          }}
        >
          I'm a student at McGill University studying Computer Science, Economics, and Statistics.
          I love building things that live at the intersection of technology and human experience —
          whether that's a slick web interface, a data pipeline, or a toy language model.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'var(--text-dark)',
          }}
        >
          When I'm not coding, you'll find me hunting for good matcha spots, overanalyzing
          album art, or convincing myself that one more side project is a great idea.
          I care a lot about craft — in software and in everything else.
        </p>
      </div>

      {/* Hobbies */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(74,63,92,0.5)',
            marginBottom: '12px',
          }}
        >
          Interests
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {HOBBIES.map(h => (
            <span
              key={h.label}
              style={hobbyPill}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLSpanElement
                el.style.background = 'rgba(249,197,209,0.2)'
                el.style.borderColor = 'rgba(249,197,209,0.6)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLSpanElement
                el.style.background = 'transparent'
                el.style.borderColor = 'rgba(74,63,92,0.12)'
              }}
            >
              {h.icon} {h.label}
            </span>
          ))}
        </div>
      </div>

      {/* Fake now-playing card */}
      <div style={{ marginBottom: '1rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(74,63,92,0.5)',
            marginBottom: '12px',
          }}
        >
          What I'm Listening To
        </h3>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: '#121212',
            borderRadius: '12px',
            padding: '12px 16px',
            maxWidth: '320px',
          }}
        >
          {/* Album art placeholder */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              flexShrink: 0,
              background: 'linear-gradient(135deg, #1db954 0%, #0a7d35 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            🎵
          </div>

          {/* Track info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: '#b3b3b3',
                fontSize: '10px',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              Now Playing
            </div>
            <div
              style={{
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Placeholder Song
            </div>
            <div
              style={{
                color: '#b3b3b3',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
              }}
            >
              Placeholder Artist
            </div>
          </div>

          {/* Animated bars */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '3px',
              height: '14px',
              flexShrink: 0,
            }}
          >
            <span className="playing-bar" />
            <span className="playing-bar" />
            <span className="playing-bar" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
