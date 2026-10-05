import { generationSummary } from './templateGeneration'

const preview = {
  firstDay: '2026-10-19',
  lastDay: '2026-11-01',
  shiftsToCreate: 16,
  shiftsToDelete: 0,
  filledSlotsToDelete: 0,
  answersToDelete: 0,
  draftsToDelete: 0,
  needsConfirmation: false,
}

describe('generationSummary', () => {
  it('gives the shifts to make and the whole weeks they cover', () => {
    expect(generationSummary(preview)).toEqual({
      create: 'Lager 16 vakter fra man 19. okt. til søn 1. nov.',
      replace: null,
      losses: [],
    })
  })

  it('tells that empty shifts of the template are made again', () => {
    expect(generationSummary({ ...preview, shiftsToDelete: 8 }).replace).toBe(
      '8 vakter fra malen i disse ukene lages på nytt.'
    )
  })

  it('lists what a delete removes', () => {
    const summary = generationSummary({
      ...preview,
      shiftsToDelete: 8,
      filledSlotsToDelete: 5,
      answersToDelete: 1,
      draftsToDelete: 0,
      needsConfirmation: true,
    })
    expect(summary.losses).toEqual([
      '5 plasser med folk',
      '1 svar på tilgjengelighet',
    ])
  })
})
