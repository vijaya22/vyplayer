import { lazy } from 'react'

export const VIBES = [
  {
    id: 'winamp',
    label: '90s',
    icon: '🖥️',
    color: '#00ff00',
    Scene:    lazy(() => import('./winamp/Scene')),
    PlayerUI: lazy(() => import('./winamp/PlayerUI')),
  },
  {
    id: 'flowery',
    label: 'FLOWERY',
    icon: '🌸',
    color: '#ff88bb',
    Scene:    lazy(() => import('./flowery/Scene')),
    PlayerUI: lazy(() => import('./flowery/PlayerUI')),
  },
  {
    id: 'chill',
    label: 'CHILL',
    icon: '🌊',
    color: '#00aaff',
    Scene:    lazy(() => import('./chill/Scene')),
    PlayerUI: lazy(() => import('./chill/PlayerUI')),
  },
  {
    id: 'hype',
    label: 'HYPE',
    icon: '⚡',
    color: '#ff00ff',
    Scene:    lazy(() => import('./hype/Scene')),
    PlayerUI: lazy(() => import('./hype/PlayerUI')),
  },
  {
    id: 'cosmic',
    label: 'COSMIC',
    icon: '🪐',
    color: '#aa66ff',
    Scene:    lazy(() => import('./cosmic/Scene')),
    PlayerUI: lazy(() => import('./cosmic/PlayerUI')),
  },
  {
    id: 'sad',
    label: 'SAD',
    icon: '🌧️',
    color: '#ffaa44',
    Scene:    lazy(() => import('./sad/Scene')),
    PlayerUI: lazy(() => import('./sad/PlayerUI')),
  },
  {
    id: 'focus',
    label: 'FOCUS',
    icon: '🎯',
    color: '#cccccc',
    Scene:    lazy(() => import('./focus/Scene')),
    PlayerUI: lazy(() => import('./focus/PlayerUI')),
  },
]

export const DEFAULT_VIBE = 'winamp'
