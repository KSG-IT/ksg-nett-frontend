// Text for the template generation dialog, from templateGenerationPreview.
import { format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'

export interface TemplateGenerationPreview {
  firstDay: string
  lastDay: string
  shiftsToCreate: number
  shiftsToDelete: number
  filledSlotsToDelete: number
  answersToDelete: number
  draftsToDelete: number
  // True when the generation deletes people, answers or drafts
  needsConfirmation: boolean
}

function day(date: string) {
  // parseISO reads a date as local time; new Date() would read it as UTC
  return format(parseISO(date), 'EEE d. MMM', { locale: nb })
}

export function generationSummary(preview: TemplateGenerationPreview) {
  const losses = [
    [preview.filledSlotsToDelete, 'plasser med folk', 'plass med folk'],
    [
      preview.answersToDelete,
      'svar på tilgjengelighet',
      'svar på tilgjengelighet',
    ],
    [preview.draftsToDelete, 'endringer i utkast', 'endring i utkast'],
  ] as const
  return {
    create: `Lager ${preview.shiftsToCreate} vakter fra ${day(
      preview.firstDay
    )} til ${day(preview.lastDay)}`,
    replace:
      preview.shiftsToDelete > 0
        ? `${preview.shiftsToDelete} vakter fra malen i disse ukene lages på nytt.`
        : null,
    losses: losses
      .filter(([count]) => count > 0)
      .map(([count, many, one]) => `${count} ${count === 1 ? one : many}`),
  }
}
