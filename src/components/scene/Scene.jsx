import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Scanline, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import SpinningCD from './SpinningCD'
import VUMeter from './VUMeter'

export default function Scene() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={1.5} color="#00aaff" />
      <pointLight position={[-3, -1, 2]} intensity={0.8} color="#aa00ff" />

      <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />
      <SpinningCD />
      <VUMeter />

      <EffectComposer>
        <Scanline blendFunction={BlendFunction.OVERLAY} density={1.4} opacity={0.15} />
        <Vignette eskil={false} offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  )
}
