import { useEffect, useState } from 'react'
import { audio, TRACKS, changeTrack, currentTrackIndex } from '../audio'

interface Props {
  visible: boolean
}

const arrowBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-dark)',
  opacity: 0.55,
  fontSize: '18px',
  lineHeight: 1,
  padding: '2px 6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.15s',
  flexShrink: 0,
}

export default function HeroMusicPlayer({ visible }: Props) {
  const [trackIndex, setTrackIndex] = useState(currentTrackIndex)
  const [isPlaying, setIsPlaying]   = useState(!audio.paused)
  const [volume, setVolume]         = useState(audio.volume)
  const [dropUp, setDropUp]         = useState(false)

  useEffect(() => {
    const onPlay        = () => setIsPlaying(true)
    const onPause       = () => setIsPlaying(false)
    const onTrackChange = (e: Event) => setTrackIndex((e as CustomEvent<number>).detail)

    audio.addEventListener('play',        onPlay)
    audio.addEventListener('pause',       onPause)
    audio.addEventListener('trackchange', onTrackChange)

    return () => {
      audio.removeEventListener('play',        onPlay)
      audio.removeEventListener('pause',       onPause)
      audio.removeEventListener('trackchange', onTrackChange)
    }
  }, [])

  useEffect(() => { audio.volume = volume }, [volume])

  function togglePlay() {
    audio.paused ? audio.play().catch(() => {}) : audio.pause()
  }

  const track = TRACKS[trackIndex]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 40,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Drop-up track list */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: '8px',
          background: 'rgba(245, 239, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '6px',
          boxShadow: '0 4px 20px rgba(74, 63, 92, 0.18)',
          minWidth: '220px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          opacity: dropUp ? 1 : 0,
          transform: dropUp ? 'translateY(0)' : 'translateY(6px)',
          pointerEvents: dropUp ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        {TRACKS.map((t, i) => (
          <button
            key={i}
            onClick={() => { changeTrack(i); setDropUp(false) }}
            style={{
              background: i === trackIndex ? 'rgba(249,197,209,0.35)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => {
              if (i !== trackIndex) e.currentTarget.style.background = 'rgba(74,63,92,0.06)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = i === trackIndex ? 'rgba(249,197,209,0.35)' : 'transparent'
            }}
          >
            <span style={{ fontSize: '11px', opacity: 0.5 }}>{i === trackIndex ? '▶' : '♪'}</span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: i === trackIndex ? 700 : 500,
                fontSize: '13px',
                color: 'var(--text-dark)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {t.title}
            </span>
          </button>
        ))}
      </div>

      {/* Main widget */}
      <div
        style={{
          minWidth: '220px',
          background: 'rgba(245, 239, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '16px',
          padding: '14px 16px',
          boxShadow: '0 4px 20px rgba(74, 63, 92, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* Up arrow */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setDropUp(o => !o)}
            aria-label={dropUp ? 'Close track list' : 'Open track list'}
            style={{
              ...arrowBtn,
              opacity: dropUp ? 0.9 : 0.45,
              transform: dropUp ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'opacity 0.15s, transform 0.25s ease',
              fontSize: '14px',
            }}
          >
            ▲
          </button>
        </div>

        {/* [‹]  Song Title  [›] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => changeTrack(trackIndex - 1)}
            aria-label="Previous"
            style={arrowBtn}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
          >
            ‹
          </button>

          <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                color: 'var(--text-dark)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
              }}
            >
              {track.title}
            </div>
            {track.artist && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-dark)', opacity: 0.55, marginTop: '2px' }}>
                {track.artist}
              </div>
            )}
          </div>

          <button
            onClick={() => changeTrack(trackIndex + 1)}
            aria-label="Next"
            style={arrowBtn}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
          >
            ›
          </button>
        </div>

        {/* Play/pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            background: 'var(--candy-pink)',
            border: 'none',
            borderRadius: '999px',
            padding: '8px 0',
            width: '100%',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        {/* Volume */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--candy-pink)', height: '3px' }}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}
