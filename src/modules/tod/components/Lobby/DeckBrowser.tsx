import { Dispatch, useState } from 'react'
import {
  Card,
  CARDS,
  MAX_CARD_LENGTH,
  MAX_TITLE_LENGTH,
  Spice,
} from '../../cards'
import { KIND_LABELS, PACK_OPTIONS, SPICE_OPTIONS } from '../../display'
import { CardKind, Pack } from '../../enums'
import {
  CardExclusion,
  cardExclusion,
  DeckEdits,
  deckCards,
  GameAction,
  isCustomCard,
  newCardProblem,
  PACK_BY_KIND,
  Settings,
} from '../../game'
import classes from './DeckBrowser.module.css'
import lobbyClasses from './Lobby.module.css'

interface DeckBrowserProps {
  settings: Settings
  deckEdits: DeckEdits
  dispatch: Dispatch<GameAction>
  onClose: () => void
}

const KINDS = [
  CardKind.TRUTH,
  CardKind.DARE,
  CardKind.VIRUS,
  CardKind.RULE,
  CardKind.MISSION,
]

type Filter = 'all' | 'in' | 'out'

const FILTERS: { filter: Filter; name: string }[] = [
  { filter: 'all', name: 'Alle' },
  { filter: 'in', name: 'Med i spillet' },
  { filter: 'out', name: 'Ikke med' },
]

const packName = (pack: Pack) =>
  PACK_OPTIONS.find(option => option.pack === pack)?.name ?? pack
const spiceName = (spice: Spice) =>
  SPICE_OPTIONS.find(option => option.spice === spice)?.name ?? ''

// What the lobby settings let into the game, in one line.
function settingsSummary(settings: Settings) {
  const off = PACK_OPTIONS.filter(option => !settings.packs[option.pack]).map(
    option => option.name
  )
  const level =
    settings.spice === 1
      ? 'bare milde kort'
      : `kort opp til ${spiceName(settings.spice).toLowerCase()}`
  return off.length > 0 ? `${level}, uten ${off.join(', ')}` : level
}

interface CardStatus {
  removed: boolean
  exclusion: CardExclusion | null
}

function statusLabel({ removed, exclusion }: CardStatus, settings: Settings) {
  if (removed) return 'Fjernet av dere'
  if (exclusion?.reason === 'pack')
    return `Ikke med: ${packName(exclusion.pack)} er av`
  if (exclusion?.reason === 'spice')
    return `Ikke med: dere spiller på ${spiceName(settings.spice)}`
  return null
}

// Look through the cards of each kind, take cards out, or write new ones.
// The changes apply from the next start.
export const DeckBrowser: React.FC<DeckBrowserProps> = ({
  settings,
  deckEdits,
  dispatch,
  onClose,
}) => {
  const [kind, setKind] = useState(CardKind.TRUTH)
  const [filter, setFilter] = useState<Filter>('all')
  const removed = new Set(deckEdits.removed)
  const statusOf = (card: Card): CardStatus => ({
    removed: removed.has(card.id),
    exclusion: cardExclusion(card, settings),
  })
  const isIn = (card: Card) => {
    const status = statusOf(card)
    return !status.removed && !status.exclusion
  }
  const all = [...CARDS, ...deckEdits.custom]
  const ofKind = all.filter(card => card.kind === kind)
  const counts: Record<Filter, number> = {
    all: ofKind.length,
    in: ofKind.filter(isIn).length,
    out: ofKind.filter(card => !isIn(card)).length,
  }
  const cards = ofKind.filter(
    card => filter === 'all' || (filter === 'in') === isIn(card)
  )
  const pack = PACK_BY_KIND[kind]
  const packOff = pack !== undefined && !settings.packs[pack]

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') onClose()
  }

  return (
    <div
      className={classes.panel}
      role="dialog"
      aria-modal="true"
      aria-label="Kortstokker"
      onKeyDown={handleKeyDown}
    >
      <div className={classes.body}>
        <div className={classes.header}>
          <h2 className={classes.title}>Kortstokker</h2>
          <button type="button" className={classes.done} onClick={onClose}>
            Ferdig
          </button>
        </div>

        <div className={classes.tabs} role="tablist">
          {KINDS.map(option => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={kind === option}
              className={classes.tab}
              onClick={() => setKind(option)}
            >
              {KIND_LABELS[option]}
              <span className={classes.tabCount}>
                {all.filter(card => card.kind === option && isIn(card)).length}
              </span>
            </button>
          ))}
        </div>

        <NewCardForm kind={kind} dispatch={dispatch} />

        <p className={classes.note}>
          {packOff
            ? `${packName(
                pack
              )} er slått av i lobbyen, så ingen av disse kortene er med nå.`
            : `Lobbyen gir ${settingsSummary(
                settings
              )}. Endre det der, og fjern enkeltkort her.`}
        </p>

        <div className={classes.filters}>
          {FILTERS.map(option => (
            <button
              key={option.filter}
              type="button"
              className={classes.filter}
              aria-pressed={filter === option.filter}
              onClick={() => setFilter(option.filter)}
            >
              {option.name} · {counts[option.filter]}
            </button>
          ))}
        </div>

        <ul className={classes.list}>
          {cards.map(card => (
            <CardRow
              key={card.id}
              card={card}
              status={statusOf(card)}
              settings={settings}
              dispatch={dispatch}
            />
          ))}
          {cards.length === 0 && (
            <li className={classes.note}>Ingen kort her.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

interface CardRowProps {
  card: Card
  status: CardStatus
  settings: Settings
  dispatch: Dispatch<GameAction>
}

const CardRow: React.FC<CardRowProps> = ({
  card,
  status,
  settings,
  dispatch,
}) => {
  const custom = isCustomCard(card)
  const { removed } = status
  const label = statusLabel(status, settings)

  return (
    <li
      className={classes.card}
      data-removed={removed || undefined}
      data-inactive={(!removed && status.exclusion !== null) || undefined}
    >
      <span className={classes.cardText}>
        <span>
          {card.title && <strong>{card.title}: </strong>}
          {card.text}
        </span>
        <span className={classes.cardMeta}>
          <span className={classes.badge} data-spice={card.spice}>
            {spiceName(card.spice)}
          </span>
          {custom && <span className={classes.badge}>Eget kort</span>}
          {label && <span className={classes.status}>{label}</span>}
        </span>
      </span>
      {custom ? (
        <button
          type="button"
          className={classes.cardAction}
          onClick={() => dispatch({ type: 'deleteCard', cardId: card.id })}
        >
          Slett
        </button>
      ) : (
        <button
          type="button"
          className={classes.cardAction}
          onClick={() => dispatch({ type: 'toggleCard', cardId: card.id })}
        >
          {removed ? 'Ta med' : 'Fjern'}
        </button>
      )}
    </li>
  )
}

interface NewCardFormProps {
  kind: CardKind
  dispatch: Dispatch<GameAction>
}

const NewCardForm: React.FC<NewCardFormProps> = ({ kind, dispatch }) => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [spice, setSpice] = useState<Spice>(1)
  const [touched, setTouched] = useState(false)
  const isRule = kind === CardKind.RULE
  const card = { kind, title: isRule ? title : undefined, text, spice }
  const problem = newCardProblem(card)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (problem) return
    dispatch({ type: 'addCard', card })
    setTitle('')
    setText('')
    setTouched(false)
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <label className={classes.label} htmlFor="tod-new-card">
        Nytt kort: {KIND_LABELS[kind].toLowerCase()}
      </label>
      {isRule && (
        <input
          className={classes.textarea}
          value={title}
          maxLength={MAX_TITLE_LENGTH + 10}
          aria-label="Navn på regelen"
          placeholder="Navn på regelen, for eksempel Glassmagnet"
          onChange={event => setTitle(event.target.value)}
        />
      )}
      <textarea
        id="tod-new-card"
        className={classes.textarea}
        value={text}
        maxLength={MAX_CARD_LENGTH + 50}
        rows={2}
        placeholder="For eksempel: Hvem i {group} ville du byttet plass med?"
        onChange={event => setText(event.target.value)}
      />
      <span className={classes.hint}>
        {touched && problem
          ? problem
          : '{player1}–{player3} blir andre spillere, {group} din gjeng og {otherGroup} en annen gjeng.'}
      </span>
      <div className={classes.formRow}>
        {SPICE_OPTIONS.map(option => (
          <button
            key={option.spice}
            type="button"
            className={lobbyClasses.choice}
            aria-pressed={spice === option.spice}
            onClick={() => setSpice(option.spice)}
          >
            {option.name}
          </button>
        ))}
        <button type="submit" className={classes.add}>
          Legg til
        </button>
      </div>
    </form>
  )
}
