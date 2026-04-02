import { useEffect, useState } from 'react'
import cloudKawaii from '../assets/cloud-kawaii.png'

interface CloudFloodProps {
  onPageSwap: () => void
  onComplete: () => void
}

const ROWS = 7
const ROW_DELAY = 70   // ms between rows
const ROW_DURATION = 480 // ms per row animation

// time for all rows to finish: (ROWS-1)*ROW_DELAY + ROW_DURATION
const COVER_DURATION = (ROWS - 1) * ROW_DELAY + ROW_DURATION // 900ms

export default function CloudFlood({ onPageSwap, onComplete }: CloudFloodProps) {
  const [phase, setPhase] = useState<'cover' | 'uncover'>('cover')

  useEffect(() => {
    const swapTimer = setTimeout(() => {
      onPageSwap()
      setPhase('uncover')
    }, COVER_DURATION + 180)

    const doneTimer = setTimeout(() => {
      onComplete()
    }, COVER_DURATION + 180 + COVER_DURATION)

    return () => {
      clearTimeout(swapTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: ROWS }).map((_, i) => {
        // bottom row (index 6) animates first → delay 0; top row (index 0) last → delay 420ms
        const delay = (ROWS - 1 - i) * ROW_DELAY
        const offsetX = i % 2 === 0 ? '0px' : '70px'

        return (
          <div
            key={`${phase}-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${(i / ROWS) * 100}%`,
              height: `${100 / ROWS}%`,
              backgroundImage: `url(${cloudKawaii})`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 100%',
              backgroundPosition: `${offsetX} 0`,
              animationName: phase === 'cover' ? 'cloudRowIn' : 'cloudRowOut',
              animationDuration: `${ROW_DURATION}ms`,
              animationDelay: `${delay}ms`,
              animationTimingFunction:
                phase === 'cover' ? 'cubic-bezier(0.34, 1.08, 0.64, 1)' : 'ease-in',
              animationFillMode: 'both',
            }}
          />
        )
      })}
    </div>
  )
}
