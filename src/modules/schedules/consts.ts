export enum LocationValues {
  BODEGAEN = 'BODEGAEN',
  DAGLIGHALLEN_BAR = 'DAGLIGHALLEN_BAR',
  EDGAR = 'EDGAR',
  KLUBBEN = 'KLUBBEN',
  LYCHE_BAR = 'LYCHE_BAR',
  LYCHE_KJOKKEN = 'LYCHE_KJOKKEN',
  RUNDHALLEN = 'RUNDHALLEN',
  SELSKAPSSIDEN = 'SELSKAPSSIDEN',
  STORSALEN = 'STORSALEN',
  STROSSA = 'STROSSA',
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
  { value: LocationValues.STORSALEN, label: 'Storsalen' },
  { value: LocationValues.KLUBBEN, label: 'Klubben' },
  { value: LocationValues.RUNDHALLEN, label: 'Rundhallen' },
]
