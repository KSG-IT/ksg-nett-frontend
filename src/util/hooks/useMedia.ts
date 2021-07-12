export {}

// import { useState, useEffect } from 'react'

// const mediaQueries = {
//   mobile: 'screen and (max-width: 599px)',
//   tabletPortraitUp: 'screen and (min-width: 600px)',
//   tabletLandscapeUp: 'screen and (min-width: 900px',
//   desktopUp: 'screen and (min-width: 1200px)',
//   largeDesktopUp: 'screen and (max-width: 1800px)',
// }

// interface MediaQueryKeys {
//   mobile: boolean
//   tabletPortraitUp: boolean
//   tabletLandscapeUp: boolean
//   desktopUp: boolean
//   largeDesktopUp: boolean
// }
// export const useMedia = (queries: MediaQueryKeys) => {
//   const [queryMatch, setQueryMatch] = useState<null | any>(null)
//   const [isAttached, setIsAttached] = useState(false)

//   useEffect(() => {
//     const mediaQueryLists = {}
//     const keys = Object.keys(queries)

//     const handleQueryListener = () => {
//       const updateMatches: any = keys.reduce((acc: any, media) => {
//         acc[media] = !!(
//           mediaQueryLists[media] && mediaQueryLists[media].matches
//         )
//         return acc
//       }, {})

//       setQueryMatch(updatedMathes)
//     }

//     if (window !== undefined) {
//       const matches = {}
//       keys.forEach(media => {

//       })
//     }

//     // const handleWindowResize = () => setWidth(window.innerWidth)
//     // window.addEventListener('resize', handleWindowResize)
//     // return () => window.removeEventListener('resize', handleWindowResize)
//   }, [])

//   return {}
// }
