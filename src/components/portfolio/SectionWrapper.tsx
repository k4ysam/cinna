import { useEffect, useRef, useState } from 'react'

interface Props {
  id: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function SectionWrapper({ id, children, style }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1)',
        paddingBottom: '4rem',
        ...style,
      }}
    >
      {children}
    </section>
  )
}
