import cinnamoroll from '../assets/cinnamoroll.png'

export default function KawaiiHero() {
  return (
    <div className="kawaii-stage">
      <img
        src={cinnamoroll}
        alt="Cinnamoroll"
        className="kawaii-character"
        draggable={false}
      />
      <h1 className="kawaii-name">Samaksh</h1>
    </div>
  )
}
