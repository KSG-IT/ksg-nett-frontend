import {
  Card,
  CARDS,
  CARDS_BY_ID,
  cardTextProblem,
  fillPlaceholders,
  needsGroup,
  needsOtherGroup,
  playersNeeded,
  ruleTitleProblem,
  Spice,
} from './cards'
import { CardKind, CardTag, Pack, Penalty } from './enums'

export interface Player {
  id: string
  name: string
  initials: string
  userId: string | null
  profileImage: string | null
  group: string | null
  drinks: number
  jokers: number
}

export type NewPlayer = Omit<Player, 'drinks' | 'jokers'>

export type EventKind = 'virus' | 'rule' | 'mission'

export interface DeckEdits {
  // Ids of built-in cards the group took out.
  removed: string[]
  // Cards the group wrote, with the ids custom:1, custom:2 and so on.
  custom: Card[]
}

export type NewCard = Pick<Card, 'kind' | 'title' | 'text' | 'spice'>

// Why a new card cannot be added, or null when it can. A rule needs a name,
// because the rail and the overlay show it.
export function newCardProblem(card: NewCard) {
  if (card.kind === CardKind.RULE) {
    const problem = ruleTitleProblem(card.title)
    if (problem) return problem
  }
  return cardTextProblem(card.text)
}

export interface Settings {
  spice: Spice
  packs: Record<Pack, boolean>
  penalty: Penalty
  // Opt-in: each player can skip one card without drinking.
  jokers: boolean
  // Turns until a secret mission is revealed, or null for no deadline.
  missionTurns: number | null
  // Turns between two events of a kind, or null to follow the player count.
  eventTurns: Record<EventKind, number | null>
}

export interface DrawnCard {
  cardId: string
  kind: CardKind
  title?: string
  text: string
}

export interface Assignment {
  playerId: string
  card: DrawnCard
}

export interface Mission extends Assignment {
  // The turn the mission came. One mission comes per turn at most.
  id: number
  // Turns until the mission is revealed, or null without a deadline.
  turnsLeft: number | null
}

export type GameEvent =
  | { type: 'virus'; assignment: Assignment }
  | { type: 'rule'; card: DrawnCard }
  | { type: 'mission'; assignment: Assignment }
  // A mission is shown to all for a verdict. Due: the deadline ran out.
  | { type: 'missionReveal'; missionId: number; due: boolean }
  | { type: 'reshuffled' }

export interface GameState {
  version: 1
  phase: 'lobby' | 'playing'
  players: Player[]
  settings: Settings
  // Internal group names for {otherGroup}.
  groups: string[]
  seed: number
  turn: number
  current: number
  decks: Record<DeckName, string[]>
  card: DrawnCard | null
  virus: Assignment | null
  rule: DrawnCard | null
  missions: Mission[]
  events: GameEvent[]
  // Fixed when the game starts, so players who join do not change them.
  eventTurns: Record<EventKind, number>
  // The turn of the next event of each kind.
  nextEvent: Record<EventKind, number>
  deckEdits: DeckEdits
}

export type GameAction =
  | { type: 'addPlayer'; player: NewPlayer }
  | { type: 'removePlayer'; playerId: string }
  | { type: 'setSpice'; spice: Spice }
  | { type: 'togglePack'; pack: Pack }
  | { type: 'setPenalty'; penalty: Penalty }
  | { type: 'toggleJokers' }
  | { type: 'setMissionTurns'; turns: number | null }
  | { type: 'setEventTurns'; kind: EventKind; turns: number | null }
  | { type: 'setGroups'; groups: string[] }
  | { type: 'toggleCard'; cardId: string }
  | { type: 'addCard'; card: NewCard }
  | { type: 'deleteCard'; cardId: string }
  | { type: 'start' }
  | { type: 'next' }
  | { type: 'drink' }
  | { type: 'joker' }
  | { type: 'dismissEvent' }
  | { type: 'revealMission'; missionId: number }
  | { type: 'judgeMission'; missionId: number; completed: boolean }
  | { type: 'endGame' }
  // The seed comes from outside, so the reducer stays pure.
  | { type: 'reset'; seed: number }

export const MIN_PLAYERS = 2
export const JOKERS_PER_PLAYER = 1

export const DEFAULT_SETTINGS: Settings = {
  spice: 2,
  packs: {
    [Pack.KSG]: true,
    [Pack.VIRUS]: true,
    [Pack.RULE]: true,
    [Pack.MISSION]: true,
    [Pack.PHYSICAL]: true,
  },
  penalty: Penalty.SIPS,
  jokers: false,
  missionTurns: null,
  eventTurns: { virus: null, rule: null, mission: null },
}

// A new virus comes every round, a new rule every second round and a new
// secret mission every third round. A round is one turn per player.
export function defaultEventTurns(
  playerCount: number
): Record<EventKind, number> {
  const round = Math.max(playerCount, MIN_PLAYERS)
  return { virus: round, rule: round * 2, mission: round * 3 }
}

export function resolveEventTurns(
  settings: Settings,
  playerCount: number
): Record<EventKind, number> {
  const defaults = defaultEventTurns(playerCount)
  return {
    virus: settings.eventTurns.virus ?? defaults.virus,
    rule: settings.eventTurns.rule ?? defaults.rule,
    mission: settings.eventTurns.mission ?? defaults.mission,
  }
}

// The first mission comes half an interval in, so it does not come on the
// same turn as a virus or a rule.
function scheduleFrom(
  turn: number,
  eventTurns: Record<EventKind, number>
): Record<EventKind, number> {
  return {
    virus: turn + eventTurns.virus,
    rule: turn + eventTurns.rule,
    mission: turn + Math.ceil(eventTurns.mission / 2),
  }
}

export function createInitialState(seed: number): GameState {
  return {
    version: 1,
    phase: 'lobby',
    players: [],
    settings: DEFAULT_SETTINGS,
    groups: [],
    seed,
    turn: 0,
    current: 0,
    decks: { main: [], virus: [], rule: [], mission: [] },
    card: null,
    virus: null,
    rule: null,
    missions: [],
    events: [],
    eventTurns: defaultEventTurns(0),
    nextEvent: scheduleFrom(0, defaultEventTurns(0)),
    deckEdits: { removed: [], custom: [] },
  }
}

// The built-in cards the group kept and the cards the group wrote.
export function deckCards(edits: DeckEdits) {
  const removed = new Set(edits.removed)
  return [...CARDS.filter(card => !removed.has(card.id)), ...edits.custom]
}

function cardById(state: GameState, id: string) {
  return (
    CARDS_BY_ID.get(id) ?? state.deckEdits.custom.find(card => card.id === id)
  )
}

export function isCustomCard(card: Card) {
  return card.id.startsWith('custom:')
}

function addCard(edits: DeckEdits, card: NewCard): DeckEdits {
  if (newCardProblem(card)) return edits
  const numbers = edits.custom.map(custom => Number(custom.id.split(':')[1]))
  const custom: Card = {
    id: `custom:${Math.max(0, ...numbers) + 1}`,
    kind: card.kind,
    text: card.text.trim(),
    spice: card.spice,
    tags: [],
  }
  if (card.kind === CardKind.RULE) custom.title = card.title?.trim()
  return { ...edits, custom: [...edits.custom, custom] }
}

function toggleCard(edits: DeckEdits, cardId: string): DeckEdits {
  if (!CARDS_BY_ID.has(cardId)) return edits
  const removed = edits.removed.includes(cardId)
    ? edits.removed.filter(id => id !== cardId)
    : [...edits.removed, cardId]
  return { ...edits, removed }
}

// mulberry32: a small seeded generator, so the reducer stays pure.
function createRandom(seed: number) {
  let state = seed >>> 0
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return { next, seed: () => state }
}

type Random = ReturnType<typeof createRandom>

function shuffle<T>(items: T[], random: Random) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random.next() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Tags that belong to a pack. A card with such a tag needs the pack on.
const PACK_BY_TAG: Partial<Record<CardTag, Pack>> = {
  [CardTag.KSG]: Pack.KSG,
  [CardTag.PHYSICAL]: Pack.PHYSICAL,
}

// Viruses, rules and missions have their own pack. Truth and dare do not.
export const PACK_BY_KIND: Partial<Record<CardKind, Pack>> = {
  [CardKind.VIRUS]: Pack.VIRUS,
  [CardKind.RULE]: Pack.RULE,
  [CardKind.MISSION]: Pack.MISSION,
}

export type CardExclusion = { reason: 'spice' } | { reason: 'pack'; pack: Pack }

// Why the settings leave a card out of the game, or null when it is in.
// A card is in when its own pack and every pack its tags belong to are on,
// and its spice is at or below the chosen level.
export function cardExclusion(
  card: Card,
  settings: Settings
): CardExclusion | null {
  const packs = [PACK_BY_KIND[card.kind], ...card.tags.map(t => PACK_BY_TAG[t])]
  const off = packs.find(pack => pack !== undefined && !settings.packs[pack])
  if (off) return { reason: 'pack', pack: off }
  if (card.spice > settings.spice) return { reason: 'spice' }
  return null
}

export function isCardAllowed(card: Card, settings: Settings) {
  return cardExclusion(card, settings) === null
}

type DeckName = 'main' | 'virus' | 'rule' | 'mission'

const KINDS_BY_DECK: Record<DeckName, CardKind[]> = {
  main: [CardKind.TRUTH, CardKind.DARE],
  virus: [CardKind.VIRUS],
  rule: [CardKind.RULE],
  mission: [CardKind.MISSION],
}

function buildDeck(name: DeckName, state: GameState, random: Random) {
  const kinds = KINDS_BY_DECK[name]
  const ids = deckCards(state.deckEdits)
    .filter(
      card => kinds.includes(card.kind) && isCardAllowed(card, state.settings)
    )
    .map(card => card.id)
  return shuffle(ids, random)
}

function otherPlayers(players: Player[], playerId: string) {
  return players.filter(player => player.id !== playerId)
}

function otherGroups(groups: string[], group: string | null) {
  return groups.filter(name => name !== group)
}

export function canPlay(
  card: Card,
  player: Player,
  players: Player[],
  groups: string[]
) {
  if (playersNeeded(card.text) > otherPlayers(players, player.id).length)
    return false
  if (needsGroup(card.text) && !player.group) return false
  if (
    needsOtherGroup(card.text) &&
    otherGroups(groups, player.group).length === 0
  )
    return false
  return true
}

function drawFor(
  card: Card,
  player: Player,
  state: GameState,
  random: Random
): DrawnCard {
  const names = shuffle(otherPlayers(state.players, player.id), random).map(
    other => other.name.split(' ')[0]
  )
  const groups = shuffle(otherGroups(state.groups, player.group), random)
  return {
    cardId: card.id,
    kind: card.kind,
    title: card.title,
    text: fillPlaceholders(card.text, {
      players: names,
      group: player.group,
      otherGroup: groups[0],
    }),
  }
}

interface Draw {
  deck: string[]
  card: DrawnCard | null
  reshuffled: boolean
}

// Take the first card in the deck that the player can play. When no card
// fits, build the deck again once, so a long game never runs out.
function draw(
  name: DeckName,
  deck: string[],
  player: Player,
  state: GameState,
  random: Random
): Draw {
  const take = (ids: string[]) => {
    const index = ids.findIndex(id => {
      const card = cardById(state, id)
      return card && canPlay(card, player, state.players, state.groups)
    })
    if (index === -1) return null
    const card = cardById(state, ids[index]) as Card
    return {
      deck: [...ids.slice(0, index), ...ids.slice(index + 1)],
      card: drawFor(card, player, state, random),
    }
  }

  const fromDeck = take(deck)
  if (fromDeck) return { ...fromDeck, reshuffled: false }

  const fresh = take(buildDeck(name, state, random))
  if (fresh) return { ...fresh, reshuffled: true }

  return { deck: [], card: null, reshuffled: false }
}

function pickPlayer(players: Player[], excludeId: string, random: Random) {
  const candidates =
    players.length > 1 ? otherPlayers(players, excludeId) : players
  return candidates[Math.floor(random.next() * candidates.length)]
}

// A game saved before deadlines has no turnsLeft, or NaN after a tick.
// Both count as no deadline.
export function hasDeadline(
  mission: Mission
): mission is Mission & { turnsLeft: number } {
  return Number.isFinite(mission.turnsLeft)
}

function tick(mission: Mission): Mission {
  if (!hasDeadline(mission)) return { ...mission, turnsLeft: null }
  return { ...mission, turnsLeft: mission.turnsLeft - 1 }
}

function advance(state: GameState, players: Player[]): GameState {
  const random = createRandom(state.seed)
  const turn = state.turn + 1
  const current = (state.current + 1) % players.length
  const next: GameState = { ...state, players, turn, current }
  const player = players[current]
  const events: GameEvent[] = []
  const decks = { ...state.decks }

  const main = draw('main', decks.main, player, next, random)
  decks.main = main.deck
  if (main.reshuffled) events.push({ type: 'reshuffled' })

  // Each turn brings every mission deadline one turn closer.
  let missions = state.missions.map(tick)
  for (const mission of missions) {
    if (mission.turnsLeft === 0)
      events.push({ type: 'missionReveal', missionId: mission.id, due: true })
  }

  // An event that is due also sets the turn of the next one of its kind.
  const nextEvent = { ...state.nextEvent }
  const due = (kind: EventKind) => {
    if (turn < nextEvent[kind]) return false
    nextEvent[kind] = turn + state.eventTurns[kind]
    return true
  }
  const { packs, missionTurns } = state.settings
  let { virus, rule } = state

  if (due('virus') && packs[Pack.VIRUS]) {
    const target = pickPlayer(players, player.id, random)
    const result = draw('virus', decks.virus, target, next, random)
    decks.virus = result.deck
    if (result.card) {
      virus = { playerId: target.id, card: result.card }
      events.push({ type: 'virus', assignment: virus })
    }
  }

  if (due('rule') && packs[Pack.RULE]) {
    const result = draw('rule', decks.rule, player, next, random)
    decks.rule = result.deck
    if (result.card) {
      rule = result.card
      events.push({ type: 'rule', card: rule })
    }
  }

  if (due('mission') && packs[Pack.MISSION]) {
    const target = pickPlayer(players, player.id, random)
    const result = draw('mission', decks.mission, target, next, random)
    decks.mission = result.deck
    if (result.card) {
      const mission = {
        id: turn,
        playerId: target.id,
        card: result.card,
        turnsLeft: missionTurns ?? null,
      }
      missions = [...missions, mission]
      events.push({
        type: 'mission',
        assignment: { playerId: target.id, card: result.card },
      })
    }
  }

  return {
    ...next,
    seed: random.seed(),
    decks,
    card: main.card,
    virus,
    rule,
    missions,
    events: [...state.events, ...events],
    nextEvent,
  }
}

function startGame(state: GameState): GameState {
  const random = createRandom(state.seed)
  const players = state.players.map(player => ({
    ...player,
    drinks: 0,
    jokers: state.settings.jokers ? JOKERS_PER_PLAYER : 0,
  }))
  const eventTurns = resolveEventTurns(state.settings, players.length)
  const fresh: GameState = {
    ...state,
    phase: 'playing',
    players,
    turn: 0,
    current: 0,
    decks: {
      main: buildDeck('main', state, random),
      virus: buildDeck('virus', state, random),
      rule: buildDeck('rule', state, random),
      mission: buildDeck('mission', state, random),
    },
    card: null,
    virus: null,
    rule: null,
    missions: [],
    events: [],
    eventTurns,
    nextEvent: scheduleFrom(0, eventTurns),
  }
  const player = players[0]
  const decks = { ...fresh.decks }
  const main = draw('main', decks.main, player, fresh, random)
  decks.main = main.deck
  const events: GameEvent[] = []
  let rule: DrawnCard | null = null

  // The game opens with a rule, so the table has something to follow at once.
  if (state.settings.packs[Pack.RULE]) {
    const result = draw('rule', decks.rule, player, fresh, random)
    decks.rule = result.deck
    rule = result.card
    if (rule) events.push({ type: 'rule', card: rule })
  }

  return {
    ...fresh,
    seed: random.seed(),
    decks,
    card: main.card,
    rule,
    events,
  }
}

function forgetPlayer(event: GameEvent, playerId: string, missions: Mission[]) {
  if (event.type === 'virus' || event.type === 'mission')
    return event.assignment.playerId !== playerId
  if (event.type === 'missionReveal')
    return missions.some(mission => mission.id === event.missionId)
  return true
}

// A player leaves in the middle of a game. Their virus, missions and events
// go too. When they had the turn, the next player gets it with a new card.
function removeFromGame(state: GameState, playerId: string): GameState {
  const index = state.players.findIndex(player => player.id === playerId)
  if (index === -1) return state
  const players = state.players.filter(player => player.id !== playerId)
  const missions = state.missions.filter(
    mission => mission.playerId !== playerId
  )
  const base: GameState = {
    ...state,
    players,
    virus: state.virus?.playerId === playerId ? null : state.virus,
    missions,
    events: state.events.filter(event =>
      forgetPlayer(event, playerId, missions)
    ),
  }

  if (players.length < MIN_PLAYERS)
    return { ...base, phase: 'lobby', events: [] }
  if (index > state.current) return base
  if (index < state.current) return { ...base, current: state.current - 1 }

  const current = state.current % players.length
  const random = createRandom(state.seed)
  const next = { ...base, current }
  const main = draw('main', state.decks.main, players[current], next, random)
  return {
    ...next,
    seed: random.seed(),
    decks: { ...state.decks, main: main.deck },
    card: main.card,
  }
}

function updateCurrent(state: GameState, update: (player: Player) => Player) {
  return state.players.map((player, index) =>
    index === state.current ? update(player) : player
  )
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'addPlayer': {
      const exists = state.players.some(
        player =>
          player.id === action.player.id ||
          (action.player.userId !== null &&
            player.userId === action.player.userId)
      )
      if (exists) return state
      // A player who joins a running game gets a joker like everyone else.
      const jokers =
        state.phase === 'playing' && state.settings.jokers
          ? JOKERS_PER_PLAYER
          : 0
      const player = { ...action.player, drinks: 0, jokers }
      return { ...state, players: [...state.players, player] }
    }
    case 'removePlayer':
      if (state.phase === 'playing')
        return removeFromGame(state, action.playerId)
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.playerId),
      }
    case 'setSpice':
      return { ...state, settings: { ...state.settings, spice: action.spice } }
    case 'togglePack': {
      const { packs } = state.settings
      return {
        ...state,
        settings: {
          ...state.settings,
          packs: { ...packs, [action.pack]: !packs[action.pack] },
        },
      }
    }
    case 'setPenalty':
      return {
        ...state,
        settings: { ...state.settings, penalty: action.penalty },
      }
    case 'toggleJokers':
      return {
        ...state,
        settings: { ...state.settings, jokers: !state.settings.jokers },
      }
    case 'setMissionTurns':
      return {
        ...state,
        settings: { ...state.settings, missionTurns: action.turns },
      }
    case 'setEventTurns':
      return {
        ...state,
        settings: {
          ...state.settings,
          eventTurns: {
            ...state.settings.eventTurns,
            [action.kind]:
              action.turns === null ? null : Math.max(1, action.turns),
          },
        },
      }
    case 'setGroups':
      return { ...state, groups: action.groups }
    case 'toggleCard':
      return { ...state, deckEdits: toggleCard(state.deckEdits, action.cardId) }
    case 'addCard':
      return { ...state, deckEdits: addCard(state.deckEdits, action.card) }
    case 'deleteCard':
      return {
        ...state,
        deckEdits: {
          ...state.deckEdits,
          custom: state.deckEdits.custom.filter(
            card => card.id !== action.cardId
          ),
        },
      }
    case 'start':
      if (state.players.length < MIN_PLAYERS) return state
      return startGame(state)
    case 'next':
      if (state.phase !== 'playing') return state
      return advance(state, state.players)
    case 'drink':
      if (state.phase !== 'playing') return state
      return advance(
        state,
        updateCurrent(state, player => ({
          ...player,
          drinks: player.drinks + 1,
        }))
      )
    case 'joker': {
      if (state.phase !== 'playing') return state
      if (state.players[state.current].jokers === 0) return state
      return advance(
        state,
        updateCurrent(state, player => ({
          ...player,
          jokers: player.jokers - 1,
        }))
      )
    }
    case 'dismissEvent':
      return { ...state, events: state.events.slice(1) }
    case 'revealMission': {
      const shown = state.events.some(
        event =>
          event.type === 'missionReveal' && event.missionId === action.missionId
      )
      if (shown || !missionById(state, action.missionId)) return state
      const reveal: GameEvent = {
        type: 'missionReveal',
        missionId: action.missionId,
        due: false,
      }
      return { ...state, events: [reveal, ...state.events] }
    }
    case 'judgeMission':
      return judgeMission(state, action.missionId, action.completed)
    case 'endGame':
      return { ...state, phase: 'lobby', events: [] }
    // The card edits stay, so a reset does not delete cards the group wrote.
    case 'reset':
      return { ...createInitialState(action.seed), deckEdits: state.deckEdits }
  }
}

export function currentPlayer(state: GameState) {
  return state.players[state.current] ?? null
}

export function missionById(state: GameState, missionId: number) {
  return state.missions.find(mission => mission.id === missionId) ?? null
}

// The mission ends. A player who did not complete it takes the penalty.
function judgeMission(
  state: GameState,
  missionId: number,
  completed: boolean
): GameState {
  const mission = missionById(state, missionId)
  if (!mission) return state
  return {
    ...state,
    players: state.players.map(player =>
      !completed && player.id === mission.playerId
        ? { ...player, drinks: player.drinks + 1 }
        : player
    ),
    missions: state.missions.filter(m => m.id !== missionId),
    events: state.events.filter(
      event =>
        !(event.type === 'missionReveal' && event.missionId === missionId)
    ),
  }
}

export function playerById(state: GameState, playerId: string) {
  return state.players.find(player => player.id === playerId) ?? null
}

// A saved game from an older version, or a broken value, starts a new lobby.
export function restoreState(saved: unknown, seed: number): GameState {
  const initial = createInitialState(seed)
  if (typeof saved !== 'object' || saved === null) return initial
  const candidate = saved as Partial<GameState>
  if (candidate.version !== 1 || !Array.isArray(candidate.players))
    return initial
  // A setting added after the game was saved gets its default value.
  const settings = {
    ...DEFAULT_SETTINGS,
    ...candidate.settings,
    packs: { ...DEFAULT_SETTINGS.packs, ...candidate.settings?.packs },
    eventTurns: {
      ...DEFAULT_SETTINGS.eventTurns,
      ...candidate.settings?.eventTurns,
    },
  }
  // A game saved before the event settings goes on with the player count.
  const turn = candidate.turn ?? 0
  const eventTurns =
    candidate.eventTurns ??
    resolveEventTurns(settings, candidate.players.length)
  const nextEvent = candidate.nextEvent ?? scheduleFrom(turn, eventTurns)
  // Missions saved before deadlines get an id and no deadline.
  const missions = (candidate.missions ?? []).map((mission, index) => ({
    ...mission,
    id: mission.id ?? -(index + 1),
    turnsLeft: mission.turnsLeft ?? null,
  }))
  return {
    ...initial,
    ...candidate,
    settings,
    missions,
    events: candidate.events ?? [],
    eventTurns,
    nextEvent,
    deckEdits: {
      removed: candidate.deckEdits?.removed ?? [],
      custom: candidate.deckEdits?.custom ?? [],
    },
  }
}
