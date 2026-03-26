import { VIBES } from '../vibes'
import styles from './LandingPage.module.css'

export default function LandingPage({ onSelect }) {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>VY</span>PLAYER
        </h1>
        <p className={styles.tagline}>Music with a vibe. Pick yours.</p>
        <p className={styles.heroSub}>9 vibes · Search any song · Drag anywhere</p>
      </div>

      <div className={styles.grid}>
        {VIBES.map((vibe) => (
          <div
            key={vibe.id}
            className={styles.card}
            style={{ '--c': vibe.color }}
            onClick={() => onSelect(vibe.id)}
          >
            <div className={styles.cardGlow} />
            <span className={styles.icon}>{vibe.icon}</span>
            <div className={styles.vibeName}>{vibe.label}</div>
            <div className={styles.vibeDesc}>{vibe.description}</div>
            <div className={styles.launchHint}>Launch →</div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>VYPLAYER — made with React Three Fiber</div>
    </div>
  )
}
