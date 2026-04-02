import { useState } from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

export default function Accordion({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid rgba(74,63,92,0.1)',
        overflow: 'hidden',
        marginBottom: '8px',
      }}
    >
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          background: 'rgba(74,63,92,0.04)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '14px',
          color: 'var(--text-dark)',
          textAlign: 'left',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,197,209,0.15)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(74,63,92,0.04)')}
        aria-expanded={isOpen}
      >
        {title}
        <span
          style={{
            display: 'inline-block',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s var(--spring-kawaii)',
            fontSize: '12px',
            opacity: 0.6,
          }}
        >
          ▾
        </span>
      </button>

      <div
        style={{
          maxHeight: isOpen ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <div style={{ padding: '14px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
