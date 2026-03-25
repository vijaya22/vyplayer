import { useState } from 'react'

export function useItunesSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(query) {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20&entity=song`
      const res = await fetch(url)
      const data = await res.json()
      const tracks = data.results
        .filter((r) => r.previewUrl)
        .map((r) => ({
          id: r.trackId,
          title: r.trackName,
          artist: r.artistName,
          album: r.collectionName,
          artwork: r.artworkUrl100?.replace('100x100', '300x300'),
          previewUrl: r.previewUrl,
          duration: r.trackTimeMillis,
        }))
      setResults(tracks)
    } catch (e) {
      setError('Search failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, search }
}
