import { useEffect, useState } from 'react'
import { audio, TRACKS, changeTrack, currentTrackIndex } from '../../audio'

const btn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'inherit',
  padding: '0 4px',
  fontSize: '14px',
  opacity: 0.7,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default function MusicPlayer() {
  const [trackIndex, setTrackIndex] = useState(currentTrackIndex)
  const [isPlaying, setIsPlaying]   = useState(!audio.paused)
  const [volume, setVolume]         = useState(audio.volume)
  const [loadError, setLoadError]   = useState(false)

  useEffect(() => {
    const onPlay        = () => setIsPlaying(true)
    const onPause       = () => setIsPlaying(false)
    const onError       = () => setLoadError(true)
    const onCanPlay     = () => setLoadError(false)
    const onTrackChange = (e: Event) => {
      setTrackIndex((e as CustomEvent<number>).detail)
      setLoadError(false)
    }

    audio.addEventListener('play',        onPlay)
    audio.addEventListener('pause',       onPause)
    audio.addEventListener('error',       onError)
    audio.addEventListener('canplay',     onCanPlay)
    audio.addEventListener('trackchange', onTrackChange)

    return () => {
      audio.removeEventListener('play',        onPlay)
      audio.removeEventListener('pause',       onPause)
      audio.removeEventListener('error',       onError)
      audio.removeEventListener('canplay',     onCanPlay)
      audio.removeEventListener('trackchange', onTrackChange)
    }
  }, [])

  useEffect(() => { audio.volume = volume }, [volume])

  function togglePlay() {
    if (loadError) return
    audio.paused ? audio.play().catch(() => {}) : audio.pause()
  }

  const track = TRACKS[trackIndex]

  return (
    <div
      style={{
        background: 'rgba(74, 63, 92, 0.06)',
        borderRadius: '12px',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        opacity: loadError ? 0.5 : 1,
      }}
    >
      <div style={{ fontSize: '12px', lineHeight: 1.3, overflow: 'hidden' }}>
        <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-dark)' }}>
          {loadError ? 'Unavailable' : track.title}
        </div>
        {track.artist && (
          <div style={{ opacity: 0.6, fontSize: '11px' }}>{track.artist}</div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <button onClick={() => changeTrack(trackIndex - 1)} style={btn} aria-label="Previous">‹</button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{ ...btn, width: '28px', height: '28px', borderRadius: '50%', background: 'var(--candy-pink)', color: '#fff', opacity: 1, fontSize: '11px' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button onClick={() => changeTrack(trackIndex + 1)} style={btn} aria-label="Next">›</button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{ flex: 1, marginLeft: '6px', accentColor: 'var(--candy-pink)', height: '3px' }}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}
