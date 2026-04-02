// Global audio singleton — boots on page load, plays on first user interaction.
// MusicPlayer imports and controls this same instance.

export const TRACKS = [
  { title: 'Heartbeat, Heartbreak', artist: '', src: '/music/Heartbeat, Heartbreak.mp3' },
]

export const audio = new Audio(TRACKS[0].src)
audio.volume = 0.5

// Browsers require a user gesture before audio can play.
// Start on the very first interaction anywhere on the page.
function onFirstInteraction() {
  audio.play().catch(() => {})
  document.removeEventListener('mousedown',  onFirstInteraction)
  document.removeEventListener('keydown',    onFirstInteraction)
  document.removeEventListener('touchstart', onFirstInteraction)
}

document.addEventListener('mousedown',  onFirstInteraction)
document.addEventListener('keydown',    onFirstInteraction)
document.addEventListener('touchstart', onFirstInteraction)
