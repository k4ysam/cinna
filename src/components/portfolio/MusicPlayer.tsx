import { useEffect, useRef, useState } from 'react'

interface Track {
  title: string
  artist: string
  src: string
}

// Drop mp3s into public/music/ and add them here
const TRACKS: Track[] = [
  { title: 'Track 1', artist: 'Artist', src: '/music/track1.mp3' },
  { title: 'Track 2', artist: 'Artist', src: '/music/track2.mp3' },
  { title: 'Track 3', artist: 'Artist', src: '/music/track3.mp3' },
]

const pill: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'inherit',
  padding: '0 4px',
  fontSize: '14px',
  opacity: 0.7,
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying]   = useState(false)
  const [volume, setVolume]         = useState(0.7)
  const [unavailable, setUnavailable] = useState(false)

  const track = TRACKS[trackIndex]

  // Create audio element once
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    audio.onerror = () => setUnavailable(true)
    audio.onended = () => {
      setTrackIndex(i => (i + 1) % TRACKS.length)
    }

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setUnavailable(false)
    const wasPlaying = isPlaying
    audio.pause()
    audio.src = track.src
    audio.load()
    if (wasPlaying) {
      audio.play().catch(() => setUnavailable(true))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || unavailable) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      if (!audio.src) {
        audio.src = track.src
        audio.load()
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setUnavailable(true))
    }
  }

  function prev() {
    setIsPlaying(false)
    setTrackIndex(i => (i - 1 + TRACKS.length) % TRACKS.length)
  }

  function next() {
    setIsPlaying(false)
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
        opacity: unavailable ? 0.5 : 1,
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
          {unavailable ? 'Unavailable' : track.title}
        </div>
        <div style={{ opacity: 0.6, fontSize: '11px' }}>{track.artist}</div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <button onClick={prev} style={pill} aria-label="Previous" title="Prev">‹</button>
        <button
          onClick={togglePlay}
          style={{
            ...pill,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--candy-pink)',
            color: '#fff',
            opacity: 1,
            fontSize: '11px',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={next} style={pill} aria-label="Next" title="Next">›</button>

        {/* Volume */}
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
