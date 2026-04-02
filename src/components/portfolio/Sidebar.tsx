import MusicPlayer from './MusicPlayer'

interface NavItem {
  id: string
  label: string
  num: string
  subLink?: { label: string; href: string }
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'experience',
    label: 'Experience',
    num: '01',
    subLink: { label: 'Resume ↗', href: '#' },
  },
  {
    id: 'projects',
    label: 'Projects',
    num: '02',
    subLink: { label: 'GitHub ↗', href: 'https://github.com/' },
  },
  { id: 'school',  label: 'School',            num: '03' },
  { id: 'curious', label: 'If You Are Curious', num: '04' },
]

interface Props {
  activeSection: string
  scrollTo: (id: string) => void
  isDark: boolean
  toggleDark: () => void
}

const mutedColor = 'rgba(74, 63, 92, 0.5)'

export default function Sidebar({ activeSection, scrollTo, isDark, toggleDark }: Props) {
  return (
    <>
      {/* Dark mode toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button
          onClick={toggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            background: 'none',
            border: '1.5px solid rgba(74,63,92,0.2)',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '14px',
            cursor: 'pointer',
            color: 'var(--text-dark)',
            transition: 'border-color 0.2s',
          }}
        >
          {isDark ? '☀︎' : '☾'}
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1 }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    borderLeft: isActive
                      ? '3px solid var(--candy-pink)'
                      : '3px solid transparent',
                    backgroundColor: isActive ? 'rgba(249,197,209,0.15)' : 'transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1px',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: isActive ? 'var(--candy-pink)' : mutedColor,
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.num}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '14px',
                        color: 'var(--text-dark)',
                        transition: 'font-weight 0.1s',
                      }}
                    >
                      {item.label}
                    </span>
                  </span>

                  {item.subLink && (
                    <a
                      href={item.subLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontSize: '11px',
                        color: mutedColor,
                        marginLeft: '28px',
                        fontFamily: 'var(--font-body)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--candy-pink)')}
                      onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}
                    >
                      {item.subLink.label}
                    </a>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Music player */}
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
        <MusicPlayer />
      </div>

      {/* Social links */}
      <div
        style={{
          paddingTop: '1rem',
          display: 'flex',
          gap: '1rem',
          borderTop: '1px solid rgba(74,63,92,0.1)',
          marginTop: '1rem',
        }}
      >
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px',
            color: mutedColor,
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-dark)')}
          onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}
        >
          GitHub ↗
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px',
            color: mutedColor,
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-dark)')}
          onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}
        >
          LinkedIn ↗
        </a>
      </div>
    </>
  )
}
