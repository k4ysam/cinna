import { useEffect, useRef, useState } from 'react'

export default function NavBar() {
  const clickCount = useRef(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>()
  const [partying, setPartying] = useState(false)

  useEffect(() => {
    // Easter egg for devs who open DevTools
    console.log(
      '%c S. ',
      'background:#f2cc00;color:#1a0800;font-size:20px;font-weight:bold;padding:4px 10px;border-radius:6px;'
    )
    console.log(
      '%chey dev 👋  curious about the build? always open to interesting collabs.',
      'color:#e07820;font-size:13px;'
    )
  }, [])

  const handleLogoClick = () => {
    clickCount.current++
    clearTimeout(resetTimer.current)

    if (clickCount.current >= 3) {
      clickCount.current = 0
      setPartying(true)
      console.log('%c🎉 you found the egg!  three taps — nice one.', 'color:#cc3078;font-size:15px;font-weight:bold;')
      setTimeout(() => setPartying(false), 1400)
      return
    }

    // Reset click count if they go quiet for 1.5s
    resetTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 1500)
  }

  return (
    <nav className="navbar">
      <div
        className={`navbar-logo${partying ? ' navbar-logo--party' : ''}`}
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleLogoClick()}
        title="click me 3 times..."
      >
        S.
      </div>
      <ul className="navbar-links">
        <li><a href="#about">About</a></li>
        <li><a href="#work">Work</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  )
}
