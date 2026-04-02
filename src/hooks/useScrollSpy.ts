import { useEffect, useRef, useState, type RefObject } from 'react'

export function useScrollSpy(
  sectionIds: string[],
  scrollContainerRef: RefObject<HTMLElement | null>
): string {
  const [active, setActive] = useState(sectionIds[0] ?? '')
  // Keep a stable reference to the ids array
  const idsRef = useRef(sectionIds)

  useEffect(() => {
    const root = scrollContainerRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      {
        root,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    )

    idsRef.current.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  // scrollContainerRef is stable; idsRef avoids re-running on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef])

  return active
}
