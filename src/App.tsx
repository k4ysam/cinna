import { useState } from 'react'
import KawaiiHero from './components/KawaiiHero'
import BouncingArrow from './components/BouncingArrow'
import CloudFlood from './components/CloudFlood'
import ProjectsPage from './components/ProjectsPage'
import CursorDot from './components/CursorDot'
import Confetti from './components/Confetti'
import './App.css'

type Page = 'hero' | 'projects'

function App() {
  const [page, setPage] = useState<Page>('hero')
  const [flooding, setFlooding] = useState(false)

  function handleArrowClick() {
    if (flooding) return
    setFlooding(true)
  }

  function handlePageSwap() {
    setPage('projects')
  }

  function handleFloodComplete() {
    setFlooding(false)
  }

  return (
    <>
      <CursorDot />
      {page === 'hero' && !flooding && <Confetti />}

      {page === 'hero' && (
        <>
          <KawaiiHero />
          <BouncingArrow onClick={handleArrowClick} />
        </>
      )}

      {page === 'projects' && <ProjectsPage revealed={!flooding} />}

      {flooding && page === 'hero' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            backgroundColor: '#A8C8F0',
            animation: 'heroFadeBlue 900ms ease forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {flooding && (
        <CloudFlood
          onPageSwap={handlePageSwap}
          onComplete={handleFloodComplete}
        />
      )}
    </>
  )
}

export default App
