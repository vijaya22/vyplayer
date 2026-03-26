// Hard-reload once when Vite fails to preload a chunk (stale cached index.html).
// A regular reload() re-uses the cache, so we navigate to the same path with a
// timestamp query param to force the browser/CDN to fetch a fresh index.html.
window.addEventListener('vite:preloadError', () => {
  if (!sessionStorage.getItem('reloaded')) {
    sessionStorage.setItem('reloaded', '1')
    window.location.href = window.location.pathname + '?r=' + Date.now()
  }
})

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
