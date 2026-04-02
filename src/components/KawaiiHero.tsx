import cinnamoroll from '../assets/cinnamoroll.png'
import cloudKawaii from '../assets/cloud-kawaii.png'
import samakshBg   from '../assets/samaksh-bg.png'

export default function KawaiiHero() {
  return (
    <div className="kawaii-stage">
      {/* Background scene — mask sweeps left→right to reveal name */}
      <div className="scene-bg" style={{ backgroundImage: `url(${samakshBg})` }} />

      {/* Background depth clouds */}
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-bg-left"  draggable={false} />
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-bg-right" draggable={false} />

      {/* Foreground depth clouds */}
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-fg-left"  draggable={false} />
      <img src={cloudKawaii} alt="" className="cloud-layer cloud-fg-right" draggable={false} />

      {/* Cinnamoroll — drops after clouds settle */}
      <img
        src={cinnamoroll}
        alt="Cinnamoroll"
        className="kawaii-character"
        draggable={false}
      />
    </div>
  )
}
