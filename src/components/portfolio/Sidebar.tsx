import { useState } from 'react'
import MusicPlayer from './MusicPlayer'

type ThemeKey = 'default' | 'slate' | 'sage' | 'peach' | 'noir'

interface Theme {
  name: string
  cloud: string
  accent: string
  textDark: string
}

const THEMES: Record<ThemeKey, Theme> = {
  default: { name: 'Default', cloud: '#F5EFFF', accent: '#F9C5D1', textDark: '#4a3f5c' },
  slate:   { name: 'Slate',   cloud: '#F0F2F5', accent: '#6B7FD4', textDark: '#1e2235' },
  sage:    { name: 'Sage',    cloud: '#F0F4F0', accent: '#7FAE8E', textDark: '#2d3d2e' },
  peach:   { name: 'Peach',   cloud: '#FEF3EE', accent: '#E8845A', textDark: '#3d2218' },
  noir:    { name: 'Noir',    cloud: '#161618', accent: '#E2E2E2', textDark: '#f0f0f0' },
}

function applyTheme(key: ThemeKey) {
  const theme = THEMES[key]
  const root = document.documentElement
  root.style.setProperty('--cloud', theme.cloud)
  root.style.setProperty('--candy-pink', theme.accent)
  root.style.setProperty('--text-dark', theme.textDark)
  root.setAttribute('data-theme', key)
}

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
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('default')

  function handleTheme(key: ThemeKey) {
    applyTheme(key)
    setActiveTheme(key)
  }

  return (
    <>
      {/* Theme swatches + icon-only dark mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '2rem' }}>
        {(Object.keys(THEMES) as ThemeKey[]).map(key => (
          <button
            key={key}
            onClick={() => handleTheme(key)}
            aria-label={THEMES[key].name}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: THEMES[key].accent,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
              outline: activeTheme === key ? `2px solid ${THEMES[key].accent}` : 'none',
              outlineOffset: '2px',
              transition: 'outline 0.15s ease',
            }}
          />
        ))}

        {/* Sun / Moon icon-only toggle */}
        <button
          role="switch"
          aria-checked={isDark}
          onClick={toggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'var(--text-dark)',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.6,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
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
