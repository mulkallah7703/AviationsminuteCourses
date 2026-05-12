import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CountUp({ value, duration = 0.85 }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useMotionValueEvent(mv, 'change', (v) => {
    setDisplay(Math.round(v))
  })

  useEffect(() => {
    const controls = animate(mv, Number(value) || 0, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [value, duration, mv])

  return display
}
