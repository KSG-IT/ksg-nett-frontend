// The form to create or change one shift in v2 of the schedule view. The
// backend gets a date and clock times and combines them in the server time
// zone (createShiftWithSlots, updateShiftDetails), so the browser time zone
// does not matter.
import { format } from 'date-fns'
import { DayShift, DayShiftSlot, sortShifts } from './allShifts'
import { LocationValues, RoleValues, v2RoleOptions } from './consts'

export interface RoleCount {
  role: RoleValues
  count: number
}

export interface ShiftFormValues {
  name: string
  location: LocationValues | null
  // yyyy-MM-dd
  date: string
  // HH:mm. An end at or before the start is on the next day.
  startTime: string
  endTime: string
  slots: RoleCount[]
}

export interface ShiftSuggestion {
  name: string
  startTime: string
  endTime: string
  slots: RoleCount[]
}

export function clockTime(datetime: string) {
  return format(new Date(datetime), 'HH:mm')
}

export function roleCounts(slots: Pick<DayShiftSlot, 'role'>[]): RoleCount[] {
  const counts: RoleCount[] = []
  for (const { role } of slots) {
    const count = counts.find(c => c.role === role)
    if (count) count.count += 1
    else counts.push({ role, count: 1 })
  }
  return counts
}

// Names used at the location (all shifts without a location), the most used
// first. Times and slots come from the newest shift with the name.
export function nameSuggestions(
  shifts: DayShift[],
  location: LocationValues | null
): ShiftSuggestion[] {
  const atLocation = location
    ? shifts.filter(shift => shift.location === location)
    : shifts
  const byName = new Map<string, DayShift[]>()
  for (const shift of sortShifts(atLocation)) {
    byName.set(shift.name, [...(byName.get(shift.name) ?? []), shift])
  }
  return [...byName.entries()]
    .sort(
      ([nameA, a], [nameB, b]) =>
        b.length - a.length || nameA.localeCompare(nameB)
    )
    .map(([name, named]) => {
      const newest = named[named.length - 1]
      return {
        name,
        startTime: clockTime(newest.datetimeStart),
        endTime: clockTime(newest.datetimeEnd),
        slots: roleCounts(newest.slots),
      }
    })
}

// A new shift has no slots. The manager adds the roles it needs.
export function emptyShiftForm(
  date: Date,
  location: LocationValues | null
): ShiftFormValues {
  return {
    name: '',
    location,
    date: format(date, 'yyyy-MM-dd'),
    startTime: '16:00',
    endTime: '23:00',
    slots: [],
  }
}

// A role with 0 slots is removed from the form.
export function setRoleCount(
  slots: RoleCount[],
  role: RoleValues,
  count: number
): RoleCount[] {
  if (count <= 0) return slots.filter(slot => slot.role !== role)
  return slots.map(slot => (slot.role === role ? { ...slot, count } : slot))
}

function details(form: ShiftFormValues) {
  return {
    name: form.name.trim(),
    location: form.location,
    date: form.date,
    startTime: `${form.startTime}:00`,
    endTime: `${form.endTime}:00`,
  }
}

export function toCreateInput(scheduleId: string, form: ShiftFormValues) {
  return {
    scheduleId,
    ...details(form),
    slots: form.slots
      .filter(slot => slot.count > 0)
      .map(slot => ({ shiftSlotRole: slot.role, count: slot.count })),
  }
}

export function toUpdateInput(shiftId: string, form: ShiftFormValues) {
  return { shiftId, ...details(form) }
}

// The roles in the shifts, the most used first.
export function rolesInUse(shifts: DayShift[]): RoleValues[] {
  return roleCounts(shifts.flatMap(shift => shift.slots))
    .sort((a, b) => b.count - a.count)
    .map(count => count.role)
}

// Options for a role select: the roles of the schedule first, then the rest.
// Roles already in the form are left out.
export function roleOptionGroups(inUse: RoleValues[], chosen: RoleValues[]) {
  const available = v2RoleOptions.filter(
    option => !chosen.includes(option.value)
  )
  const suggested = inUse
    .map(role => available.find(option => option.value === role))
    .filter(option => option !== undefined)
  const others = available.filter(option => !inUse.includes(option.value))
  return [
    ...(suggested.length
      ? [{ group: 'Brukt i vaktplanen', items: suggested }]
      : []),
    { group: 'Alle roller', items: others },
  ]
}
