import { useEffect, useRef } from 'react'

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    if (!dot) return

    const target  = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let rafId = 0

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY

      // Hover detection via event target — no per-element listeners needed
      const el = e.target as HTMLElement
      if (el.closest('a, button, [role="button"]')) {
        dot.setAttribute('data-hover', '')
      } else {
        dot.removeAttribute('data-hover')
      }
    }

    const onDown = () => dot.setAttribute('data-pressed', '')
    const onUp   = () => dot.removeAttribute('data-pressed')

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)

    function loop() {
      current.x = lerp(current.x, target.x, 0.14)
      current.y = lerp(current.y, target.y, 0.14)
      dot!.style.transform =
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

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
}
