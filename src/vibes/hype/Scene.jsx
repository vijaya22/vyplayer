// TODO: neon tunnel, beat-synced explosions, strobing lights
export default function HypeScene() {
  return (
    <>
      <color attach="background" args={['#0a0010']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 3]} intensity={2} color="#ff00ff" />
    </>
  )
}
