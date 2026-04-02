import { useEffect, useRef, useState } from 'react'
import inkayIdle  from '../assets/inkay_idle.gif'
import inkayPress from '../assets/inkay_press2.gif'

// idle canvas: 68×61  — sprite fills most of it
// press canvas: 192×192 — sprite is similarly sized but in a larger canvas
// Scale press so its sprite appears the same visual size: 48 × (192/68) ≈ 136px
const IDLE_SIZE  = 48
const PRESS_SIZE = Math.round(48 * (192 / 68)) // 136px

const imgBase: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'block',
}

export default function CursorDot() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const wrap = wrapRef.current
    if (!wrap) return

    const target  = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let rafId = 0

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMove = (e: MouseEvent) => { target.x = e.clientX; target.y = e.clientY }

    const onDown = () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
      setPressed(true)
      timeoutRef.current = setTimeout(() => {
        setPressed(false)
        timeoutRef.current = null
      }, 800)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)

    function loop() {
      current.x = lerp(current.x, target.x, 0.14)
      current.y = lerp(current.y, target.y, 0.14)
      wrap!.style.transform =
        `translate(calc(${current.x}px - 50%), calc(${current.y}px - 50%))`
      rafId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      cancelAnimationFrame(rafId)
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div ref={wrapRef} className="inkay-cursor" aria-hidden="true">
      {pressed ? (
        <img
          src={inkayPress}
          alt=""
          style={{
            ...imgBase,
            width:  `${PRESS_SIZE}px`,
            height: 'auto',
            transform: `translate(-50%, -50%)`,
          }}
        />
      ) : (
        <img
          src={inkayIdle}
          alt=""
          style={{
            ...imgBase,
            width:  `${IDLE_SIZE}px`,
            height: 'auto',
            transform: `translate(-50%, -50%)`,
          }}
        />
      )}
    </div>
  )
}
