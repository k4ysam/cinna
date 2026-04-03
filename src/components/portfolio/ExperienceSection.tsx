import SectionWrapper from './SectionWrapper'

interface ExperienceEntry {
  company: string
  role: string
  dates: string
  bullets: string[]
  tags: string[]
}

const EXPERIENCE_DATA: ExperienceEntry[] = [
  {
    company: 'Acme Technologies',
    role: 'Software Engineering Intern',
    dates: 'May 2024 – Aug 2024',
    bullets: [
      'Built a real-time dashboard feature used by 10,000+ daily active users, reducing load time by 40%.',
      'Collaborated with a cross-functional team to migrate a legacy REST API to GraphQL.',
    ],
    tags: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
  },
  {
    company: 'Startup Co.',
    role: 'Full-Stack Developer Intern',
    dates: 'Sep 2023 – Dec 2023',
    bullets: [
      'Designed and shipped a mobile-first onboarding flow that improved conversion by 22%.',
      'Wrote unit and integration tests bringing coverage from 45% to 80%.',
    ],
    tags: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'Jest'],
  },
  {
    company: 'Research Lab',
    role: 'Undergraduate Research Assistant',
    dates: 'Jan 2023 – Apr 2023',
    bullets: [
      'Developed data pipeline scripts to process and visualize large economic datasets.',
      'Co-authored a research brief on consumer behaviour modelling with Python.',
    ],
    tags: ['Python', 'Pandas', 'Matplotlib', 'R'],
  },
]

const tag: React.CSSProperties = {
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  background: 'rgba(135, 206, 235, 0.2)',
  color: 'var(--text-dark)',
  fontFamily: 'var(--font-body)',
}

export default function ExperienceSection() {
  return (
    <SectionWrapper id="experience">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--text-dark)',
          marginBottom: '2rem',
        }}
      >
        Experience
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {EXPERIENCE_DATA.map((entry, i) => (
          <div key={entry.company}>
            <div style={{ paddingBottom: '2rem' }}>
              {/* Company */}
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  color: 'var(--text-dark)',
                  lineHeight: 1.2,
                  marginBottom: '4px',
                }}
              >
                {entry.company}
              </div>

              {/* Role + dates */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: 'var(--text-dark)',
                  }}
                >
                  {entry.role}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: 'rgba(74,63,92,0.5)',
                  }}
                >
                  {entry.dates}
                </span>
              </div>

              {/* Bullets */}
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {entry.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      lineHeight: 1.65,
                      color: 'var(--text-dark)',
                      listStyleType: 'disc',
                    }}
                  >
                    {b}
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {entry.tags.map(t => (
                  <span key={t} style={tag}>{t}</span>
                ))}
              </div>
            </div>

            {i < EXPERIENCE_DATA.length - 1 && (
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid rgba(249,197,209,0.4)',
                  marginBottom: '2rem',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
