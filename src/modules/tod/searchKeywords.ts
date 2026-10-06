export const TOD_SEARCH_OPTION = '__truth-or-drink__'

const KEYWORDS = ['tod', 'skål', 'nødt', 'sannhet', 'truth or drink']
const MIN_LENGTH = 3

// The hidden search result shows when the search text is the start of a
// keyword, from 3 characters, so "skå" works but "to" does not.
export function isTodSearch(query: string) {
  const text = query.trim().toLowerCase()
  if (text.length < MIN_LENGTH) return false
  return KEYWORDS.some(keyword => keyword.startsWith(text))
}
