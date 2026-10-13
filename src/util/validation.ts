import { FILE_SIZE } from 'util/consts'
import { z } from 'zod'

export const requiredString = (message: string) =>
  z.string({ error: message }).min(1, message)

// User.nickname is a varchar(64) (ksg-nett-backend users/models.py). A longer
// value makes the database reject the save.
export const nicknameString = () =>
  z.string().max(64, 'Kallenavn kan ikke være lengre enn 64 tegn')

// Mantine date inputs give a YYYY-MM-DD string, or null when empty.
export const requiredIsoDate = (message: string) =>
  z.iso
    .date({ error: message })
    .nullable()
    .transform((value, ctx) => {
      if (value === null) {
        ctx.addIssue({ code: 'custom', message })
        return z.NEVER
      }
      return value
    })

export const optionalIsoDate = () => z.iso.date().nullish()

export const maxFileSize = (message = 'Filstørrelse for stor, 1 MB maks.') =>
  z
    .instanceof(File)
    .nullish()
    .refine(file => !file || file.size <= FILE_SIZE, message)
