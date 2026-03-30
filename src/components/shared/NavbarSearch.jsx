import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useItunesSearch } from '../../hooks/useItunesSearch'
import { usePlayerStore } from '../../store/playerStore'
import { useIsMobile } from '../../hooks/useIsMobile'
import styles from './NavbarSearch.module.css'

export default function NavbarSearch({ onMobileToggle, onTrackSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { results, loading, search } = useItunesSearch()
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const { setPlaylist, setTrack, setPlaying } = usePlayerStore()
  const isMobile = useIsMobile()
  const [mobileActive, setMobileActive] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) return
    const timer = setTimeout(() => search(query), 400)
    return () => clearTimeout(timer)
  }, [query])

  // Open dropdown when we have results
  useEffect(() => {
    if (results.length > 0 && query.trim()) setOpen(true)
  }, [results])

  // Click outside to close
  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Escape to close
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        if (mobileActive) closeMobile()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mobileActive])

  function handleSelect(track, i) {
    setPlaylist(results)
    setTrack(track, i)
    setPlaying(true)
    setOpen(false)
    if (mobileActive) closeMobile()
    onTrackSelect?.()
  }

  function openMobile() {
    setMobileActive(true)
    onMobileToggle?.(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function closeMobile() {
    setMobileActive(false)
    setOpen(false)
    onMobileToggle?.(false)
  }

  // Mobile: just a search icon when not active
  if (isMobile && !mobileActive) {
    return (
      <button className={styles.mobileIconBtn} onClick={openMobile} title="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    )
  }

  // Mobile active: full-width search bar + full-screen results
  if (isMobile && mobileActive) {
    return (
      <div className={styles.mobileContainer} ref={containerRef}>
        <div className={styles.mobileBar}>
          <svg className={styles.mobileSearchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className={styles.mobileInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs..."
          />
          <button className={styles.mobileCloseBtn} onClick={closeMobile}>✕</button>
        </div>
        {(results.length > 0 || loading) && createPortal(
          <div className={styles.mobileSheet}>
            {loading && <div className={styles.loadingMsg}>Searching...</div>}
            {results.map((track, i) => (
              <div
                key={track.id}
                className={`${styles.resultItem} ${currentTrack?.id === track.id ? styles.resultActive : ''}`}
                onClick={() => handleSelect(track, i)}
              >
                {track.artwork
                  ? <img className={styles.thumb} src={track.artwork} alt="" />
                  : <div className={styles.thumbPlaceholder}>♪</div>
                }
                <div className={styles.resultInfo}>
                  <div className={styles.resultTitle}>{track.title}</div>
                  <div className={styles.resultArtist}>{track.artist}</div>
                </div>
                {currentTrack?.id === track.id && <span className={styles.nowPlaying}>▶</span>}
              </div>
            ))}
          </div>,
          document.body
        )}
      </div>
    )
  }

  // Desktop: compact input + dropdown
  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputWrap}>
        <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && query.trim() && setOpen(true)}
          placeholder="Search songs..."
        />
        {loading && <span className={styles.spinner} />}
      </div>

      {open && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((track, i) => (
            <div
              key={track.id}
              className={`${styles.resultItem} ${currentTrack?.id === track.id ? styles.resultActive : ''}`}
              onClick={() => handleSelect(track, i)}
            >
              {track.artwork
                ? <img className={styles.thumb} src={track.artwork} alt="" />
                : <div className={styles.thumbPlaceholder}>♪</div>
              }
              <div className={styles.resultInfo}>
                <div className={styles.resultTitle}>{track.title}</div>
                <div className={styles.resultArtist}>{track.artist}</div>
              </div>
              {currentTrack?.id === track.id && <span className={styles.nowPlaying}>▶</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
