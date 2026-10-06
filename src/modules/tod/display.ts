import { Spice } from './cards'
import { CardKind, Pack, Penalty } from './enums'

export const KIND_LABELS: Record<CardKind, string> = {
  [CardKind.TRUTH]: 'Sannhet',
  [CardKind.DARE]: 'Nødt',
  [CardKind.VIRUS]: 'Virus',
  [CardKind.RULE]: 'Regel',
  [CardKind.MISSION]: 'Hemmelig oppdrag',
}

export const PENALTY_LABELS: Record<Penalty, string> = {
  [Penalty.SIPS]: 'Drikk 2 slurker',
  [Penalty.SHOT]: 'Ta en shot',
}

export const SPICE_OPTIONS: { spice: Spice; name: string; hint: string }[] = [
  { spice: 1, name: 'Mild', hint: 'Fest med nye' },
  { spice: 2, name: 'Krydret', hint: 'Vanlig vors' },
  { spice: 3, name: 'Drøy', hint: 'Bare gamlinger' },
]

export const PACK_OPTIONS: { pack: Pack; name: string; hint: string }[] = [
  {
    pack: Pack.KSG,
    name: 'KSG og Samf',
    hint: 'Kort om gjengene, Soci og Samfundet',
  },
  {
    pack: Pack.VIRUS,
    name: 'Virus',
    hint: 'En spiller får en regel til neste virus',
  },
  {
    pack: Pack.RULE,
    name: 'Regler',
    hint: 'Gjelder alle til neste regel',
  },
  {
    pack: Pack.MISSION,
    name: 'Hemmelig oppdrag',
    hint: 'Bare én spiller ser kortet',
  },
  {
    pack: Pack.PHYSICAL,
    name: 'Fysiske nødt',
    hint: 'Kyss, lapdance o.l.',
  },
]

const PLAYER_COLOR_COUNT = 5

// Each player keeps one accent color from their place in the lobby.
export function playerColor(index: number) {
  return String(index % PLAYER_COLOR_COUNT)
}

export function firstName(name: string) {
  return name.split(' ')[0]
}
