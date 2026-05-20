import { useEffect, useRef, useState } from 'react'

/**
 * Tracks an element's pixel width via ResizeObserver. SVG charts render at
 * the measured width so strokes never distort the way preserveAspectRatio
 * scaling would.
 */
export function useMeasure<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}
