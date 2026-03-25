import { usePlayerStore } from '../../../store/playerStore'
import styles from './VolumeSlider.module.css'

export default function VolumeSlider() {
  const { volume, setVolume } = usePlayerStore()

  return (
    <div className={styles.row}>
      <span className={styles.label}>VOL</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className={styles.slider}
      />
      <span className={styles.value}>{Math.round(volume * 100)}</span>
    </div>
  )
}
