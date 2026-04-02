import { useEffect, useRef, useState } from 'react'
import inkayIdle  from '../assets/inkay_idle.gif'
import inkayPress from '../assets/inkay_press2.gif'

export default function CursorDot() {
  const wrapRef  = useRef<HTMLDivElement>(null)
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
    const onDown = () => setPressed(true)
    const onUp   = () => setPressed(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)

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
      document.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={wrapRef} className="inkay-cursor" aria-hidden="true">
      <img
        src={pressed ? inkayPress : inkayIdle}
        alt=""
        style={{ width: '48px', height: '48px', display: 'block' }}
      />
    </div>
  )
}
