import { useEffect, useState } from 'react'
import cinnamoroll from '../assets/cinnamoroll.png'
import samakshBg from '../assets/samaksh-bg.png'
import skaterGif from '../assets/cinnamoroll-skate.gif'

const FULL_TEXT = "hey I am Samaksh.\nI like to experiment."
const CHAR_DELAY = 65 // ms per character

export default function KawaiiHero() {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(FULL_TEXT.slice(0, i))
      if (i >= FULL_TEXT.length) clearInterval(interval)
    }, CHAR_DELAY)
    return () => clearInterval(interval)
  }, [])

  const lines = typed.split('\n')

  return (
    <div className="kawaii-stage">
      {/* Samaksh scene — sweeps over the initial sky bg left→right */}
      <div className="scene-bg" style={{ backgroundImage: `url(${samakshBg})` }} />

      {/* Cinnamoroll — small bobbing icon, top-left */}
      <img
        src={cinnamoroll}
        alt="Cinnamoroll"
        className="kawaii-character"
        draggable={false}
      />

      {/* Typewriter text block */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(3.5rem, 18vh, 6rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'left',
          whiteSpace: 'nowrap',
        }}
      >
        {lines.map((line, idx) => {
          const isLast = idx === lines.length - 1
          return (
            <div
              key={idx}
              style={{
                fontFamily: "'Nunito', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)',
                color: 'var(--text-dark)',
                textShadow: '0 2px 10px rgba(255,255,255,0.6)',
                lineHeight: 1.35,
              }}
            >
              {line}
              {isLast && (typed.length > 0) && (
                <img
                  src={skaterGif}
                  alt=""
                  draggable={false}
                  style={{
                    height: '2em',
                    marginLeft: '4px',
                    verticalAlign: 'middle',
                    // hide until we've started typing the second line or always show on last line
                    display: 'inline',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
