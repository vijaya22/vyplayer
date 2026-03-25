import { usePlayerStore } from '../../store/playerStore'
import styles from './TrackDisplay.module.css'

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function TrackDisplay() {
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const progress = usePlayerStore((s) => s.progress)
  const duration = usePlayerStore((s) => s.duration)

  const title = currentTrack ? `${currentTrack.artist} - ${currentTrack.title}` : 'NO TRACK LOADED'
  const elapsed = formatTime(progress * duration)
  const total = formatTime(duration)

  return (
    <div className={styles.display}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marquee} style={{ animationDuration: `${Math.max(5, title.length * 0.2)}s` }}>
          {title}&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <div className={styles.timeRow}>
        <span className={styles.time}>{elapsed}</span>
        <span className={styles.timeSep}>/</span>
        <span className={styles.time}>{total}</span>
      </div>
      {currentTrack?.artwork && (
        <img src={currentTrack.artwork} alt="album art" className={styles.artwork} />
      )}
    </div>
  )
}
