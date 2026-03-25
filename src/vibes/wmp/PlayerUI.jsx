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

// WMP 12 sun logo — 8 alternating long/short rays radiating from center
function WMPLogo() {
  return (
    <div className={styles.wmpLogo}>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className={styles.wmpRay}
          style={{
            height: i % 2 === 0 ? 7 : 5,
            transform: `rotate(${(i / 8) * 360}deg)`,
          }}
        />
      ))}
      <div className={styles.wmpCore} />
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
    <>
      <form
        className={styles.searchForm}
        onSubmit={(e) => { e.preventDefault(); search(query) }}
      >
        <input
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music..."
        />
        <button className={styles.searchBtn} type="submit">
          {loading ? '...' : 'Search'}
        </button>
      </form>
      <div className={styles.tabContent}>
        {results.length === 0
          ? <p className={styles.emptyMsg}>Search for a song to get started</p>
          : results.map((track, i) => (
            <div key={track.id} className={styles.listItem} onClick={() => handlePlay(track, i)}>
              <span className={styles.listNum}>{i + 1}</span>
              <div className={styles.listInfo}>
                <div className={styles.listTitle}>{track.title}</div>
                <div className={styles.listArtist}>{track.artist}</div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default function WMPPlayerUI() {
  const { seek } = useAudioEngine()
  const [tab, setTab] = useState('SEARCH')
  const [minimized, setMinimized] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const { pos, onMouseDown } = useDraggable({ x: 20, y: 60 })

  const { isPlaying, setPlaying, prevTrack, nextTrack, currentTrack,
          volume, setVolume, progress, duration, playlist, currentIndex,
          setTrack, setPlaying: play } = usePlayerStore()

  const posStyle = pos
    ? { left: pos.x, top: pos.y, bottom: 'auto' }
    : {}

  const titleText = currentTrack
    ? `${currentTrack.title} — ${currentTrack.artist}`
    : 'Windows Media Player'

  return (
    <div className={styles.panel} style={posStyle}>

      {/* Title bar */}
      <div className={styles.titleBar} onMouseDown={onMouseDown}>
        <div className={styles.logoRow}>
          <WMPLogo />
          <span className={styles.titleText}>{titleText}</span>
        </div>
        <button
          className={styles.minimizeBtn}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setMinimized((v) => !v)}
        >
          {minimized ? '▲' : '▼'}
        </button>
      </div>

      {!minimized && (
        <>
          {/* Now playing strip */}
          <div className={styles.nowPlaying}>
            {currentTrack?.artwork
              ? <img className={styles.artwork} src={currentTrack.artwork} alt="art" />
              : <div className={styles.artworkPlaceholder}>♪</div>
            }
            <div className={styles.trackInfo}>
              <div className={styles.trackTitle}>
                {currentTrack?.title ?? 'Nothing playing'}
              </div>
              <div className={styles.trackArtist}>
                {currentTrack
                  ? `${currentTrack.artist}${currentTrack.album ? ' — ' + currentTrack.album : ''}`
                  : 'Search the library to add music'}
              </div>
            </div>
          </div>

          {/* ── WMP 12 controls strip ── */}
          <div className={styles.controlStrip}>

            {/* Seek / timeline bar with time labels */}
            <div
              className={styles.seekBar}
              onClick={(e) => {
                const rect = e.currentTarget.querySelector(`.${styles.seekTrack}`).getBoundingClientRect()
                seek((e.clientX - rect.left) / rect.width)
              }}
            >
              <span className={styles.seekTime}>{formatTime(progress * duration)}</span>
              <div className={styles.seekTrack}>
                <div className={styles.seekFill} style={{ width: `${progress * 100}%` }} />
                <div className={styles.seekThumb} style={{ left: `${progress * 100}%` }} />
              </div>
              <span className={styles.seekTime}>{formatTime(duration)}</span>
            </div>

            {/* Button row:
                [shuffle] [repeat] [stop] [|◀◀] [●PLAY●] [▶▶|]  ···  [🔊 ─vol─] */}
            <div className={styles.controls}>
              {/* Transport buttons inside a dark rounded container */}
              <div className={styles.btnGroup}>
                <button
                  className={`${styles.ctrlBtn} ${shuffle ? styles.ctrlBtnActive : ''}`}
                  onClick={() => setShuffle(v => !v)}
                  title="Shuffle"
                >⇄</button>

                <button
                  className={`${styles.ctrlBtn} ${repeat ? styles.ctrlBtnActive : ''}`}
                  onClick={() => setRepeat(v => !v)}
                  title="Repeat"
                >↻</button>

                <button
                  className={styles.ctrlBtn}
                  onClick={() => setPlaying(false)}
                  title="Stop"
                >■</button>

                <button className={styles.skipBtn} onClick={prevTrack} title="Previous">⏮</button>

                <button
                  className={styles.playBtn}
                  onClick={() => currentTrack && setPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <button className={styles.skipBtn} onClick={nextTrack} title="Next">⏭</button>
              </div>

              <div className={styles.volArea}>
                <span className={styles.volIcon}>🔊</span>
                <input
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className={styles.volSlider}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabBar}>
            {['NOW PLAYING', 'LIBRARY', 'SEARCH'].map((t) => (
              <button
                key={t}
                className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`}
                onClick={() => setTab(t)}
              >{t}</button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'NOW PLAYING' && (
            <div className={styles.tabContent}>
              {playlist.length === 0
                ? <p className={styles.emptyMsg}>Queue is empty</p>
                : playlist.map((track, i) => (
                  <div key={track.id}
                    className={`${styles.listItem} ${i === currentIndex ? styles.listItemActive : ''}`}
                    onClick={() => { setTrack(track, i); play(true) }}
                  >
                    <span className={styles.listNum}>{i + 1}</span>
                    <div className={styles.listInfo}>
                      <div className={styles.listTitle}>{track.title}</div>
                      <div className={styles.listArtist}>{track.artist}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
          {tab === 'LIBRARY' && (
            <div className={styles.tabContent}>
              {playlist.length === 0
                ? <p className={styles.emptyMsg}>Your library is empty — search for music</p>
                : playlist.map((track, i) => (
                  <div key={track.id}
                    className={`${styles.listItem} ${i === currentIndex ? styles.listItemActive : ''}`}
                    onClick={() => { setTrack(track, i); play(true) }}
                  >
                    <span className={styles.listNum}>{i + 1}</span>
                    <div className={styles.listInfo}>
                      <div className={styles.listTitle}>{track.title}</div>
                      <div className={styles.listArtist}>{track.artist}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
          {tab === 'SEARCH' && <SearchTab />}
        </>
      )}
    </div>
  )
}
