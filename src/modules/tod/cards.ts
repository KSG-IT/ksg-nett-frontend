import cardData from './cards.json'
import { CardKind, CardTag } from './enums'

export type Spice = 1 | 2 | 3

export interface Card {
  id: string
  kind: CardKind
  title?: string
  text: string
  spice: Spice
  tags: CardTag[]
}

export const CARDS = cardData as Card[]

export const CARDS_BY_ID = new Map(CARDS.map(card => [card.id, card]))

const PLAYER_PLACEHOLDER = /\{player(\d)\}/g
const PLACEHOLDER = /\{[^}]*\}/g
export const KNOWN_PLACEHOLDER = /^\{(player[1-3]|group|otherGroup)\}$/
export const MAX_CARD_LENGTH = 300
export const MAX_TITLE_LENGTH = 40

// Why a title cannot be the name of a rule, or null when it can.
export function ruleTitleProblem(title: string | undefined) {
  const trimmed = title?.trim() ?? ''
  if (!trimmed) return 'Gi regelen et navn.'
  if (trimmed.length > MAX_TITLE_LENGTH)
    return `Maks ${MAX_TITLE_LENGTH} tegn i navnet.`
  return null
}

// Why a text cannot be a card, or null when it can.
export function cardTextProblem(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return 'Skriv teksten på kortet.'
  if (trimmed.length > MAX_CARD_LENGTH) return `Maks ${MAX_CARD_LENGTH} tegn.`
  const unknown = (trimmed.match(PLACEHOLDER) ?? []).find(
    placeholder => !KNOWN_PLACEHOLDER.test(placeholder)
  )
  if (unknown)
    return `Ukjent felt ${unknown}. Bruk {player1}–{player3}, {group} eller {otherGroup}.`
  return null
}

// The number of other players a card names, from its {playerN} placeholders.
export function playersNeeded(text: string) {
  const numbers = Array.from(text.matchAll(PLAYER_PLACEHOLDER), match =>
    Number(match[1])
  )
  return Math.max(0, ...numbers)
}

export function needsGroup(text: string) {
  return text.includes('{group}')
}

export function needsOtherGroup(text: string) {
  return text.includes('{otherGroup}')
}

interface PlaceholderValues {
  players: string[]
  group?: string | null
  otherGroup?: string | null
}

export function fillPlaceholders(
  text: string,
  { players, group, otherGroup }: PlaceholderValues
) {
  return text
    .replace(
      PLAYER_PLACEHOLDER,
      (placeholder, n) => players[n - 1] ?? placeholder
    )
    .replace('{group}', group ?? '{group}')
    .replace('{otherGroup}', otherGroup ?? '{otherGroup}')
}
