import { usePlayerStore } from '../../store/playerStore'
import styles from './PlaylistWindow.module.css'

export default function PlaylistWindow() {
  const { playlist, currentIndex, setTrack, setPlaying } = usePlayerStore()

  if (!playlist.length) return null

  function handlePlay(track, i) {
    setTrack(track, i)
    setPlaying(true)
  }

  return (
    <div className={styles.window}>
      <div className={styles.list}>
        {playlist.map((track, i) => (
          <div
            key={track.id}
            className={`${styles.item} ${i === currentIndex ? styles.active : ''}`}
            onClick={() => handlePlay(track, i)}
          >
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.title}>{track.artist} - {track.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
