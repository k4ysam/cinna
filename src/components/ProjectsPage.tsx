import { ProjectShowcase } from './ui/project-showcase'

export default function ProjectsPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8d5f5 0%, #d5e8f5 50%, #f5d5e8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <ProjectShowcase />
    </div>
  )
}
