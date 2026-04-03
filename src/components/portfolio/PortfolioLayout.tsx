import { useRef } from 'react'
import ShaderHeroPanel from './ShaderHeroPanel'

interface Props {
  children: React.ReactNode
}

export default function PortfolioLayout({ children }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="portfolio-layout">
      {/* Left — paper shader on top of cinnamoroll */}
      <ShaderHeroPanel />

      {/* Right — scrollable content */}
      <div ref={scrollContainerRef} className="portfolio-scroll">
        {children}
      </div>
    </div>
  )
}
