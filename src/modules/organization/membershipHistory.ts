// Timeline rules for a user's membership history. They mirror
// validate_membership_history in the backend (organization/schema.py), which
// checks them again on save.

export interface MembershipHistoryRow {
  dateJoined: string | null
  dateEnded: string | null
  // Only memberships in internal groups count for overlaps and the open
  // membership. Interest groups may overlap.
  inInternalGroup: boolean
}

export interface MembershipHistoryError {
  index: number
  message: string
}

// Same rule as InternalGroupPositionMembership.get_semester_of_membership:
// August and later is the autumn semester.
export function semesterShorthand(date: string | null): string {
  if (!date) return ''
  const [year, month] = date.split('-').map(Number)
  return `${month > 7 ? 'H' : 'V'}${String(year).slice(2)}`
}

export function validateMembershipHistory(
  rows: MembershipHistoryRow[]
): MembershipHistoryError[] {
  const errors: MembershipHistoryError[] = []

  rows.forEach((row, index) => {
    if (row.dateJoined && row.dateEnded && row.dateEnded < row.dateJoined) {
      errors.push({ index, message: 'Sluttdato er før startdato' })
    }
  })

  const internal = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.inInternalGroup && row.dateJoined)

  internal
    .filter(({ row }) => !row.dateEnded)
    .slice(1)
    .forEach(({ index }) =>
      errors.push({
        index,
        message: 'Bare ett verv i en interngjeng kan være aktivt',
      })
    )

  // ISO dates compare as strings. A membership may start on the day the
  // previous one ended.
  internal.forEach((a, position) => {
    internal.slice(position + 1).forEach(b => {
      const aStartsBeforeBEnds =
        !b.row.dateEnded || a.row.dateJoined! < b.row.dateEnded
      const bStartsBeforeAEnds =
        !a.row.dateEnded || b.row.dateJoined! < a.row.dateEnded
      if (aStartsBeforeBEnds && bStartsBeforeAEnds) {
        errors.push({
          index: b.index,
          message: `Overlapper med verv nummer ${a.index + 1}`,
        })
      }
    })
  })

  return errors.sort((a, b) => a.index - b.index)
}
