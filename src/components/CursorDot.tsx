import { useEffect, useRef } from 'react'
import inkayIdle  from '../assets/inkay_idle.gif'
import inkayPress from '../assets/inkay_press2.gif'

export default function CursorDot() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const wrap = wrapRef.current
    if (!wrap) return

    const target  = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let rafId = 0

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const onDown = () => wrap.setAttribute('data-pressed', '')
    const onUp   = () => wrap.removeAttribute('data-pressed')

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
      <img src={inkayIdle}  alt="" className="inkay-idle" />
      <img src={inkayPress} alt="" className="inkay-press" />
    </div>
  )
}
