import { useRef, useState } from 'react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { useDarkMode } from '../../hooks/useDarkMode'
import Sidebar from './Sidebar'

const SECTION_IDS = ['experience', 'projects', 'school', 'curious']

interface Props {
  children: React.ReactNode
}

export default function PortfolioLayout({ children }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeSection = useScrollSpy(SECTION_IDS, scrollContainerRef)
  const [isDark, toggleDark] = useDarkMode()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function scrollTo(id: string) {
    const container = scrollContainerRef.current
    const target = document.getElementById(id)
    if (!container || !target) return
    container.scrollTo({
      top: target.offsetTop - 32,
      behavior: 'smooth',
    })
    setMobileMenuOpen(false)
  }

  return (
    <div className="portfolio-layout">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileMenuOpen(o => !o)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 200,
          background: 'var(--candy-pink)',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 10px',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
        }}
        className="mobile-hamburger"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className="portfolio-sidebar"
        style={
          mobileMenuOpen
            ? { position: 'fixed', inset: '0 auto 0 0', zIndex: 150, background: 'var(--cloud)', width: '260px', display: 'flex' }
            : undefined
        }
      >
        <Sidebar
          activeSection={activeSection}
          scrollTo={scrollTo}
          isDark={isDark}
          toggleDark={toggleDark}
        />
      </div>

      {/* Overlay to close menu on mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 140,
          }}
        />
      )}

      {/* Scrollable content */}
      <div ref={scrollContainerRef} className="portfolio-scroll">
        {children}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .portfolio-sidebar { display: none !important; }
          .portfolio-sidebar[style*="position: fixed"] { display: flex !important; }
          .mobile-hamburger { display: block !important; }
          .portfolio-scroll { padding: 3rem 1.5rem 6rem !important; }
        }
      `}</style>
    </div>
  )
}
