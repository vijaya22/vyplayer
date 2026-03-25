// TODO: minimal dark grid, data stream lines, monochrome
export default function FocusScene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.2} color="#ffffff" />
      <pointLight position={[0, 2, 3]} intensity={1} color="#ffffff" />
    </>
  )
}
