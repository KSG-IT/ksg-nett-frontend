import { useMutation, useQuery } from '@apollo/client'
import {
  Avatar,
  Button,
  Drawer,
  Popover,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { SEARCHBAR_USERS_QUERY } from 'modules/users/queries'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { DayShift, DayShiftSlot } from '../../allShifts'
import { draftKind, lockedPerson } from '../../drafts'
import { DRAFT_SLOT_V2_MUTATION } from '../../mutations'
import { busyOnDay, compactTime, shiftCounts } from '../../scheduleGrid'
import { parseShiftRole } from '../../util'
import classes from './ScheduleGrid.module.css'
import { SHEET_PROPS } from './sheetProps'

export interface SlotTarget {
  shift: DayShift
  slot: DayShiftSlot
}

interface PickerPerson {
  id: string
  name: string
  initials: string
  profileImage: string | null
}

interface SearchbarUsersReturns {
  searchbarUsers: {
    id: string
    getCleanFullName: string
    initials: string
    profileImage: string | null
  }[]
}

const SUGGESTION_COUNT = 8

interface SlotPickerBodyProps {
  target: SlotTarget
  shifts: DayShift[]
  onClose: () => void
  onAssigned: (target: SlotTarget) => void
  // On a phone there is no keyboard hint
  touch?: boolean
}

interface SlotPickerProps extends SlotPickerBodyProps {
  children: React.ReactElement
}

// Desktop: a popover on the chip.
export const SlotPicker: React.FC<SlotPickerProps> = ({
  children,
  ...body
}) => (
  <Popover
    opened
    onChange={opened => !opened && body.onClose()}
    onClose={body.onClose}
    position="bottom-start"
    width={290}
    shadow="md"
    trapFocus
    withinPortal
  >
    <Popover.Target>{children}</Popover.Target>
    <Popover.Dropdown p="xs">
      <SlotPickerBody {...body} />
    </Popover.Dropdown>
  </Popover>
)

interface SlotPickerSheetProps extends Omit<SlotPickerBodyProps, 'target'> {
  target: SlotTarget | null
}

// Phone: a sheet from the bottom of the screen.
export const SlotPickerSheet: React.FC<SlotPickerSheetProps> = ({
  target,
  ...body
}) => (
  <Drawer opened={target !== null} onClose={body.onClose} {...SHEET_PROPS}>
    {target && (
      <SlotPickerBody key={target.slot.id} target={target} touch {...body} />
    )}
  </Drawer>
)

const SlotPickerBody: React.FC<SlotPickerBodyProps> = ({
  target,
  shifts,
  onClose,
  onAssigned,
  touch = false,
}) => {
  const { shift, slot } = target
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search.trim(), 200)
  const [highlighted, setHighlighted] = useState(0)

  const { data: searchData } = useQuery<SearchbarUsersReturns>(
    SEARCHBAR_USERS_QUERY,
    {
      variables: { searchString: debouncedSearch },
      skip: debouncedSearch === '',
    }
  )
  const [draftSlot, { loading: saving }] = useMutation(DRAFT_SLOT_V2_MUTATION)

  const counts = shiftCounts(shifts)
  const countOf = (userId: string) =>
    counts.find(count => count.user.id === userId)?.count ?? 0
  const onThisShift = new Set(shift.slots.map(s => s.user?.id).filter(Boolean))

  const isBusy = (userId: string) => busyOnDay(shifts, userId, shift) !== null
  // Free people first; the sort keeps the order inside each group.
  const freeFirst = (a: { id: string }, b: { id: string }) =>
    Number(isBusy(a.id)) - Number(isBusy(b.id))

  // No search: the people in the visible weeks, the fewest shifts first.
  const people: PickerPerson[] =
    debouncedSearch === ''
      ? [...counts]
          .reverse()
          .filter(count => !onThisShift.has(count.user.id))
          .sort((a, b) => freeFirst(a.user, b.user))
          .slice(0, SUGGESTION_COUNT)
          .map(({ user }) => ({
            id: user.id,
            name: user.getCleanFullName,
            initials: user.initials,
            profileImage: user.profileImage,
          }))
      : (searchData?.searchbarUsers ?? [])
          .filter(user => !onThisShift.has(user.id))
          .sort(freeFirst)
          .map(user => ({
            id: user.id,
            name: user.getCleanFullName,
            initials: user.initials,
            profileImage: user.profileImage,
          }))

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.currentTarget.value)
    setHighlighted(0)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted(index => Math.min(index + 1, people.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted(index => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && people[highlighted]) {
      event.preventDefault()
      handlePick(people[highlighted])
    }
  }

  // Every change is a draft until a manager locks it. A draft with the locked
  // person removes the draft, and a draft without a person removes the person.
  function saveDraft(userId: string | null, message?: string) {
    draftSlot({
      variables: { shiftSlotId: slot.id, userId },
      onCompleted() {
        if (message) showNotification({ message })
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  function handlePick(person: PickerPerson) {
    draftSlot({
      variables: { shiftSlotId: slot.id, userId: person.id },
      onCompleted() {
        onAssigned(target)
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  function handleClear() {
    const name = slot.user?.getCleanFullName
    saveDraft(
      null,
      slot.draft && !slot.lockedUser
        ? `Utkastet for ${name} er forkastet`
        : `${name} fjernes fra ${shift.name} når utkastet låses inn`
    )
  }

  function handleDiscard() {
    saveDraft(lockedPerson(slot)?.id ?? null, 'Utkastet er forkastet')
  }

  return (
    <Stack gap={6}>
      <Text size="xs" fw={700}>
        {format(new Date(shift.datetimeStart), 'EEE d. MMM')} · {shift.name}{' '}
        {compactTime(shift)} · {parseShiftRole(slot.role)}
      </Text>
      <CurrentPerson
        slot={slot}
        saving={saving}
        onClear={handleClear}
        onDiscard={handleDiscard}
      />
      <TextInput
        size={touch ? 'md' : 'xs'}
        placeholder={slot.user ? 'Bytt til …' : 'Søk navn …'}
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        // On a phone the keyboard would hide the suggestions
        data-autofocus={!touch || undefined}
        aria-label="Søk etter person"
      />
      <Text size="xs" c="dimmed">
        {debouncedSearch === ''
          ? 'På vakt disse ukene, færrest vakter først'
          : 'Søkeresultat'}
      </Text>
      <PickerRows
        people={people}
        highlighted={highlighted}
        disabled={saving}
        touch={touch}
        countOf={countOf}
        busyOf={userId => busyOnDay(shifts, userId, shift)}
        onPick={handlePick}
      />
      {!touch && (
        <Text size="xs" c="dimmed" className={classes.keys}>
          ↑ ↓ og Enter velger · Esc lukker
        </Text>
      )}
    </Stack>
  )
}

interface CurrentPersonProps {
  slot: DayShiftSlot
  saving: boolean
  onClear: () => void
  onDiscard: () => void
}

// The person in the slot after the drafts, with what a manager can do.
const CurrentPerson: React.FC<CurrentPersonProps> = ({
  slot,
  saving,
  onClear,
  onDiscard,
}) => {
  const kind = draftKind(slot)
  if (kind === 'remove') {
    return (
      <div className={classes.current}>
        <Text size="sm" truncate td="line-through">
          {slot.lockedUser?.getFullWithNickName}
        </Text>
        <Button
          size="compact-xs"
          variant="subtle"
          loading={saving}
          onClick={onDiscard}
        >
          Angre fjerning
        </Button>
      </div>
    )
  }
  if (!slot.user) return null
  return (
    <div className={classes.current}>
      <Text size="sm" truncate>
        {slot.user.getFullWithNickName}
        {kind && ' (utkast)'}
      </Text>
      <Button
        size="compact-xs"
        variant="subtle"
        color="red"
        loading={saving}
        onClick={onClear}
      >
        Fjern
      </Button>
      {kind && (
        <Button
          size="compact-xs"
          variant="subtle"
          loading={saving}
          onClick={onDiscard}
        >
          Forkast utkast
        </Button>
      )}
    </div>
  )
}

interface PickerRowsProps {
  people: PickerPerson[]
  highlighted: number
  disabled: boolean
  touch: boolean
  countOf: (userId: string) => number
  busyOf: (userId: string) => string | null
  onPick: (person: PickerPerson) => void
}

const PickerRows: React.FC<PickerRowsProps> = ({ people, ...props }) => {
  if (people.length === 0) {
    return (
      <Text size="xs" c="dimmed" ta="center" py="xs">
        Ingen å vise. Søk etter navn.
      </Text>
    )
  }
  return (
    <div className={classes.pickerList} data-touch={props.touch || undefined}>
      {people.map((person, index) => (
        <PickerRow
          key={person.id}
          person={person}
          isHighlighted={index === props.highlighted}
          {...props}
        />
      ))}
    </div>
  )
}

interface PickerRowProps
  extends Omit<PickerRowsProps, 'people' | 'highlighted'> {
  person: PickerPerson
  isHighlighted: boolean
}

const PickerRow: React.FC<PickerRowProps> = ({
  person,
  isHighlighted,
  disabled,
  countOf,
  busyOf,
  onPick,
}) => {
  const busy = busyOf(person.id)
  const count = countOf(person.id)

  function handlePick() {
    onPick(person)
  }

  return (
    <UnstyledButton
      className={classes.pickerRow}
      data-highlighted={isHighlighted || undefined}
      data-busy={busy !== null || undefined}
      disabled={disabled}
      onClick={handlePick}
    >
      <Avatar
        size={22}
        radius="xl"
        color="samfundet-red"
        src={person.profileImage || undefined}
      >
        {person.initials}
      </Avatar>
      <Text size="sm" truncate className={classes.pickerName}>
        {person.name}
      </Text>
      <Text size="xs" c="dimmed" className={classes.pickerMeta}>
        {busy ? `på ${busy}` : `${count} ${count === 1 ? 'vakt' : 'vakter'}`}
      </Text>
    </UnstyledButton>
  )
}
