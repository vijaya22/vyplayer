import { useRef, useState, useCallback } from 'react'

export function useDraggable(initialPos) {
  const [pos, setPos] = useState(initialPos)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
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

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    dragging.current = true
    offset.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y }

    function onMove(e) {
      if (!dragging.current) return
      const t = e.touches[0]
      setPos({ x: t.clientX - offset.current.x, y: t.clientY - offset.current.y })
    }

    function onEnd() {
      dragging.current = false
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }

    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }, [pos])

  return { pos, onMouseDown, onTouchStart }
}
