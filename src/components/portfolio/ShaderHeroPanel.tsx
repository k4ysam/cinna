import { Dithering } from '@paper-design/shaders-react'
import cinnamoroll from '../../assets/cinnamoroll.png'

export default function ShaderHeroPanel() {
  return (
    <div className="portfolio-shader-panel">
      {/* Base image */}
      <img
        src={cinnamoroll}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Dithering shader — multiply blends the halftone pattern onto the image */}
      <Dithering
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'multiply',
        }}
        colorBack="hsl(0, 0%, 100%)"
        colorFront="hsl(320, 55%, 45%)"
        shape="circle"
        type="4x4"
        size={4}
        speed={0.2}
        scale={0.9}
      />
    </div>
  )
}
