// TODO: nebula clouds, orbiting planets, deep space
export default function CosmicScene() {
  return (
    <>
      <color attach="background" args={['#000008']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color="#aa66ff" />
    </>
  )
}
