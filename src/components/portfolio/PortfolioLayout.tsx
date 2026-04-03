import { useRef } from 'react'
import ShaderHeroPanel from './ShaderHeroPanel'
import { useDarkMode } from '../../hooks/useDarkMode'

interface Props {
  children: React.ReactNode
}

export default function PortfolioLayout({ children }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDark, toggleDark] = useDarkMode()

  return (
    <div className="portfolio-layout">
      {/* Left — paper shader on top of cinnamoroll */}
      <ShaderHeroPanel />

      {/* Right — scrollable content */}
      <div ref={scrollContainerRef} className="portfolio-scroll" style={{ position: 'relative' }}>
        {/* Dark mode toggle — fixed to top of right panel */}
        <button
          role="switch"
          aria-checked={isDark}
          onClick={toggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            position: 'sticky',
            top: '1.5rem',
            float: 'right',
            zIndex: 10,
            background: 'var(--cloud)',
            border: '1.5px solid rgba(74,63,92,0.2)',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            color: 'var(--text-dark)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s ease, border-color 0.2s ease, background 0.3s ease',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {isDark ? (
            <>
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
              Light
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark
            </>
          )}
        </button>

        {children}
      </div>
    </div>
  )
}
