// Global audio singleton — boots on page load.
// Both HeroMusicPlayer and the sidebar MusicPlayer control this same instance.

export const TRACKS = [
  { title: 'Heartbeat, Heartbreak', artist: '', src: '/music/Heartbeat, Heartbreak.mp3' },
  { title: 'Beneath the Mask',      artist: '', src: '/music/Beneath the Mask.mp3'      },
  { title: 'Color Your Night',      artist: '', src: '/music/Color Your Night.mp3'       },
]

export const audio = new Audio(TRACKS[0].src)
audio.volume = 0.2

export let currentTrackIndex = 0

// Central track-change function — both players call this, never manage src themselves.
// Fires a 'trackchange' event so all mounted players update their display state.
export function changeTrack(i: number) {
  const idx = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length
  currentTrackIndex = idx
  audio.src = TRACKS[idx].src
  audio.load()
  audio.play().catch(() => {})
  audio.dispatchEvent(new CustomEvent('trackchange', { detail: idx }))
}

// Auto-advance on end
audio.addEventListener('ended', () => changeTrack(currentTrackIndex + 1))

// Try immediately — browsers may silently block until a user gesture.
audio.play().catch(() => {})

// Fallback: start on the very first interaction (e.g. the arrow click on hero).
function onFirstInteraction() {
  audio.play().catch(() => {})
  document.removeEventListener('mousedown',  onFirstInteraction)
  document.removeEventListener('keydown',    onFirstInteraction)
  document.removeEventListener('touchstart', onFirstInteraction)
}

document.addEventListener('mousedown',  onFirstInteraction)
document.addEventListener('keydown',    onFirstInteraction)
document.addEventListener('touchstart', onFirstInteraction)
