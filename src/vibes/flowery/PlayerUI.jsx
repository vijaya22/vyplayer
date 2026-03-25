import { useState } from 'react'
import { useAudioEngine } from '../../hooks/useAudioEngine'
import { useItunesSearch } from '../../hooks/useItunesSearch'
import { usePlayerStore } from '../../store/playerStore'
import { useDraggable } from '../../hooks/useDraggable'
import styles from './PlayerUI.module.css'

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const TABS = ['PLAYER', 'PLAYLIST', 'SEARCH']

export default function FloweryPlayerUI() {
  const { seek } = useAudioEngine()
  const [tab, setTab] = useState('PLAYER')
  const { pos, onMouseDown } = useDraggable({ x: 20, y: 60 })
  const { isPlaying, setPlaying, prevTrack, nextTrack, currentTrack, volume, setVolume, playlist, currentIndex, setTrack, setPlaying: play } = usePlayerStore()

  const posStyle = pos
    ? { left: pos.x, top: pos.y, bottom: 'auto', transform: 'none' }
    : {}

  return (
    <div className={styles.wrapper} style={posStyle}>
      <div className={styles.card}>

        {/* Drag handle */}
        <div className={styles.dragHandle} onMouseDown={onMouseDown}>
          <span className={styles.dragDots}>• • •</span>
        </div>

        {/* Tab bar */}
        <div className={styles.tabBar}>
          {TABS.map((t) => (
            <button
              key={t}
              className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* PLAYER tab */}
        {tab === 'PLAYER' && (
          <>
            <div className={styles.artWrapper}>
              {currentTrack?.artwork
                ? <img src={currentTrack.artwork} alt="art" className={styles.art} />
                : <div className={styles.artPlaceholder}>🌸</div>
              }
            </div>

            <div className={styles.trackInfo}>
              <div className={styles.title}>{currentTrack?.title ?? 'No track playing'}</div>
              <div className={styles.artist}>{currentTrack?.artist ?? 'Switch to Search tab'}</div>
            </div>

            <SeekBar onSeek={seek} />

            <div className={styles.controls}>
              <button className={styles.btnSecondary} onClick={prevTrack}>⏮</button>
              <button className={styles.btnPlay} onClick={() => currentTrack && setPlaying(!isPlaying)}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button className={styles.btnSecondary} onClick={nextTrack}>⏭</button>
            </div>

            <div className={styles.volumeRow}>
              <span className={styles.volumeIcon}>🔈</span>
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={styles.volumeSlider}
              />
              <span className={styles.volumeIcon}>🔊</span>
            </div>
          </>
        )}

        {/* PLAYLIST tab */}
        {tab === 'PLAYLIST' && (
          <div className={styles.listContent}>
            {playlist.length === 0
              ? <p className={styles.emptyMsg}>No songs yet — search for something 🌸</p>
              : playlist.map((track, i) => (
                <div
                  key={track.id}
                  className={`${styles.listItem} ${i === currentIndex ? styles.listItemActive : ''}`}
                  onClick={() => { setTrack(track, i); play(true) }}
                >
                  <div className={styles.listTitle}>{track.title}</div>
                  <div className={styles.listArtist}>{track.artist}</div>
                </div>
              ))
            }
          </div>
        )}

        {/* SEARCH tab */}
        {tab === 'SEARCH' && <SearchTab />}
      </div>
    </div>
  )
}

function SeekBar({ onSeek }) {
  const progress = usePlayerStore((s) => s.progress)
  const duration = usePlayerStore((s) => s.duration)
  return (
    <div className={styles.seekWrapper}>
      <div className={styles.seekTrack} onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onSeek((e.clientX - rect.left) / rect.width)
      }}>
        <div className={styles.seekFill} style={{ width: `${progress * 100}%` }} />
      </div>
      <div className={styles.timeRow}>
        <span>{formatTime(progress * duration)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

function SearchTab() {
  const [query, setQuery] = useState('')
  const { results, loading, search } = useItunesSearch()
  const { setPlaylist, setTrack, setPlaying } = usePlayerStore()

  function handlePlay(track, i) {
    setPlaylist(results)
    setTrack(track, i)
    setPlaying(true)
  }

  return (
    <div className={styles.searchContent}>
      <form onSubmit={(e) => { e.preventDefault(); search(query) }} className={styles.searchForm}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song..."
          className={styles.searchInput}
        />
        <button className={styles.searchBtn} type="submit">
          {loading ? '…' : '🔍'}
        </button>
      </form>

      <div className={styles.listContent}>
        {results.map((track, i) => (
          <div key={track.id} className={styles.listItem} onClick={() => handlePlay(track, i)}>
            <div className={styles.listTitle}>{track.title}</div>
            <div className={styles.listArtist}>{track.artist}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
