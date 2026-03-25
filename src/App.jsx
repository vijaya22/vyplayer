import Scene from './components/scene/Scene'
import PlayerWindow from './components/player/PlayerWindow'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      <Scene />
      <PlayerWindow />
    </div>
  )
}
