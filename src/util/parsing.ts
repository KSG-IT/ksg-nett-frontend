export function numberWithSpaces(x: number | string) {
  var parts
  if (typeof x === 'number') {
    parts = x.toString().split('.')
  } else if (typeof x === 'string') {
    parts = x.split('.')
  } else return
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}
