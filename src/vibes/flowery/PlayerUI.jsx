import { useState } from 'react'
import { useAudioEngine } from '../../hooks/useAudioEngine'
import { useItunesSearch } from '../../hooks/useItunesSearch'
import { usePlayerStore } from '../../store/playerStore'
import styles from './PlayerUI.module.css'

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function SeekBar({ onSeek }) {
  const progress = usePlayerStore((s) => s.progress)
  const duration = usePlayerStore((s) => s.duration)

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    onSeek((e.clientX - rect.left) / rect.width)
  }

  return (
    <div className={styles.seekWrapper}>
      <div className={styles.seekTrack} onClick={handleClick}>
        <div className={styles.seekFill} style={{ width: `${progress * 100}%` }} />
      </div>
      <div className={styles.timeRow}>
        <span>{formatTime(progress * duration)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

function SearchPanel() {
  const [query, setQuery] = useState('')
  const { results, loading, search } = useItunesSearch()
  const { setPlaylist, setTrack, setPlaying } = usePlayerStore()

  function handleSearch(e) {
    e.preventDefault()
    search(query)
  }

  function handlePlay(track, i) {
    setPlaylist(results)
    setTrack(track, i)
    setPlaying(true)
  }

  return (
    <div className={styles.card}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6, width: '100%' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song..."
          style={{
            flex: 1,
            background: 'rgba(255,150,180,0.07)',
            border: '1px solid rgba(255,150,180,0.2)',
            borderRadius: 20,
            padding: '6px 12px',
            color: '#ffd6e7',
            fontFamily: "'Lato', sans-serif",
            fontSize: 11,
            outline: 'none',
          }}
        />
        <button className={styles.btnPlay} style={{ width: 36, height: 36, fontSize: 11 }} type="submit">
          {loading ? '…' : '🔍'}
        </button>
      </form>

      {results.length > 0 && (
        <div style={{ width: '100%', maxHeight: 160, overflowY: 'auto' }}>
          {results.map((track, i) => (
            <div
              key={track.id}
              onClick={() => handlePlay(track, i)}
              style={{
                padding: '6px 4px',
                borderBottom: '1px solid rgba(255,150,180,0.1)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: '#ffd6e7' }}>
                {track.title}
              </div>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: 'rgba(255,180,200,0.5)' }}>
                {track.artist}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FloweryPlayerUI() {
  const { seek } = useAudioEngine()
  const [showSearch, setShowSearch] = useState(false)
  const { isPlaying, setPlaying, prevTrack, nextTrack, currentTrack, volume, setVolume } = usePlayerStore()

  return (
    <div className={styles.wrapper}>
      {showSearch && <SearchPanel />}

      <div className={styles.card}>
        {/* Album art */}
        <div className={styles.artWrapper}>
          {currentTrack?.artwork
            ? <img src={currentTrack.artwork} alt="art" className={styles.art} />
            : <div className={styles.artPlaceholder}>🌸</div>
          }
        </div>

        {/* Track info */}
        <div className={styles.trackInfo}>
          <div className={styles.title}>{currentTrack?.title ?? 'No track playing'}</div>
          <div className={styles.artist}>{currentTrack?.artist ?? 'Search for a song below'}</div>
        </div>

        {/* Seek */}
        <SeekBar onSeek={seek} />

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.btnSecondary} onClick={prevTrack}>⏮</button>
          <button
            className={styles.btnPlay}
            onClick={() => currentTrack && setPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className={styles.btnSecondary} onClick={nextTrack}>⏭</button>
          <button
            className={styles.btnSecondary}
            onClick={() => setShowSearch((v) => !v)}
            style={{ fontSize: 12 }}
          >
            🔍
          </button>
        </div>

        {/* Volume */}
        <div className={styles.volumeRow}>
          <span className={styles.volumeIcon}>🔈</span>
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className={styles.volumeSlider}
          />
          <span className={styles.volumeIcon}>🔊</span>
        </div>
      </div>
    </div>
  )
}
