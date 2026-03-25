// TODO: falling rain particles, dark fog, single warm light
export default function SadScene() {
  return (
    <>
      <color attach="background" args={['#050508']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 3, 1]} intensity={0.8} color="#ffaa44" />
    </>
  )
}
