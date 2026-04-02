import { ChevronDown } from 'lucide-react'

interface BouncingArrowProps {
  onClick: () => void
}

export default function BouncingArrow({ onClick }: BouncingArrowProps) {
  return (
    <button
      className="bouncing-arrow"
      onClick={onClick}
      aria-label="Scroll to projects"
    >
      <ChevronDown size={40} strokeWidth={2.5} />
    </button>
  )
}
