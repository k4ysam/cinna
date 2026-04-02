import { useRef, useState } from 'react'
import SectionWrapper from './SectionWrapper'

interface Project {
  name: string
  description: string
  image: string | null
  tags: string[]
}

const PROJECTS_DATA: Project[] = [
  {
    name: 'Project Alpha',
    description:
      'A full-stack web app for collaborative task management. Built with real-time sync and a clean, minimal interface.',
    image: null,
    tags: ['React', 'TypeScript', 'Socket.io', 'PostgreSQL'],
  },
  {
    name: 'Project Beta',
    description:
      'Machine learning pipeline for sentiment analysis on financial news. Achieved 87% accuracy on held-out test data.',
    image: null,
    tags: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
  },
  {
    name: 'Project Gamma',
    description:
      'Mobile-first e-commerce storefront with cart, checkout, and payment integration via Stripe.',
    image: null,
    tags: ['Next.js', 'Tailwind CSS', 'Stripe', 'Vercel'],
  },
  {
    name: 'Project Delta',
    description:
      'Open-source CLI tool for scaffolding TypeScript projects with opinionated defaults and zero config.',
    image: null,
    tags: ['Node.js', 'TypeScript', 'CLI', 'npm'],
  },
]

const CARD_WIDTH = 280
const CARD_GAP = 20

const tag: React.CSSProperties = {
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  background: 'rgba(255,179,217,0.25)',
  color: 'var(--text-dark)',
  fontFamily: 'var(--font-body)',
}

export default function ProjectsCarousel() {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const maxIndex = PROJECTS_DATA.length - 1

  function prev() { setIndex(i => Math.max(0, i - 1)) }
  function next() { setIndex(i => Math.min(maxIndex, i + 1)) }

  const offset = index * (CARD_WIDTH + CARD_GAP)

  return (
    <SectionWrapper id="projects">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--text-dark)',
          marginBottom: '1.5rem',
        }}
      >
        Projects
      </h2>

      {/* Carousel viewport */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          paddingBottom: '8px',
        }}
      >
        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            transform: `translateX(-${offset}px)`,
            transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            willChange: 'transform',
          }}
        >
          {PROJECTS_DATA.map((project, i) => (
            <div
              key={project.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: `${CARD_WIDTH}px`,
                flexShrink: 0,
                borderRadius: '16px',
                background: 'var(--cloud)',
                border: '1px solid rgba(74,63,92,0.08)',
                padding: '0',
                overflow: 'hidden',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow:
                  hovered === i
                    ? '0 12px 32px rgba(74,63,92,0.15)'
                    : '0 2px 8px rgba(74,63,92,0.06)',
                transition:
                  'transform 0.25s var(--spring-kawaii), box-shadow 0.25s ease',
              }}
            >
              {/* Image placeholder */}
              <div
                style={{
                  width: '100%',
                  height: '160px',
                  background: 'linear-gradient(135deg, rgba(168,200,240,0.4) 0%, rgba(249,197,209,0.4) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(74,63,92,0.3)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {project.image
                  ? <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : 'photo'}
              </div>

              {/* Card body */}
              <div style={{ padding: '16px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    color: 'var(--text-dark)',
                    marginBottom: '8px',
                    lineHeight: 1.2,
                  }}
                >
                  {project.name}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--text-dark)',
                    opacity: 0.8,
                    marginBottom: '12px',
                  }}
                >
                  {project.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {project.tags.map(t => (
                    <span key={t} style={tag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow buttons — overlaid at sides */}
        <button
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous project"
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--cloud)',
            border: '1px solid rgba(74,63,92,0.12)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: index === 0 ? 'default' : 'pointer',
            opacity: index === 0 ? 0.3 : 1,
            transition: 'opacity 0.2s',
            fontSize: '16px',
            color: 'var(--text-dark)',
            boxShadow: '0 2px 8px rgba(74,63,92,0.1)',
          }}
        >
          ‹
        </button>
        <button
          onClick={next}
          disabled={index === maxIndex}
          aria-label="Next project"
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--cloud)',
            border: '1px solid rgba(74,63,92,0.12)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: index === maxIndex ? 'default' : 'pointer',
            opacity: index === maxIndex ? 0.3 : 1,
            transition: 'opacity 0.2s',
            fontSize: '16px',
            color: 'var(--text-dark)',
            boxShadow: '0 2px 8px rgba(74,63,92,0.1)',
          }}
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '14px', justifyContent: 'center' }}>
        {PROJECTS_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to project ${i + 1}`}
            style={{
              width: i === index ? '20px' : '8px',
              height: '8px',
              borderRadius: '999px',
              background: i === index ? 'var(--candy-pink)' : 'rgba(74,63,92,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s var(--spring-kawaii)',
              padding: 0,
            }}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
