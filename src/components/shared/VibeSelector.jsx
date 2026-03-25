import { usePlayerStore } from '../../store/playerStore'
import { VIBES } from '../../vibes'
import styles from './VibeSelector.module.css'

export default function VibeSelector() {
  const { vibe, setVibe } = usePlayerStore()

  return (
    <div className={styles.dock}>
      {VIBES.map((v) => (
        <button
          key={v.id}
          className={`${styles.btn} ${vibe === v.id ? styles.active : ''}`}
          style={{ '--vibe-color': v.color }}
          onClick={() => setVibe(v.id)}
        >
          <span className={styles.icon}>{v.icon}</span>
          <span className={styles.label}>{v.label}</span>
        </button>
      ))}
    </div>
  )
}
