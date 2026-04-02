import cloudKawaii from '../assets/cloud-kawaii.png'

interface CloudFloodProps {
  onComplete: () => void
}

const COLS = 3
const ROWS = 5

export default function CloudFlood({ onComplete }: CloudFloodProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        backgroundColor: '#A8C8F0',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          width: '110%',
          marginLeft: '-5%',
          animation: 'cloudRush 1.05s ease-in forwards',
        }}
        onAnimationEnd={onComplete}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <img
            key={i}
            src={cloudKawaii}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: 'auto',
              mixBlendMode: 'screen',
              display: 'block',
            }}
          />
        ))}
      </div>
    </div>
  )
}
