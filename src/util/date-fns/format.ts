import { format as formatBase } from 'date-fns'
import { nb } from 'date-fns/locale'

export function format(firstDate: Date, formatStr: string) {
  return formatBase(firstDate, formatStr, {
    locale: nb,
  })
}
