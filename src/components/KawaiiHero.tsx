import cinnamoroll from '../assets/cinnamoroll.png'
import samakshBg   from '../assets/samaksh-bg.png'

export default function KawaiiHero() {
  return (
    <div className="kawaii-stage">
      {/* Samaksh scene — sweeps over the initial sky bg left→right */}
      <div className="scene-bg" style={{ backgroundImage: `url(${samakshBg})` }} />

      {/* Cinnamoroll — small bobbing icon, top-left */}
      <img
        src={cinnamoroll}
        alt="Cinnamoroll"
        className="kawaii-character"
        draggable={false}
      />
    </div>
  )
}
