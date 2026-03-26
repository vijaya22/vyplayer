import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

// Rounded rectangle as a THREE.Shape
function roundedRect(w, h, r) {
  const s = new THREE.Shape()
  s.moveTo(-w + r, h)
  s.lineTo(w - r, h)
  s.quadraticCurveTo(w, h, w, h - r)
  s.lineTo(w, -h + r)
  s.quadraticCurveTo(w, -h, w - r, -h)
  s.lineTo(-w + r, -h)
  s.quadraticCurveTo(-w, -h, -w, -h + r)
  s.lineTo(-w, h - r)
  s.quadraticCurveTo(-w, h, -w + r, h)
  s.closePath()
  return s
}

function Reel({ isRight = false }) {
  const ref = useRef()

  useFrame((_, dt) => {
    if (!ref.current) return
    const { isPlaying, amplitude } = usePlayerStore.getState()
    if (!isPlaying) return
    ref.current.rotation.z -= (1.2 + amplitude * 4) * (isRight ? 1.38 : 1.0) * dt
  })

  return (
    <group>
      {/* Outer grey disc */}
      <mesh>
        <circleGeometry args={[0.44, 48]} />
        <meshStandardMaterial color="#888880" roughness={0.45} />
      </mesh>

      <group ref={ref}>
        {/* White/cream inner disc */}
        <mesh>
          <circleGeometry args={[0.335, 48]} />
          <meshStandardMaterial color="#eae8e0" roughness={0.4} />
        </mesh>
        {/* Cross hub — horizontal */}
        <mesh>
          <boxGeometry args={[0.26, 0.082, 0.006]} />
          <meshStandardMaterial color="#909085" roughness={0.5} />
        </mesh>
        {/* Cross hub — vertical */}
        <mesh>
          <boxGeometry args={[0.082, 0.26, 0.006]} />
          <meshStandardMaterial color="#909085" roughness={0.5} />
        </mesh>
        {/* Center circle */}
        <mesh>
          <circleGeometry args={[0.086, 24]} />
          <meshStandardMaterial color="#787870" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function Screw({ position }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.115, 24]} />
        <meshStandardMaterial color="#8a8880" roughness={0.3} metalness={0.55} />
      </mesh>
      {/* Phillips cross */}
      <mesh position={[0, 0, 0.003]}>
        <boxGeometry args={[0.135, 0.022, 0.002]} />
        <meshStandardMaterial color="#505048" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0, 0.003]}>
        <boxGeometry args={[0.022, 0.135, 0.002]} />
        <meshStandardMaterial color="#505048" roughness={0.65} />
      </mesh>
    </group>
  )
}

export default function CassetteTape() {
  const bodyRef = useRef()

  const geos = useMemo(() => {
    // Body — rounded rect extruded for depth
    const bodyShape = roundedRect(2.12, 1.48, 0.2)
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, { depth: 0.36, bevelEnabled: false })

    // Label base (orange) — rounded rect
    const labelGeo = new THREE.ShapeGeometry(roundedRect(1.57, 1.03, 0.13))

    // Cream top — rounded top corners, flat bottom
    const lw = 1.57, topY = 1.03, splitY = 0.13, lr = 0.13
    const cs = new THREE.Shape()
    cs.moveTo(-lw + lr, topY)
    cs.lineTo(lw - lr, topY)
    cs.quadraticCurveTo(lw, topY, lw, topY - lr)
    cs.lineTo(lw, splitY)
    cs.lineTo(-lw, splitY)
    cs.lineTo(-lw, topY - lr)
    cs.quadraticCurveTo(-lw, topY, -lw + lr, topY)
    cs.closePath()
    const creamGeo = new THREE.ShapeGeometry(cs)

    // Window housing — wide pill / capsule shape (r == h gives capsule ends)
    const windowGeo = new THREE.ShapeGeometry(roundedRect(1.3, 0.44, 0.44))

    // Bottom guard
    const bottomGeo = new THREE.ShapeGeometry(roundedRect(1.28, 0.35, 0.12))

    return { bodyGeo, labelGeo, creamGeo, windowGeo, bottomGeo }
  }, [])

  useFrame(({ clock }) => {
    if (!bodyRef.current) return
    const t = clock.getElapsedTime()
    const { amplitude } = usePlayerStore.getState()
    // Gentle vertical float only — no rotation that would make circles appear to spin
    bodyRef.current.position.y = Math.sin(t * 0.45) * 0.06
    bodyRef.current.rotation.y = 0
    bodyRef.current.rotation.x = 0
    bodyRef.current.scale.setScalar(1 + amplitude * 0.025)
  })

  // Front face z of extruded body (centered at z=0, depth 0.36 → front at +0.18)
  const Z = 0.185

  return (
    <group ref={bodyRef}>

      {/* ── BODY ── */}
      <mesh position={[0, 0, -0.18]} geometry={geos.bodyGeo}>
        <meshStandardMaterial color="#3e3832" roughness={0.72} />
      </mesh>

      {/* ── LABEL: orange base ── */}
      <mesh position={[0, 0.08, Z]} geometry={geos.labelGeo}>
        <meshStandardMaterial color="#e89028" roughness={0.6} />
      </mesh>

      {/* ── LABEL: cream top ── */}
      <mesh position={[0, 0.08, Z + 0.002]} geometry={geos.creamGeo}>
        <meshStandardMaterial color="#f5ead0" roughness={0.55} />
      </mesh>

      {/* ── LABEL: writing lines ── */}
      {[0.84, 0.70].map((y, i) => (
        <mesh key={i} position={[0, y + 0.08, Z + 0.005]}>
          <boxGeometry args={[2.6, 0.022, 0.002]} />
          <meshStandardMaterial color="#2a2418" roughness={0.95} />
        </mesh>
      ))}

      {/* ── WINDOW HOUSING (dark pill) ── */}
      <mesh position={[0, 0.08, Z + 0.003]} geometry={geos.windowGeo}>
        <meshStandardMaterial color="#252018" roughness={0.9} />
      </mesh>

      {/* ── TAPE visible (dark left, lighter right) ── */}
      <mesh position={[-0.16, 0.06, Z + 0.007]}>
        <boxGeometry args={[0.27, 0.40, 0.002]} />
        <meshStandardMaterial color="#5a3a28" roughness={0.95} />
      </mesh>
      <mesh position={[0.16, 0.06, Z + 0.007]}>
        <boxGeometry args={[0.27, 0.40, 0.002]} />
        <meshStandardMaterial color="#a08860" roughness={0.95} />
      </mesh>

      {/* ── REELS ── */}
      <group position={[-0.83, 0.08, Z + 0.005]}>
        <Reel isRight={false} />
      </group>
      <group position={[0.83, 0.08, Z + 0.005]}>
        <Reel isRight={true} />
      </group>

      {/* ── BOTTOM GUARD ── */}
      <mesh position={[0, -0.97, Z + 0.001]} geometry={geos.bottomGeo}>
        <meshStandardMaterial color="#2a2520" roughness={0.88} />
      </mesh>

      {/* Border highlight on guard */}
      <mesh position={[0, -0.97, Z + 0.003]}>
        <boxGeometry args={[2.56, 0.72, 0.001]} />
        <meshStandardMaterial color="#403c36" roughness={0.85} />
      </mesh>

      {/* 4 white holes in guard */}
      {[-0.64, -0.22, 0.22, 0.64].map((x, i) => (
        <mesh key={i} position={[x, -1.00, Z + 0.007]}>
          <circleGeometry args={[0.076, 20]} />
          <meshStandardMaterial color="#f0e8d8" roughness={0.4} />
        </mesh>
      ))}

      {/* Center screw in guard */}
      <group position={[0, -0.74, Z + 0.007]}>
        <mesh>
          <circleGeometry args={[0.057, 16]} />
          <meshStandardMaterial color="#808078" roughness={0.35} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[0.1, 0.018, 0.002]} />
          <meshStandardMaterial color="#50504a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[0.018, 0.1, 0.002]} />
          <meshStandardMaterial color="#50504a" roughness={0.7} />
        </mesh>
      </group>

      {/* ── CORNER SCREWS ── */}
      <Screw position={[-1.78, 1.18, Z + 0.001]} />
      <Screw position={[ 1.78, 1.18, Z + 0.001]} />
      <Screw position={[-1.78,-1.18, Z + 0.001]} />
      <Screw position={[ 1.78,-1.18, Z + 0.001]} />

    </group>
  )
}
