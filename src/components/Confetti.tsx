import { useEffect, useRef } from 'react'

// Approximate brand palette as canvas-compatible hex values
const COLORS = ['#f2cc00', '#e07820', '#cc3078', '#e85a28', '#f0a030', '#fabb2a']

interface Particle {
  x: number; y: number
  vx: number; vy: number
  w: number; h: number
  color: string
  alpha: number
  rot: number; vr: number
}

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = Array.from({ length: 65 }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     -20 - Math.random() * 180,
      vx:    (Math.random() - 0.5) * 6,
      vy:    2.5 + Math.random() * 4,
      w:     4  + Math.random() * 7,
      h:     6  + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      rot:   Math.random() * Math.PI * 2,
      vr:    (Math.random() - 0.5) * 0.14,
    }))

    let rafId = 0
    let start = 0
    const DURATION = 2800

    function draw(ts: number) {
      if (!start) start = ts
      const elapsed = ts - start

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      for (const p of particles) {
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.07
        p.vx *= 0.994
        p.rot += p.vr
        p.alpha = Math.max(0, 1 - elapsed / DURATION)

        if (p.alpha > 0.01) {
          alive = true
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
        }
      }

      if (alive) rafId = requestAnimationFrame(draw)
    }

    // Fire after entrance animations have landed
    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(draw)
    }, 1300)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}
    />
  )
}
