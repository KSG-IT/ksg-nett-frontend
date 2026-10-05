import {
  DefaultAvailabilityValues,
  RoleValues,
  RosterChangeKindValues,
} from './consts'
import type {
  MembershipTypeName,
  RosterChangeNode,
  ScheduleRosterNode,
} from './types.graphql'
import { parseShiftRole } from './util'
import { z } from 'zod'

// === Labels ===

const MEMBERSHIP_TYPE_LABELS: Record<MembershipTypeName, string> = {
  FUNCTIONARY: 'Funksjonær',
  ACTIVE_FUNCTIONARY_PANG: 'Aktiv funkepang',
  OLD_FUNCTIONARY_PANG: 'Gammel funkepang',
  GANG_MEMBER: 'Gjengmedlem',
  ACTIVE_GANG_MEMBER_PANG: 'Gjengpang',
  OLD_GANG_MEMBER_PANG: 'Gammel gjengpang',
  INTEREST_GROUP_MEMBER: 'Interessegruppemedlem',
  HANGAROUND: 'Hangaround',
  TEMPORARY_LEAVE: 'Permisjon',
}

// The membership types a roster rule can match, in the order of the form
export const RULE_MEMBERSHIP_TYPES = Object.keys(
  MEMBERSHIP_TYPE_LABELS
) as MembershipTypeName[]

export const NO_MEMBERSHIP = 'none'

// A roster row has the raw type ("active-functionary-pang"), a rule has the
// enum name ("ACTIVE_FUNCTIONARY_PANG"). Both give the same key.
export function membershipTypeKey(type: string | null): string {
  if (!type) return NO_MEMBERSHIP
  return type.toUpperCase().replace(/-/g, '_')
}

export function membershipTypeLabel(type: string | null): string {
  const key = membershipTypeKey(type)
  if (key === NO_MEMBERSHIP) return 'Uten medlemskap'
  return MEMBERSHIP_TYPE_LABELS[key as MembershipTypeName] ?? String(type)
}

export function availabilityLabel(value: DefaultAvailabilityValues): string {
  return value === DefaultAvailabilityValues.OPT_IN
    ? 'Påmelding'
    : 'Tilgjengelig'
}

export const AVAILABILITY_OPTIONS = Object.values(
  DefaultAvailabilityValues
).map(value => ({ value, label: availabilityLabel(value) }))

export function capLabel(cap: number | null): string {
  return cap === null ? '–' : String(cap)
}

// === Counts ===

// Shifts done and planned count together: a planned shift is work to come.
export function shiftTotal(row: ScheduleRosterNode): number {
  return row.shiftsDone + row.shiftsPlanned
}

// The fair share is the average of the rows that are available by default.
// Opt-in rows work only when they sign up, so they do not count.
export function availableAverage(rows: ScheduleRosterNode[]): number | null {
  const available = rows.filter(
    row => row.defaultAvailability === DefaultAvailabilityValues.AVAILABLE
  )
  if (available.length === 0) return null
  const sum = available.reduce((total, row) => total + shiftTotal(row), 0)
  return sum / available.length
}

export type AverageFlag = 'over' | 'under' | null

// An available row is over or under when it is a full shift from the average
export function averageFlag(
  row: ScheduleRosterNode,
  average: number | null
): AverageFlag {
  if (average === null) return null
  if (row.defaultAvailability !== DefaultAvailabilityValues.AVAILABLE) {
    return null
  }
  const total = shiftTotal(row)
  if (total >= average + 1) return 'over'
  if (total <= average - 1) return 'under'
  return null
}

export interface CapState {
  label: string
  percent: number
  reached: boolean
}

// The cap is the most shifts autofill gives a row in the count period
export function capState(row: ScheduleRosterNode): CapState | null {
  if (row.shiftCap === null) return null
  const total = shiftTotal(row)
  const percent =
    row.shiftCap === 0 ? 100 : Math.min(100, (total / row.shiftCap) * 100)
  return {
    label: `${total} / ${row.shiftCap}`,
    percent: Math.round(percent),
    reached: total >= row.shiftCap,
  }
}

// A row added by hand is also edited by hand, so it shows one badge
export function manualBadge(row: ScheduleRosterNode): string | null {
  if (row.addedManually) return 'Lagt til manuelt'
  if (row.manuallyEdited) return 'Endret manuelt'
  return null
}

export interface RosterSummary {
  total: number
  available: number
  optIn: number
  average: number | null
  optInAtCap: number
}

export function rosterSummary(rows: ScheduleRosterNode[]): RosterSummary {
  const optInRows = rows.filter(
    row => row.defaultAvailability === DefaultAvailabilityValues.OPT_IN
  )
  return {
    total: rows.length,
    available: rows.length - optInRows.length,
    optIn: optInRows.length,
    average: availableAverage(rows),
    optInAtCap: optInRows.filter(row => capState(row)?.reached === true).length,
  }
}

export function formatAverage(average: number | null): string {
  if (average === null) return '–'
  return average.toLocaleString('nb-NO', { maximumFractionDigits: 1 })
}

// The bars of all rows use one scale: the largest count, the average or 1
export function countScale(
  rows: ScheduleRosterNode[],
  average: number | null
): number {
  return Math.max(1, average ?? 0, ...rows.map(shiftTotal))
}

export function percentOf(value: number, scale: number): number {
  return Math.round((Math.min(value, scale) / scale) * 100)
}

// === Filter and sort ===

export type RosterSort = 'fewest' | 'most' | 'name'

export interface RosterFilter {
  membershipType: string | null
  role: RoleValues | null
  search: string
  sort: RosterSort
}

export const EMPTY_ROSTER_FILTER: RosterFilter = {
  membershipType: null,
  role: null,
  search: '',
  sort: 'fewest',
}

const byName = (a: ScheduleRosterNode, b: ScheduleRosterNode) =>
  a.user.fullName.localeCompare(b.user.fullName, 'nb')

// Returns a new array; Apollo results must not change
export function filterRoster(
  rows: ScheduleRosterNode[],
  filter: RosterFilter
): ScheduleRosterNode[] {
  const search = filter.search.trim().toLocaleLowerCase('nb')
  const matches = rows.filter(
    row =>
      (filter.membershipType === null ||
        membershipTypeKey(row.membershipType) === filter.membershipType) &&
      (filter.role === null || row.autofillAs === filter.role) &&
      row.user.fullName.toLocaleLowerCase('nb').includes(search)
  )
  if (filter.sort === 'name') return matches.sort(byName)
  const direction = filter.sort === 'most' ? -1 : 1
  return matches.sort(
    (a, b) => direction * (shiftTotal(a) - shiftTotal(b)) || byName(a, b)
  )
}

export interface SelectOption {
  value: string
  label: string
}

// The membership types on the roster, for the filter
export function membershipTypeOptions(
  rows: ScheduleRosterNode[]
): SelectOption[] {
  const keys = new Set(rows.map(row => membershipTypeKey(row.membershipType)))
  return [...keys]
    .map(key => ({ value: key, label: membershipTypeLabel(key) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'nb'))
}

// The roles on the roster, for the filter
export function roleOptions(rows: ScheduleRosterNode[]): SelectOption[] {
  const roles = new Set(rows.map(row => row.autofillAs))
  return [...roles]
    .map(role => ({ value: role, label: parseShiftRole(role) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'nb'))
}

// A rule position must be in the schedule's internal group, when it has one.
// Without a group, all positions can be used.
export function positionOptions(
  groupPositions: { id: string; name: string }[] | null,
  allPositions: { id: string; name: string }[]
): SelectOption[] {
  return (groupPositions ?? allPositions)
    .map(position => ({ value: position.id, label: position.name }))
    .sort((a, b) => a.label.localeCompare(b.label, 'nb'))
}

// === Roster sync ===

const SYNC_GROUPS: { kind: RosterChangeKindValues; label: string }[] = [
  { kind: RosterChangeKindValues.ADD, label: 'Legges til' },
  { kind: RosterChangeKindValues.CHANGE, label: 'Endres' },
  { kind: RosterChangeKindValues.REMOVE, label: 'Fjernes' },
  { kind: RosterChangeKindValues.KEEP, label: 'Beholdes (manuelt endret)' },
  { kind: RosterChangeKindValues.CONFLICT, label: 'Konflikt' },
]

export interface SyncGroup {
  kind: RosterChangeKindValues
  label: string
  changes: RosterChangeNode[]
}

// The groups with changes, in a fixed order, the names sorted
export function groupSyncPreview(changes: RosterChangeNode[]): SyncGroup[] {
  return SYNC_GROUPS.map(group => ({
    ...group,
    changes: changes
      .filter(change => change.kind === group.kind)
      .sort((a, b) => a.user.fullName.localeCompare(b.user.fullName, 'nb')),
  })).filter(group => group.changes.length > 0)
}

// KEEP and CONFLICT change nothing, so the sync button does not count them
export function syncChangeCount(changes: { kind: RosterChangeKindValues }[]) {
  return changes.filter(
    change =>
      change.kind === RosterChangeKindValues.ADD ||
      change.kind === RosterChangeKindValues.CHANGE ||
      change.kind === RosterChangeKindValues.REMOVE
  ).length
}

export function changeCountLabel(count: number): string {
  return count === 1 ? '1 endring' : `${count} endringer`
}

// === Forms ===

const rosterValuesShape = {
  role: z.enum(RoleValues, { error: 'Velg en rolle' }),
  defaultAvailability: z.enum(DefaultAvailabilityValues),
  noCap: z.boolean(),
  shiftCap: z.number().int('Skriv et heltall').min(0).nullable(),
}

const capIsSet = {
  check: (values: { noCap: boolean; shiftCap: number | null }) =>
    values.noCap || values.shiftCap !== null,
  params: {
    message: 'Skriv en grense, eller velg «Ingen grense»',
    path: ['shiftCap'],
  },
}

export const rosterFormSchema = z
  .object(rosterValuesShape)
  .refine(capIsSet.check, capIsSet.params)

export type RosterFormValues = z.infer<typeof rosterFormSchema>

// A new rule also needs the position and the membership type it matches
export const newRuleFormSchema = z
  .object({
    ...rosterValuesShape,
    positionId: z.string({ error: 'Velg et verv' }).min(1, 'Velg et verv'),
    positionType: z.enum(RULE_MEMBERSHIP_TYPES, { error: 'Velg en type' }),
  })
  .refine(capIsSet.check, capIsSet.params)

// A user added by hand
export const addEntryFormSchema = z
  .object({
    ...rosterValuesShape,
    userId: z.string({ error: 'Velg en person' }).min(1, 'Velg en person'),
  })
  .refine(capIsSet.check, capIsSet.params)

export type AddEntryFormValues = z.infer<typeof addEntryFormSchema>

export type NewRuleFormValues = z.infer<typeof newRuleFormSchema>

// The backend removes the cap when shiftCap is null
export function capInput(values: {
  noCap: boolean
  shiftCap: number | null
}): number | null {
  return values.noCap ? null : values.shiftCap
}

// The role is `role` on a rule and `autofillAs` on a roster row
export function rosterFormDefaults(
  role: RoleValues,
  values: {
    defaultAvailability: DefaultAvailabilityValues
    shiftCap: number | null
  }
): RosterFormValues {
  return {
    role,
    defaultAvailability: values.defaultAvailability,
    noCap: values.shiftCap === null,
    shiftCap: values.shiftCap,
  }
}
