export function numberWithSpaces(x: number | string | null | undefined) {
  if (x === undefined || x === null) return ''
  var parts
  if (typeof x === 'number') {
    parts = x.toString().split('.')
  } else if (typeof x === 'string') {
    parts = x.split('.')
  } else return
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}
