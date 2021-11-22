import { useState, useEffect } from 'react'

const mediaQueries = {
  mobile: 'screen and (max-width: 599px)',
  tabletPortraitUp: 'screen and (min-width: 600px)',
  tabletLandscapeUp: 'screen and (min-width: 900px',
  desktopUp: 'screen and (min-width: 1200px)',
  largeDesktopUp: 'screen and (max-width: 1800px)',
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => {
      setMatches(media.matches)
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
