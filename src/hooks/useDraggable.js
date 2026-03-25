import { useRef, useState, useCallback } from 'react'

function isMobile() {
  return window.matchMedia('(pointer: coarse)').matches
}

export function useDraggable(initialPos) {
  const [pos, setPos] = useState(initialPos)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    if (isMobile()) return
    dragging.current = true
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }

    function onMove(e) {
      if (!dragging.current) return
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
    }

    function onUp() {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos])

  // Touch drag disabled on mobile — touch is for interacting with the UI, not dragging
  const onTouchStart = useCallback(() => {}, [])

  // On mobile, return a centered fixed position instead of the draggable pos
  const effectivePos = isMobile() ? null : pos

  return { pos: effectivePos, onMouseDown, onTouchStart }
}
