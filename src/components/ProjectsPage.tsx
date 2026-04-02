import { useEffect, useState } from 'react'
import PortfolioLayout from './portfolio/PortfolioLayout'
import ExperienceSection from './portfolio/ExperienceSection'
import ProjectsCarousel from './portfolio/ProjectsCarousel'
import SchoolSection from './portfolio/SchoolSection'
import CuriousSection from './portfolio/CuriousSection'

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
        position: 'fixed',
        inset: 0,
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1)',
      }}
    >
      <PortfolioLayout>
        <ExperienceSection />
        <ProjectsCarousel />
        <SchoolSection />
        <CuriousSection />
      </PortfolioLayout>
    </div>
  )
}
