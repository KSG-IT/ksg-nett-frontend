import { useEffect, useState } from 'react'

export function useMobile() {
  const [matches, setMatches] = useState(false)
  const mobileQuery = '(max-width: 768px)'

  useEffect(() => {
    const media = window.matchMedia(mobileQuery)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => {
      setMatches(media.matches)
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches])

  return [matches]
}

export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return { width }
}

export const useRenderMobile = () => {
  const { width } = useViewport()

  return width < 450
}
