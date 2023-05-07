import queryString from 'query-string'

export function useQueryParameter(
  key: string | string[]
): string | { [k: string]: string | undefined } | undefined {
  const { search } = window.location
  const params = queryString.parse(search)

  if (typeof key === 'string') {
    return params[key] as string | undefined
  } else if (Array.isArray(key)) {
    const result: { [k: string]: string | undefined } = {}
    for (const k of key) {
      if (params[k] !== undefined) {
        result[k] = params[k] as string
      }
    }
    return result
  }

  return undefined
}
