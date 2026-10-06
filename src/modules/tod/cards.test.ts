import {
  CARDS,
  cardTextProblem,
  fillPlaceholders,
  KNOWN_PLACEHOLDER,
  playersNeeded,
} from './cards'
import { CardKind, CardTag } from './enums'

const KINDS: string[] = Object.values(CardKind)
const TAGS: string[] = Object.values(CardTag)
const PLACEHOLDER = /\{[^}]*\}/g

describe('cards.json', () => {
  it('has a unique id for each card', () => {
    const ids = CARDS.map(card => card.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses only known kinds, spice levels and tags', () => {
    for (const card of CARDS) {
      expect(KINDS).toContain(card.kind)
      expect([1, 2, 3]).toContain(card.spice)
      for (const tag of card.tags) expect(TAGS).toContain(tag)
    }
  })

  it('uses only known placeholders', () => {
    for (const card of CARDS) {
      for (const placeholder of card.text.match(PLACEHOLDER) ?? []) {
        expect(placeholder).toMatch(KNOWN_PLACEHOLDER)
      }
    }
  })

  it('gives each rule a title', () => {
    for (const card of CARDS.filter(card => card.kind === CardKind.RULE)) {
      expect(card.title).toBeTruthy()
    }
  })
})

describe('playersNeeded', () => {
  it('is the highest player placeholder', () => {
    expect(
      playersNeeded('Fuck, marry, kill: {player1}, {player2} og {player3}!')
    ).toBe(3)
    expect(playersNeeded('Kyss {player1}')).toBe(1)
  })

  it('is 0 without placeholders', () => {
    expect(playersNeeded('Hva er favorittmaten din?')).toBe(0)
  })
})

describe('fillPlaceholders', () => {
  it('fills players and groups', () => {
    expect(
      fillPlaceholders('{player1} og {player2} i {otherGroup}, ikke {group}', {
        players: ['Kari', 'Ola'],
        group: 'Edgar',
        otherGroup: 'Lyche',
      })
    ).toBe('Kari og Ola i Lyche, ikke Edgar')
  })

  it('keeps a placeholder without a value', () => {
    expect(fillPlaceholders('Kyss {player1}', { players: [] })).toBe(
      'Kyss {player1}'
    )
  })
})

describe('cardTextProblem', () => {
  it('accepts a text with known placeholders', () => {
    expect(cardTextProblem('Kyss {player1} fra {otherGroup}')).toBeNull()
  })
  it('rejects an empty text, a long text and unknown placeholders', () => {
    expect(cardTextProblem('   ')).not.toBeNull()
    expect(cardTextProblem('a'.repeat(301))).not.toBeNull()
    expect(cardTextProblem('Kyss {player4}')).toContain('{player4}')
  })
})
