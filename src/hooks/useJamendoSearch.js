import { useState } from 'react'

import { JAMENDO } from '../config/apis'

const { clientId: CLIENT_ID, base: BASE } = JAMENDO

export function useJamendoSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(query) {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const url = `${BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`
      const res = await fetch(url)
      
      const data = await res.json()
      const tracks = (data.results || [])
        .filter((r) => r.audio)
        .map((r) => ({
          id: r.id,
          title: r.name,
          artist: r.artist_name,
          album: r.album_name,
          artwork: r.image,
          previewUrl: r.audio,  // full track, not a preview
          duration: r.duration * 1000,
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
