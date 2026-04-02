import { useEffect, useState } from 'react'
import { ProjectShowcase } from './ui/project-showcase'

interface ProjectsPageProps {
  revealed: boolean
}

export default function ProjectsPage({ revealed }: ProjectsPageProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setAnimate(true), 40)
      return () => clearTimeout(t)
    }
  }, [revealed])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8d5f5 0%, #d5e8f5 50%, #f5d5e8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1)',
      }}
    >
      <ProjectShowcase />
    </div>
  )
}
