import { RefObject, useEffect } from 'react'

// The open chat on a phone fills the visible part of the screen. When the
// keyboard opens, iOS Safari keeps 100dvh and scrolls the page instead, so the
// keyboard would cover the composer. The visual viewport is the part above the
// keyboard: its top and height go into CSS variables on the element, and the
// CSS pins the chat to them. This syncs with the browser, so it is an effect.
// `active` is false while the element is not rendered yet.
export function useVisualViewport(
  ref: RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    const viewport = window.visualViewport
    const element = ref.current
    if (!active || !viewport || !element) return

    function update() {
      if (!viewport || !element) return
      element.style.setProperty(
        '--chat-viewport-top',
        `${viewport.offsetTop}px`
      )
      element.style.setProperty(
        '--chat-viewport-height',
        `${viewport.height}px`
      )
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [ref, active])
}
