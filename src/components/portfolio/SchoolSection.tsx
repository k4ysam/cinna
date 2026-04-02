import Accordion from './Accordion'
import SectionWrapper from './SectionWrapper'

const CS_COURSES = [
  'COMP 250 — Introduction to Computer Science',
  'COMP 251 — Algorithms and Data Structures',
  'COMP 302 — Programming Languages and Paradigms',
  'COMP 303 — Software Design',
  'COMP 330 — Theory of Computation',
  'COMP 421 — Database Systems',
  'COMP 424 — Artificial Intelligence',
  'COMP 551 — Applied Machine Learning',
]

const ECON_COURSES = [
  'ECON 208 — Microeconomic Analysis',
  'ECON 209 — Macroeconomic Analysis',
  'ECON 257 — Economic Statistics',
  'ECON 352D — Development Economics',
  'ECON 427 — Economics of Information',
]

const STATS_COURSES = [
  'MATH 323 — Probability',
  'MATH 324 — Statistics',
  'MATH 423 — Applied Regression',
  'MATH 447 — Introduction to Stochastic Processes',
]

interface Club {
  name: string
  description: string
  photos: [string | null, string | null]
}

const CLUBS: Club[] = [
  {
    name: 'McGill Coding Club',
    description: 'Organizing hackathons, workshops, and tech talks for CS students.',
    photos: [null, null],
  },
  {
    name: 'McGill Economics Society',
    description: 'Hosting case competitions, speaker panels, and economic research initiatives.',
    photos: [null, null],
  },
  {
    name: 'McGill Design Club',
    description: 'Exploring UI/UX, visual design, and creative projects across disciplines.',
    photos: [null, null],
  },
]

const courseItem: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  lineHeight: 1.7,
  color: 'var(--text-dark)',
  listStyleType: 'none',
  paddingLeft: '0',
}

export default function SchoolSection() {
  return (
    <SectionWrapper id="school">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--text-dark)',
          marginBottom: '4px',
        }}
      >
        School
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '15px',
          color: 'rgba(74,63,92,0.6)',
          marginBottom: '1.5rem',
        }}
      >
        McGill University
      </p>

      {/* Coursework accordions */}
      <Accordion title="Computer Science">
        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {CS_COURSES.map(c => <li key={c} style={courseItem}>{c}</li>)}
        </ul>
      </Accordion>

      <Accordion title="Economics">
        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {ECON_COURSES.map(c => <li key={c} style={courseItem}>{c}</li>)}
        </ul>
      </Accordion>

      <Accordion title="Statistics">
        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {STATS_COURSES.map(c => <li key={c} style={courseItem}>{c}</li>)}
        </ul>
      </Accordion>

      {/* Clubs */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          color: 'var(--text-dark)',
          margin: '2rem 0 1rem',
        }}
      >
        Clubs &amp; Activities
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {CLUBS.map(club => (
          <div
            key={club.name}
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(74,63,92,0.08)',
              overflow: 'hidden',
              background: 'var(--cloud)',
            }}
          >
            {/* Photo row */}
            <div style={{ display: 'flex', height: '80px' }}>
              {club.photos.map((photo, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background:
                      i === 0
                        ? 'linear-gradient(135deg, rgba(168,200,240,0.4), rgba(249,197,209,0.4))'
                        : 'linear-gradient(135deg, rgba(249,197,209,0.4), rgba(255,179,217,0.4))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: 'rgba(74,63,92,0.35)',
                    fontFamily: 'var(--font-body)',
                    borderRight: i === 0 ? '1px solid rgba(74,63,92,0.06)' : 'none',
                  }}
                >
                  {photo
                    ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : 'photo'}
                </div>
              ))}
            </div>

            {/* Club info */}
            <div style={{ padding: '12px 14px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                  fontSize: '13px',
                  color: 'var(--text-dark)',
                  marginBottom: '4px',
                }}
              >
                {club.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: 'rgba(74,63,92,0.65)',
                }}
              >
                {club.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
