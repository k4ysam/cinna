import { useEffect, useState } from 'react'
import { audio, TRACKS } from '../../audio'

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
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying]   = useState(!audio.paused)
  const [volume, setVolume]         = useState(audio.volume)
  const [loadError, setLoadError]   = useState(false)

  const track = TRACKS[trackIndex]

  // Stay in sync with the singleton's play/pause state
  useEffect(() => {
    const onPlay  = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => setLoadError(true)
    const onCanPlay = () => setLoadError(false)
    const onEnded = () => setTrackIndex(i => (i + 1) % TRACKS.length)

    audio.addEventListener('play',     onPlay)
    audio.addEventListener('pause',    onPause)
    audio.addEventListener('error',    onError)
    audio.addEventListener('canplay',  onCanPlay)
    audio.addEventListener('ended',    onEnded)

    return () => {
      audio.removeEventListener('play',     onPlay)
      audio.removeEventListener('pause',    onPause)
      audio.removeEventListener('error',    onError)
      audio.removeEventListener('canplay',  onCanPlay)
      audio.removeEventListener('ended',    onEnded)
    }
  }, [])

  // Load new track when index changes
  useEffect(() => {
    setLoadError(false)
    audio.src = TRACKS[trackIndex].src
    audio.load()
    if (isPlaying) audio.play().catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex])

  // Sync volume
  useEffect(() => {
    audio.volume = volume
  }, [volume])

  function togglePlay() {
    if (loadError) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  function prev() {
    setTrackIndex(i => (i - 1 + TRACKS.length) % TRACKS.length)
  }

  function next() {
    setTrackIndex(i => (i + 1) % TRACKS.length)
  }

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
      {/* Track info */}
      <div style={{ fontSize: '12px', lineHeight: 1.3, overflow: 'hidden' }}>
        <div
          style={{
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'var(--text-dark)',
          }}
        >
          {loadError ? 'Unavailable' : track.title}
        </div>
        {track.artist && (
          <div style={{ opacity: 0.6, fontSize: '11px' }}>{track.artist}</div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <button onClick={prev} style={btn} aria-label="Previous">‹</button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            ...btn,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--candy-pink)',
            color: '#fff',
            opacity: 1,
            fontSize: '11px',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button onClick={next} style={btn} aria-label="Next">›</button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{
            flex: 1,
            marginLeft: '6px',
            accentColor: 'var(--candy-pink)',
            height: '3px',
          }}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}
