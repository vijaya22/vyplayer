import { useState } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { VIBES } from '../../vibes'
import NavbarSearch from './NavbarSearch'
import styles from './VibeSelector.module.css'

export default function VibeSelector({ showVibeButtons = true, onBack, onTrackSelect }) {
  const { vibe, setVibe } = usePlayerStore()
  const [mobileSearchActive, setMobileSearchActive] = useState(false)

  return (
    <div className={styles.dock}>
      {onBack && !mobileSearchActive && (
        <button className={styles.backBtn} onClick={onBack}>←</button>
      )}
      {showVibeButtons && !mobileSearchActive && (
        <div className={styles.vibes}>
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
      )}
      <NavbarSearch
        onMobileToggle={setMobileSearchActive}
        onTrackSelect={onTrackSelect}
      />
    </div>
  )
}
