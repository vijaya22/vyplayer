// iTunes Search API — no auth, 30s previews, mainstream catalog
export const ITUNES = {
  base: 'https://itunes.apple.com',
}

// Jamendo — free API key, full tracks, CC-licensed indie music only
// To switch: import useJamendoSearch instead of useItunesSearch in SearchWindow.jsx
export const JAMENDO = {
  clientId: 'a3fb946d',
  base: 'https://api.jamendo.com/v3.0',
}
