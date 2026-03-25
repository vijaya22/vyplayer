import { usePlayerStore } from '../../store/playerStore'
import styles from './SeekBar.module.css'

export default function SeekBar({ onSeek }) {
  const progress = usePlayerStore((s) => s.progress)

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    onSeek(Math.max(0, Math.min(1, ratio)))
  }

  return (
    <div className={styles.track} onClick={handleClick}>
      <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
      <div className={styles.thumb} style={{ left: `${progress * 100}%` }} />
    </div>
  )
}
