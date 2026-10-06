export enum LocationValues {
  BODEGAEN = 'BODEGAEN',
  DAGLIGHALLEN_BAR = 'DAGLIGHALLEN_BAR',
  EDGAR = 'EDGAR',
  KLUBBEN = 'KLUBBEN',
  LYCHE_BAR = 'LYCHE_BAR',
  LYCHE_KJOKKEN = 'LYCHE_KJOKKEN',
  RUNDHALLEN = 'RUNDHALLEN',
  SELSKAPSSIDEN = 'SELSKAPSSIDEN',
  SERVERING_C = 'SERVERING_C',
  SERVERING_D = 'SERVERING_D',
  SERVERING_K = 'SERVERING_K',
  STORSALEN = 'STORSALEN',
  STROSSA = 'STROSSA',
  KONTORET = 'KONTORET',
  BRYGGERIET = 'BRYGGERIET',
}

export enum RoleValues {
  UGLE = 'UGLE',
  BRANNVAKT = 'BRANNVAKT',
  BAEREVAKT = 'BAEREVAKT',
  BARISTA = 'BARISTA',
  KAFEANSVARLIG = 'KAFEANSVARLIG',
  BARSERVITOR = 'BARSERVITOR',
  HOVMESTER = 'HOVMESTER',
  KOKK = 'KOKK',
  SOUSCHEF = 'SOUSCHEF',
  RYDDEVAKT = 'RYDDEVAKT',
  ARRANGEMENTBARTENDER = 'ARRANGEMENTBARTENDER',
  ARRANGEMENTANSVARLIG = 'ARRANGEMENTANSVARLIG',
  BRYGGER = 'BRYGGER',
  BARTENDER = 'BARTENDER',
  BARSJEF = 'BARSJEF',
  BARVAKT = 'BARVAKT',
  SPRITBARTENDER = 'SPRITBARTENDER',
  SPRITBARSJEF = 'SPRITBARSJEF',
  SOCIVAKT = 'SOCIVAKT',
}

// Most shifts have one shift leader and 3 to 4 workers. The schedule view
// marks the leader roles, so a manager sees them at once.
export const shiftLeaderRoles = [
  RoleValues.BARSJEF,
  RoleValues.SPRITBARSJEF,
  RoleValues.HOVMESTER,
  RoleValues.SOUSCHEF,
  RoleValues.KAFEANSVARLIG,
  RoleValues.ARRANGEMENTANSVARLIG,
  RoleValues.UGLE,
]

export enum DayValues {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum ScheduleDisplayModeValues {
  SINGLE_LOCATION = 'SINGLE_LOCATION',
  MULTIPLE_LOCATIONS = 'MULTIPLE_LOCATIONS',
}

export const locationOptions = [
  { value: LocationValues.BODEGAEN, label: 'Bodegaen' },
  { value: LocationValues.DAGLIGHALLEN_BAR, label: 'Daglighallen bar' },
  { value: LocationValues.EDGAR, label: 'Edgar' },
  { value: LocationValues.LYCHE_BAR, label: 'Lyche bar' },
  { value: LocationValues.LYCHE_KJOKKEN, label: 'Lyche kjøkken' },
  { value: LocationValues.STROSSA, label: 'Strossa' },
  { value: LocationValues.SELSKAPSSIDEN, label: 'Selskapssiden' },
  { value: LocationValues.SERVERING_C, label: 'Siri' },
  { value: LocationValues.SERVERING_D, label: 'Vollan' },
  { value: LocationValues.SERVERING_K, label: 'Skala' },
  { value: LocationValues.STORSALEN, label: 'Storsalen' },
  { value: LocationValues.KLUBBEN, label: 'Klubben' },
  { value: LocationValues.RUNDHALLEN, label: 'Rundhallen' },
  { value: LocationValues.KONTORET, label: 'Kontoret' },
  { value: LocationValues.BRYGGERIET, label: 'Bryggeriet' },
]

// v2 of the schedule view sends these to the backend. BARVAKT is not in the
// backend role enum, and BRYGGERIET is not in Shift.Location
// (ksg-nett-backend/schedules/models.py), so the v2 forms leave them out.
export const v2RoleOptions = Object.values(RoleValues)
  .filter(role => role !== RoleValues.BARVAKT)
  .map(role => ({
    value: role,
    label: role.charAt(0) + role.slice(1).toLowerCase(),
  }))

export const v2LocationOptions = locationOptions.filter(
  option => option.value !== LocationValues.BRYGGERIET
)

// What no answer for a shift means for a roster row
// (ksg-nett-backend/schedules/models.py, DefaultAvailability)
export enum DefaultAvailabilityValues {
  AVAILABLE = 'AVAILABLE',
  OPT_IN = 'OPT_IN',
}

// What the roster sync does with a row
// (ksg-nett-backend/schedules/utils/roster.py, RosterChangeKind)
export enum RosterChangeKindValues {
  ADD = 'ADD',
  CHANGE = 'CHANGE',
  REMOVE = 'REMOVE',
  KEEP = 'KEEP',
  CONFLICT = 'CONFLICT',
}

export enum PlanningPeriodStatusValues {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PUBLISHED = 'PUBLISHED',
}
