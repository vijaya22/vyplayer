import { usePlayerStore } from '../../../store/playerStore'
import { VIBES } from '../../../vibes'
import styles from './VibeSelector.module.css'

export default function VibeSelector() {
  const { vibe, setVibe } = usePlayerStore()

  return (
    <div className={styles.row}>
      {VIBES.map((v) => (
        <button
          key={v.id}
          className={`${styles.btn} ${vibe === v.id ? styles.active : ''}`}
          style={{ '--vibe-color': v.color }}
          onClick={() => setVibe(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}
