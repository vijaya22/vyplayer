import { usePlayerStore } from '../../store/playerStore'
import styles from './Controls.module.css'

export default function Controls() {
  const { isPlaying, setPlaying, prevTrack, nextTrack, currentTrack } = usePlayerStore()

  function togglePlay() {
    if (!currentTrack) return
    setPlaying(!isPlaying)
  }

  return (
    <div className={styles.row}>
      <button className={styles.btn} onClick={prevTrack} title="Previous">⏮</button>
      <button className={styles.btn} onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button className={styles.btn} onClick={() => setPlaying(false)} title="Stop">⏹</button>
      <button className={styles.btn} onClick={nextTrack} title="Next">⏭</button>
    </div>
  )
}
