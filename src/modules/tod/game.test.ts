import { CARDS_BY_ID } from './cards'
import { CardKind, CardTag, Pack } from './enums'
import {
  canPlay,
  cardExclusion,
  createInitialState,
  deckCards,
  DEFAULT_SETTINGS,
  GameAction,
  gameReducer,
  defaultEventTurns,
  GameState,
  hasDeadline,
  isCardAllowed,
  NewPlayer,
  Player,
  restoreState,
} from './game'

function newPlayer(name: string, group: string | null = null): NewPlayer {
  return {
    id: `guest:${name}`,
    name,
    initials: name[0],
    userId: null,
    profileImage: null,
    group,
  }
}

function play(state: GameState, ...actions: GameAction[]) {
  return actions.reduce(gameReducer, state)
}

function lobby(names: string[], seed = 42) {
  return play(
    createInitialState(seed),
    ...names.map(name => ({
      type: 'addPlayer' as const,
      player: newPlayer(name),
    }))
  )
}

const asPlayer = (player: NewPlayer): Player => ({
  ...player,
  drinks: 0,
  jokers: 1,
})

describe('lobby', () => {
  it('adds a member only once', () => {
    const member = { ...newPlayer('Kari'), id: 'user:1', userId: '1' }
    const state = play(
      createInitialState(1),
      { type: 'addPlayer', player: member },
      { type: 'addPlayer', player: { ...member, id: 'user:1b' } }
    )
    expect(state.players).toHaveLength(1)
  })

  it('does not start with fewer than 2 players', () => {
    const state = play(lobby(['Kari']), { type: 'start' })
    expect(state.phase).toBe('lobby')
  })

  it('removes a player', () => {
    const state = play(lobby(['Kari', 'Ola']), {
      type: 'removePlayer',
      playerId: 'guest:Kari',
    })
    expect(state.players.map(player => player.name)).toEqual(['Ola'])
  })
})

describe('start', () => {
  it('draws a card for the first player and opens with a rule', () => {
    const state = play(lobby(['Kari', 'Ola', 'Mari']), { type: 'start' })
    expect(state.phase).toBe('playing')
    expect(state.current).toBe(0)
    expect(state.card).not.toBeNull()
    expect(state.rule).not.toBeNull()
    expect(state.events[0].type).toBe('rule')
  })

  it('does not open with a rule when rules are off', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      { type: 'togglePack', pack: Pack.RULE },
      { type: 'start' }
    )
    expect(state.rule).toBeNull()
    expect(state.events).toEqual([])
  })

  it('resets drinks and jokers', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      { type: 'toggleJokers' },
      { type: 'start' },
      { type: 'drink' },
      { type: 'joker' },
      { type: 'endGame' },
      { type: 'start' }
    )
    expect(state.players.map(p => [p.drinks, p.jokers])).toEqual([
      [0, 1],
      [0, 1],
    ])
  })
})

describe('turns', () => {
  it('moves to the next player and wraps around', () => {
    const state = play(
      lobby(['Kari', 'Ola', 'Mari']),
      { type: 'start' },
      { type: 'next' },
      { type: 'next' },
      { type: 'next' }
    )
    expect(state.turn).toBe(3)
    expect(state.current).toBe(0)
  })

  it('counts a drink for the player whose turn it was', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      { type: 'start' },
      { type: 'drink' }
    )
    expect(state.players[0].drinks).toBe(1)
    expect(state.current).toBe(1)
  })

  it('has no jokers unless they are turned on', () => {
    const state = play(lobby(['Kari', 'Ola']), { type: 'start' })
    expect(state.players.map(player => player.jokers)).toEqual([0, 0])
    expect(gameReducer(state, { type: 'joker' })).toBe(state)
  })

  it('uses a joker once', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      { type: 'toggleJokers' },
      { type: 'start' },
      { type: 'joker' },
      { type: 'next' }
    )
    const again = gameReducer(state, { type: 'joker' })
    expect(state.players[0].jokers).toBe(0)
    expect(again).toBe(state)
  })

  it('never draws the same main card twice before the deck is empty', () => {
    let state = play(lobby(['Kari', 'Ola', 'Mari', 'Jonas']), { type: 'start' })
    const seen = new Set([state.card?.cardId])
    const size = state.decks.main.length
    for (let i = 0; i < size; i++) {
      state = gameReducer(state, { type: 'next' })
      if (state.events.some(event => event.type === 'reshuffled')) break
      expect(seen.has(state.card?.cardId)).toBe(false)
      seen.add(state.card?.cardId)
    }
  })

  it('builds the deck again when it is empty', () => {
    let state = play(lobby(['Kari', 'Ola']), { type: 'start' })
    state = { ...state, decks: { ...state.decks, main: [] } }
    state = gameReducer(state, { type: 'next' })
    expect(state.card).not.toBeNull()
    expect(state.events.map(event => event.type)).toContain('reshuffled')
  })

  it('is the same game for the same seed', () => {
    const run = () =>
      play(
        lobby(['Kari', 'Ola', 'Mari'], 7),
        { type: 'start' },
        { type: 'next' },
        { type: 'drink' }
      )
    expect(run().card).toEqual(run().card)
  })
})

describe('events', () => {
  it('gives a virus to another player once per round', () => {
    const state = play(
      lobby(['Kari', 'Ola', 'Mari']),
      { type: 'start' },
      { type: 'next' },
      { type: 'next' },
      { type: 'next' }
    )
    expect(state.virus).not.toBeNull()
    expect(state.virus?.playerId).not.toBe(state.players[state.current].id)
    expect(state.events.map(event => event.type)).toContain('virus')
  })

  it('gives no virus when viruses are off', () => {
    let state = play(
      lobby(['Kari', 'Ola']),
      { type: 'togglePack', pack: Pack.VIRUS },
      { type: 'start' }
    )
    for (let i = 0; i < 10; i++) state = gameReducer(state, { type: 'next' })
    expect(state.virus).toBeNull()
  })

  it('removes the first event on dismiss', () => {
    const state = play(lobby(['Kari', 'Ola']), { type: 'start' })
    expect(gameReducer(state, { type: 'dismissEvent' }).events).toEqual(
      state.events.slice(1)
    )
  })

  it('gives secret missions to other players', () => {
    let state = play(lobby(['Kari', 'Ola']), { type: 'start' })
    for (let i = 0; i < 3; i++) state = gameReducer(state, { type: 'next' })
    expect(state.missions).toHaveLength(1)
  })
})

describe('isCardAllowed', () => {
  const card = (id: string) => {
    const found = CARDS_BY_ID.get(id)
    if (!found) throw new Error(`No card ${id}`)
    return found
  }

  it('hides cards above the spice level', () => {
    const spicy = [...CARDS_BY_ID.values()].find(c => c.spice === 3)
    expect(spicy).toBeDefined()
    if (!spicy) return
    expect(isCardAllowed(spicy, { ...DEFAULT_SETTINGS, spice: 2 })).toBe(false)
    expect(isCardAllowed(spicy, { ...DEFAULT_SETTINGS, spice: 3 })).toBe(true)
  })

  it('has every pack on by default', () => {
    expect(Object.values(DEFAULT_SETTINGS.packs).every(Boolean)).toBe(true)
  })

  it('hides physical cards when the pack is off', () => {
    const physical = [...CARDS_BY_ID.values()].find(
      c => c.tags.includes(CardTag.PHYSICAL) && c.spice === 1
    )
    expect(physical).toBeDefined()
    if (!physical) return
    expect(isCardAllowed(physical, DEFAULT_SETTINGS)).toBe(true)
    const packs = { ...DEFAULT_SETTINGS.packs, [Pack.PHYSICAL]: false }
    expect(isCardAllowed(physical, { ...DEFAULT_SETTINGS, packs })).toBe(false)
  })

  it('knows the first card', () => {
    expect(card('c001').kind).toBe(CardKind.TRUTH)
  })
})

describe('canPlay', () => {
  const kari = asPlayer(newPlayer('Kari', 'Edgar'))
  const ola = asPlayer(newPlayer('Ola'))
  const threePlayers = [...CARDS_BY_ID.values()].find(c =>
    c.text.includes('{player3}')
  )
  const otherGroup = [...CARDS_BY_ID.values()].find(c =>
    c.text.includes('{otherGroup}')
  )

  it('needs enough other players', () => {
    if (!threePlayers) throw new Error('No card with {player3}')
    expect(canPlay(threePlayers, kari, [kari, ola], [])).toBe(false)
  })

  it('needs another group for {otherGroup}', () => {
    if (!otherGroup) throw new Error('No card with {otherGroup}')
    expect(canPlay(otherGroup, kari, [kari, ola], ['Edgar'])).toBe(false)
    expect(canPlay(otherGroup, kari, [kari, ola], ['Edgar', 'Lyche'])).toBe(
      true
    )
  })
})

describe('players during a game', () => {
  const started = (names: string[]) =>
    play(
      lobby(names),
      { type: 'togglePack', pack: Pack.RULE },
      { type: 'start' }
    )

  it('adds a player at the end of the round', () => {
    const state = play(started(['Kari', 'Ola']), {
      type: 'addPlayer',
      player: newPlayer('Mari'),
    })
    expect(state.players.map(p => p.name)).toEqual(['Kari', 'Ola', 'Mari'])
    expect(state.current).toBe(0)
  })

  it('gives a new player a joker when jokers are on', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      { type: 'toggleJokers' },
      { type: 'start' },
      { type: 'addPlayer', player: newPlayer('Mari') }
    )
    expect(state.players[2].jokers).toBe(1)
  })

  it('keeps the turn when an earlier player leaves', () => {
    let state = started(['Kari', 'Ola', 'Mari'])
    state = play(state, { type: 'next' }, { type: 'next' })
    const card = state.card
    state = gameReducer(state, { type: 'removePlayer', playerId: 'guest:Kari' })
    expect(state.players[state.current].name).toBe('Mari')
    expect(state.card).toEqual(card)
  })

  it('gives the turn and a new card to the next player when the current one leaves', () => {
    const before = started(['Kari', 'Ola', 'Mari'])
    const state = gameReducer(before, {
      type: 'removePlayer',
      playerId: 'guest:Kari',
    })
    expect(state.players[state.current].name).toBe('Ola')
    expect(state.card).not.toBeNull()
    expect(state.card?.cardId).not.toBe(before.card?.cardId)
  })

  it('wraps to the first player when the last one leaves on their turn', () => {
    let state = started(['Kari', 'Ola', 'Mari'])
    state = play(state, { type: 'next' }, { type: 'next' })
    state = gameReducer(state, { type: 'removePlayer', playerId: 'guest:Mari' })
    expect(state.current).toBe(0)
  })

  it('removes the virus and missions of a player who leaves', () => {
    let state = started(['Kari', 'Ola', 'Mari'])
    for (let i = 0; i < 5; i++) state = gameReducer(state, { type: 'next' })
    const infected = state.virus?.playerId
    expect(infected).toBeDefined()
    if (!infected) return
    state = gameReducer(state, { type: 'removePlayer', playerId: infected })
    expect(state.virus).toBeNull()
    expect(state.missions.some(m => m.playerId === infected)).toBe(false)
    expect(
      state.events.some(
        e =>
          (e.type === 'virus' || e.type === 'mission') &&
          e.assignment.playerId === infected
      )
    ).toBe(false)
  })

  it('goes back to the lobby with fewer than 2 players', () => {
    const state = gameReducer(started(['Kari', 'Ola']), {
      type: 'removePlayer',
      playerId: 'guest:Ola',
    })
    expect(state.phase).toBe('lobby')
  })
})

describe('reset', () => {
  it('removes players, settings and the game', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      { type: 'setSpice', spice: 3 },
      { type: 'start' },
      { type: 'reset', seed: 9 }
    )
    expect(state).toEqual(createInitialState(9))
  })
})

describe('restoreState', () => {
  it('starts a new lobby for a broken value', () => {
    expect(restoreState('nonsense', 3).phase).toBe('lobby')
    expect(restoreState({ version: 0, players: [] }, 3).players).toEqual([])
  })

  it('gives a setting from a newer version its default', () => {
    const saved = JSON.parse(JSON.stringify(lobby(['Kari', 'Ola'])))
    delete saved.settings.jokers
    expect(restoreState(saved, 3).settings.jokers).toBe(false)
  })

  it('keeps a saved game', () => {
    const saved = play(lobby(['Kari', 'Ola']), { type: 'start' })
    expect(restoreState(JSON.parse(JSON.stringify(saved)), 3)).toEqual(saved)
  })
})

describe('mission verdicts', () => {
  // With two players the first mission comes on turn 3.
  function withMission(missionTurns: number | null) {
    let state = play(
      lobby(['Kari', 'Ola']),
      { type: 'setMissionTurns', turns: missionTurns },
      { type: 'start' }
    )
    for (let i = 0; i < 3; i++) state = gameReducer(state, { type: 'next' })
    expect(state.missions).toHaveLength(1)
    return state
  }
  const reveals = (state: GameState) =>
    state.events.filter(event => event.type === 'missionReveal')

  it('counts the deadline down each turn and reveals the mission at 0', () => {
    let state = withMission(2)
    const { id } = state.missions[0]
    expect(state.missions[0].turnsLeft).toBe(2)
    state = gameReducer(state, { type: 'next' })
    expect(state.missions[0].turnsLeft).toBe(1)
    expect(reveals(state)).toEqual([])
    state = gameReducer(state, { type: 'next' })
    expect(reveals(state)).toEqual([
      { type: 'missionReveal', missionId: id, due: true },
    ])
  })

  it('has no deadline by default', () => {
    let state = withMission(null)
    for (let i = 0; i < 20; i++) state = gameReducer(state, { type: 'next' })
    expect(state.missions[0].turnsLeft).toBeNull()
    expect(reveals(state)).toEqual([])
  })

  it('reveals a mission first in the queue, once', () => {
    const state = withMission(null)
    const { id } = state.missions[0]
    const revealed = play(
      state,
      { type: 'revealMission', missionId: id },
      { type: 'revealMission', missionId: id }
    )
    expect(revealed.events[0]).toEqual({
      type: 'missionReveal',
      missionId: id,
      due: false,
    })
    expect(reveals(revealed)).toHaveLength(1)
  })

  it('gives the penalty only for a mission that is not completed', () => {
    const state = withMission(null)
    const { id, playerId } = state.missions[0]
    const drinks = (s: GameState) =>
      s.players.find(player => player.id === playerId)?.drinks
    for (const completed of [true, false]) {
      const judged = play(
        state,
        { type: 'revealMission', missionId: id },
        { type: 'judgeMission', missionId: id, completed }
      )
      expect(judged.missions).toEqual([])
      expect(reveals(judged)).toEqual([])
      expect(drinks(judged)).toBe((drinks(state) ?? 0) + (completed ? 0 : 1))
    }
  })

  it('drops the reveal when the mission player leaves', () => {
    const state = play(lobby(['Kari', 'Ola', 'Per']), { type: 'start' })
    let next = state
    while (next.missions.length === 0)
      next = gameReducer(next, { type: 'next' })
    const { id, playerId } = next.missions[0]
    const left = play(
      next,
      { type: 'revealMission', missionId: id },
      { type: 'removePlayer', playerId }
    )
    expect(reveals(left)).toEqual([])
  })

  it('treats a missing deadline setting as no deadline', () => {
    const { missionTurns, ...settings } = DEFAULT_SETTINGS
    let state = play(
      {
        ...lobby(['Kari', 'Ola']),
        settings: settings as typeof DEFAULT_SETTINGS,
      },
      { type: 'start' }
    )
    for (let i = 0; i < 5; i++) state = gameReducer(state, { type: 'next' })
    expect(missionTurns).toBeNull()
    expect(state.missions[0].turnsLeft).toBeNull()
  })

  it('clears a broken deadline on the next turn', () => {
    const state = withMission(null)
    const broken = {
      ...state,
      missions: [{ ...state.missions[0], turnsLeft: NaN }],
    }
    expect(hasDeadline(broken.missions[0])).toBe(false)
    expect(
      gameReducer(broken, { type: 'next' }).missions[0].turnsLeft
    ).toBeNull()
  })

  it('gives missions from an older save an id and no deadline', () => {
    const saved = {
      ...withMission(null),
      missions: [{ playerId: 'guest:Kari', card: { cardId: 'c225' } }],
    }
    const restored = restoreState(saved, 1)
    expect(restored.missions[0]).toMatchObject({ id: -1, turnsLeft: null })
    expect(restored.settings.missionTurns).toBeNull()
  })
})

describe('event frequency', () => {
  const virusTurns = (state: GameState, turns: number) => {
    const found: number[] = []
    for (let i = 0; i < turns; i++) {
      const before = state.events.length
      state = gameReducer(state, { type: 'next' })
      if (state.events.slice(before).some(event => event.type === 'virus'))
        found.push(state.turn)
    }
    return found
  }

  it('follows the player count by default', () => {
    expect(defaultEventTurns(4)).toEqual({ virus: 4, rule: 8, mission: 12 })
    const state = play(lobby(['Kari', 'Ola', 'Per', 'Liv']), { type: 'start' })
    expect(state.eventTurns).toEqual(defaultEventTurns(4))
    expect(state.nextEvent).toEqual({ virus: 4, rule: 8, mission: 6 })
  })

  it('uses the turns set in the lobby', () => {
    const state = play(
      lobby(['Kari', 'Ola', 'Per']),
      { type: 'setEventTurns', kind: 'virus', turns: 2 },
      { type: 'start' }
    )
    expect(state.eventTurns.virus).toBe(2)
    expect(virusTurns(state, 6)).toEqual([2, 4, 6])
  })

  it('keeps the frequency when a player joins mid-game', () => {
    let state = play(lobby(['Kari', 'Ola']), { type: 'start' })
    state = gameReducer(state, { type: 'next' })
    state = gameReducer(state, {
      type: 'addPlayer',
      player: newPlayer('Per'),
    })
    expect(state.eventTurns).toEqual(defaultEventTurns(2))
    expect(virusTurns(state, 5)).toEqual([2, 4, 6])
  })

  it('goes back to the player count and never goes below one turn', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      { type: 'setEventTurns', kind: 'rule', turns: 0 },
      { type: 'setEventTurns', kind: 'mission', turns: 9 },
      { type: 'setEventTurns', kind: 'mission', turns: null }
    )
    expect(state.settings.eventTurns).toEqual({
      virus: null,
      rule: 1,
      mission: null,
    })
  })

  it('schedules a game saved before the setting from its turn', () => {
    const playing = play(lobby(['Kari', 'Ola']), { type: 'start' })
    const { eventTurns, nextEvent, ...saved } = {
      ...playing,
      turn: 10,
      settings: { ...playing.settings, eventTurns: undefined },
    }
    const restored = restoreState(saved, 1)
    expect(eventTurns).toBeDefined()
    expect(nextEvent).toBeDefined()
    expect(restored.eventTurns).toEqual(defaultEventTurns(2))
    expect(restored.nextEvent).toEqual({ virus: 12, rule: 14, mission: 13 })
  })
})

describe('deck edits', () => {
  const mainIds = (state: GameState) => [
    ...state.decks.main,
    ...(state.card ? [state.card.cardId] : []),
  ]

  it('leaves removed cards out of the game and can take them back', () => {
    const truth = deckCards(createInitialState(1).deckEdits).find(
      card => card.kind === CardKind.TRUTH && card.spice === 1
    )
    if (!truth) throw new Error('No mild truth')
    const removed = play(lobby(['Kari', 'Ola']), {
      type: 'toggleCard',
      cardId: truth.id,
    })
    expect(mainIds(play(removed, { type: 'start' }))).not.toContain(truth.id)
    const back = play(removed, { type: 'toggleCard', cardId: truth.id })
    expect(back.deckEdits.removed).toEqual([])
  })

  it('deals cards the group wrote', () => {
    const state = play(
      lobby(['Kari', 'Ola']),
      {
        type: 'addCard',
        card: { kind: CardKind.TRUTH, text: '  Hvem er best?  ', spice: 1 },
      },
      { type: 'addCard', card: { kind: CardKind.DARE, text: ' ', spice: 1 } },
      { type: 'start' }
    )
    expect(state.deckEdits.custom).toEqual([
      {
        id: 'custom:1',
        kind: CardKind.TRUTH,
        text: 'Hvem er best?',
        spice: 1,
        tags: [],
      },
    ])
    expect(mainIds(state)).toContain('custom:1')
  })

  it('deletes a card the group wrote and keeps the edits on reset', () => {
    const written = play(
      lobby(['Kari', 'Ola']),
      { type: 'addCard', card: { kind: CardKind.DARE, text: 'A', spice: 1 } },
      { type: 'addCard', card: { kind: CardKind.DARE, text: 'B', spice: 1 } },
      { type: 'deleteCard', cardId: 'custom:1' },
      { type: 'addCard', card: { kind: CardKind.DARE, text: 'C', spice: 1 } }
    )
    expect(written.deckEdits.custom.map(card => card.id)).toEqual([
      'custom:2',
      'custom:3',
    ])
    const reset = gameReducer(written, { type: 'reset', seed: 2 })
    expect(reset.players).toEqual([])
    expect(reset.deckEdits).toEqual(written.deckEdits)
  })
})

describe('new rules', () => {
  const rule = (title: string | undefined) =>
    play(lobby(['Kari', 'Ola']), {
      type: 'addCard',
      card: { kind: CardKind.RULE, title, text: 'Drikk med venstre', spice: 1 },
    }).deckEdits.custom

  it('need a name', () => {
    expect(rule(undefined)).toEqual([])
    expect(rule('   ')).toEqual([])
    expect(rule('a'.repeat(41))).toEqual([])
    expect(rule(' Kjeitet ')[0].title).toBe('Kjeitet')
  })

  it('is the only kind that keeps a name', () => {
    const truth = play(lobby(['Kari', 'Ola']), {
      type: 'addCard',
      card: { kind: CardKind.TRUTH, title: 'X', text: 'Hvem?', spice: 1 },
    }).deckEdits.custom[0]
    expect(truth.title).toBeUndefined()
  })
})

describe('cardExclusion', () => {
  const find = (match: (card: ReturnType<typeof deckCards>[0]) => boolean) => {
    const card = deckCards({ removed: [], custom: [] }).find(match)
    if (!card) throw new Error('No card')
    return card
  }
  const settings = (changes: Partial<typeof DEFAULT_SETTINGS> = {}) => ({
    ...DEFAULT_SETTINGS,
    ...changes,
  })

  it('names the pack that is off before the spice', () => {
    const physical = find(
      card => card.tags.includes(CardTag.PHYSICAL) && card.spice === 1
    )
    const packs = { ...DEFAULT_SETTINGS.packs, [Pack.PHYSICAL]: false }
    expect(cardExclusion(physical, settings({ packs, spice: 1 }))).toEqual({
      reason: 'pack',
      pack: Pack.PHYSICAL,
    })
    expect(cardExclusion(physical, settings())).toBeNull()
  })

  it('always lets in cards for people outside the game', () => {
    const outsider = find(
      card => card.tags.includes(CardTag.OUTSIDER) && card.spice === 1
    )
    expect(cardExclusion(outsider, settings())).toBeNull()
  })

  it('follows the spice level', () => {
    const hot = find(card => card.kind === CardKind.TRUTH && card.spice === 3)
    expect(cardExclusion(hot, settings({ spice: 2 }))).toEqual({
      reason: 'spice',
    })
    expect(cardExclusion(hot, settings({ spice: 3 }))).toBeNull()
  })

  it('leaves out a whole kind when its pack is off', () => {
    const virus = find(card => card.kind === CardKind.VIRUS && card.spice === 1)
    const packs = { ...DEFAULT_SETTINGS.packs, [Pack.VIRUS]: false }
    expect(cardExclusion(virus, settings({ packs }))).toEqual({
      reason: 'pack',
      pack: Pack.VIRUS,
    })
  })
})
