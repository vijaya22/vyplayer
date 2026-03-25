import { useState } from 'react'
import { useItunesSearch } from '../../hooks/useItunesSearch'
import { usePlayerStore } from '../../store/playerStore'
import styles from './SearchWindow.module.css'

export default function SearchWindow() {
  const [query, setQuery] = useState('')
  const { results, loading, error, search } = useItunesSearch()
  const { setPlaylist, setTrack, setPlaying } = usePlayerStore()

  function handleSearch(e) {
    e.preventDefault()
    search(query)
  }

  function handleAddAll() {
    if (!results.length) return
    setPlaylist(results)
    setTrack(results[0], 0)
    setPlaying(true)
  }

  function handlePlay(track, i) {
    setPlaylist(results)
    setTrack(track, i)
    setPlaying(true)
  }

  return (
    <div className={styles.window}>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search iTunes..."
        />
        <button className={styles.btn} type="submit">GO</button>
      </form>

      {loading && <div className={styles.status}>Searching...</div>}
      {error && <div className={styles.status}>{error}</div>}

      {results.length > 0 && (
        <>
          <button className={styles.addAll} onClick={handleAddAll}>▶ PLAY ALL</button>
          <div className={styles.results}>
            {results.map((track, i) => (
              <div key={track.id} className={styles.result} onClick={() => handlePlay(track, i)}>
                <span className={styles.resultTitle}>{track.title}</span>
                <span className={styles.resultArtist}>{track.artist}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
