import { useRef, useState } from 'react'
import ShaderHeroPanel from './ShaderHeroPanel'
import { useDarkMode } from '../../hooks/useDarkMode'

type ThemeKey = 'default' | 'slate' | 'sage' | 'peach' | 'noir'

const THEMES: Record<ThemeKey, { name: string; accent: string; cloud: string; textDark: string }> = {
  default: { name: 'Default', accent: '#F9C5D1', cloud: '#F5EFFF', textDark: '#4a3f5c' },
  slate:   { name: 'Slate',   accent: '#6B7FD4', cloud: '#F0F2F5', textDark: '#1e2235' },
  sage:    { name: 'Sage',    accent: '#7FAE8E', cloud: '#F0F4F0', textDark: '#2d3d2e' },
  peach:   { name: 'Peach',   accent: '#E8845A', cloud: '#FEF3EE', textDark: '#3d2218' },
  noir:    { name: 'Noir',    accent: '#E2E2E2', cloud: '#161618', textDark: '#f0f0f0' },
}

function applyTheme(key: ThemeKey) {
  const t = THEMES[key]
  const root = document.documentElement
  root.style.setProperty('--cloud', t.cloud)
  root.style.setProperty('--candy-pink', t.accent)
  root.style.setProperty('--text-dark', t.textDark)
  root.setAttribute('data-theme', key)
}

interface Props {
  children: React.ReactNode
}

export default function PortfolioLayout({ children }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDark, toggleDark] = useDarkMode()
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('default')

  function handleTheme(key: ThemeKey) {
    applyTheme(key)
    setActiveTheme(key)
  }

  return (
    <div className="portfolio-layout">
      {/* Left — paper shader on top of cinnamoroll */}
      <ShaderHeroPanel />

      {/* Right — scrollable content */}
      <div ref={scrollContainerRef} className="portfolio-scroll" style={{ position: 'relative' }}>

        {/* Swatches + icon-only toggle — sticky top-right */}
        <div
          style={{
            position: 'sticky',
            top: '1.5rem',
            float: 'right',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* 5 theme swatches */}
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

        {children}
      </div>
    </div>
  )
}
