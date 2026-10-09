import { useEffect } from 'react'

const GAME_BACKGROUND = '#0a0808'

// Let the game draw under the iOS notch and status bar. Without
// `viewport-fit=cover` Safari leaves white bars at the top in portrait and at
// the sides in landscape. The change is undone on unmount, so the rest of the
// app keeps its normal viewport.
export function useFullBleed() {
  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>(
      'meta[name="viewport"]'
    )
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    )
    const previousViewport = viewport?.content
    const previousTheme = themeColor?.content
    const previousHtmlBackground = document.documentElement.style.background
    const previousBodyBackground = document.body.style.background

    if (viewport && !viewport.content.includes('viewport-fit')) {
      viewport.content += ', viewport-fit=cover'
    }
    if (themeColor) themeColor.content = GAME_BACKGROUND
    document.documentElement.style.background = GAME_BACKGROUND
    document.body.style.background = GAME_BACKGROUND

    return () => {
      if (viewport && previousViewport !== undefined)
        viewport.content = previousViewport
      if (themeColor && previousTheme !== undefined)
        themeColor.content = previousTheme
      document.documentElement.style.background = previousHtmlBackground
      document.body.style.background = previousBodyBackground
    }
  }, [])
}
