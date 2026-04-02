import { useEffect, useRef, useState } from 'react'

const CYCLE_WORDS = ['Creator.', 'Dreamer.', 'Maker.', 'Tinkerer.', 'Doer.', 'Creator.']

const BURST_COLORS = ['#f2cc00', '#e07820', '#cc3078', '#e85a28', '#f0a030']

// Spawns colored particles radiating outward from (cx, cy)
function spawnBurst(cx: number, cy: number) {
  const count = 18
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    const angle = (i / count) * Math.PI * 2
    const dist  = 45 + Math.random() * 65
    const size  = 4 + Math.random() * 6
    const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)]

    Object.assign(el.style, {
      position:      'fixed',
      left:          `${cx}px`,
      top:           `${cy}px`,
      width:         `${size}px`,
      height:        `${size}px`,
      borderRadius:  '50%',
      background:    color,
      pointerEvents: 'none',
      zIndex:        '500',
      transform:     'translate(-50%, -50%)',
      transition:    'transform 0.65s cubic-bezier(0.2, 0, 0.8, 1), opacity 0.65s ease',
      opacity:       '1',
    })

    document.body.appendChild(el)

    // Trigger on next frame so the transition fires
    requestAnimationFrame(() => {
      el.style.transform = `translate(
        calc(-50% + ${Math.cos(angle) * dist}px),
        calc(-50% + ${Math.sin(angle) * dist}px)
      )`
      el.style.opacity = '0'
    })

    setTimeout(() => el.remove(), 700)
  }
}

// Spawns a floating "👋 hi!" toast that rises and fades from (cx, cy)
function spawnToast(cx: number, cy: number) {
  const el = document.createElement('div')
  el.textContent = '👋 hi!'
  el.className = 'name-toast'
  el.style.cssText = `left:${cx}px;top:${cy}px;`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1600)
}

export default function HeroContent() {
  const [wordIdx,  setWordIdx]  = useState(0)
  const [fading,   setFading]   = useState(false)
  const [isEaster, setIsEaster] = useState(false)
  const easterTimer = useRef<ReturnType<typeof setTimeout>>()

  // Word cycling — changes last word every 2.8s
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setWordIdx(i => (i + 1) % CYCLE_WORDS.length)
        setFading(false)
      }, 280)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const handleNameClick = (e: React.MouseEvent) => {
    if (isEaster) return
    spawnBurst(e.clientX, e.clientY)
    spawnToast(e.clientX, e.clientY)
    setIsEaster(true)
    clearTimeout(easterTimer.current)
    easterTimer.current = setTimeout(() => setIsEaster(false), 1800)
  }

  return (
    <main className="hero-content">
      <div className="hero-eyebrow">
        <span>Portfolio</span>
        <span className="eyebrow-sep" aria-hidden="true">·</span>
        <span>2025</span>
      </div>

      <h1
        className={`hero-name${isEaster ? ' hero-name--easter' : ''}`}
        onClick={handleNameClick}
        title="psst — click me"
        style={{ cursor: 'inherit' }}
      >
        Samaksh
      </h1>

      <div className="hero-rule" aria-hidden="true" />

      <div className="hero-footer">
        <p className="hero-description">
          Builder.&nbsp;&nbsp;Thinker.&nbsp;&nbsp;<span
            className={`word-cycle${fading ? ' word-cycle--fading' : ''}`}
          >{CYCLE_WORDS[wordIdx]}</span>
        </p>
        <div className="hero-actions">
          <a href="#work" className="btn-primary">View My Work</a>
          <a href="#contact" className="btn-ghost">Get In Touch ↗</a>
        </div>
      </div>
    </main>
  )
}
