import { useEffect, useState } from 'react'

function readBreakpoint() {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet'
  return 'desktop'
}

/** mobile <768 · tablet 768–1023 · desktop ≥1024 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(readBreakpoint)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)')
    const tablet = window.matchMedia('(max-width: 1023px)')

    function sync() {
      setBreakpoint(readBreakpoint())
    }

    mobile.addEventListener('change', sync)
    tablet.addEventListener('change', sync)
    return () => {
      mobile.removeEventListener('change', sync)
      tablet.removeEventListener('change', sync)
    }
  }, [])

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  }
}
