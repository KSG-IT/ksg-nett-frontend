import { Badge, createStyles, Group, Stack, Table, Text } from '@mantine/core'
import { useMemo } from 'react'
import { AllergyUser } from '../../../types'

interface AllergyMatrixTableProps {
  users: AllergyUser[]
}

export const AllergyMatrixTable: React.FC<AllergyMatrixTableProps> = ({
  users,
}) => {
  const { classes } = useStyles()

  const allAllergies = useMemo(() => {
    return Array.from(new Set(users.flatMap(u => u.allergies))).sort(
      (a, b) =>
        users.filter(u => u.allergies.includes(b)).length -
          users.filter(u => u.allergies.includes(a)).length ||
        a.localeCompare(b)
    )
  }, [users])

  const sortedUsers = useMemo(() => {
    return [...users].sort(
      (a, b) =>
        b.allergies.length - a.allergies.length || a.name.localeCompare(b.name)
    )
  }, [users])

  const totals = useMemo(() => {
    return allAllergies.map(
      allergy => users.filter(u => u.allergies.includes(allergy)).length
    )
  }, [allAllergies, users])

  if (users.length === 0) {
    return <Text color="dimmed">Ingen vakter registrert denne dagen.</Text>
  }

  return (
    <Stack spacing="xs">
      <Group spacing="xs">
        <Badge size="lg" variant="filled" color="gray">
          Folk på jobb: {users.length}
        </Badge>
        {allAllergies.map((allergy, i) => (
          <Badge key={allergy} size="lg" variant="outline" color="dark">
            {allergy}: {totals[i]}
          </Badge>
        ))}
      </Group>
      {allAllergies.length === 0 ? (
        <Text color="dimmed">
          Ingen registrerte allergier for dagens vakter.
        </Text>
      ) : (
        <>
          <div className={classes.scrollWrapper}>
            <Table withBorder withColumnBorders className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.nameCol}></th>
                  {allAllergies.map(allergy => (
                    <th key={allergy} className={classes.allergyCol}>
                      {allergy}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map(user => {
                  const hasAllergies = user.allergies.length > 0
                  return (
                    <tr
                      key={user.name}
                      className={hasAllergies ? undefined : classes.dimmedRow}
                    >
                      <td>{user.name}</td>
                      {allAllergies.map(allergy => (
                        <td key={allergy} className={classes.cell}>
                          {user.allergies.includes(allergy) ? (
                            <span className={classes.mark}>x</span>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                <tr className={classes.totalRow}>
                  <td>Total</td>
                  {totals.map((total, i) => (
                    <td key={allAllergies[i]} className={classes.cell}>
                      {total}
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </div>
        </>
      )}
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  scrollWrapper: {
    overflow: 'auto',
    width: '100%',
    maxHeight: '65vh',
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    borderRadius: theme.radius.sm,
  },
  table: {
    tableLayout: 'auto',
    width: 'max-content',
    minWidth: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,

    '& thead th': {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderBottom: `2px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },

    '& tbody td:first-of-type, & thead th:first-of-type': {
      position: 'sticky',
      left: 0,
      zIndex: 11,
      borderRight: `2px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },

    '& thead th:first-of-type': {
      zIndex: 12,
    },

    '& tbody tr:nth-of-type(odd) td': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },
    '& tbody tr:nth-of-type(even) td': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[8]
          : theme.colors.gray[1],
    },
    // Override zebra for the total row — it must always be distinct from data rows
    '& tbody tr:last-child td': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },
  },
  nameCol: {
    minWidth: 180,
  },
  allergyCol: {
    textAlign: 'center',
    minWidth: 120,
    padding: '12px 8px',
  },
  cell: {
    textAlign: 'center',
    padding: '8px',
  },
  mark: {
    fontWeight: 700,
    color: theme.colors['samfundet-red'][6],
    fontSize: theme.fontSizes.md,
  },
  dimmedRow: {
    opacity: 0.4,
  },
  totalRow: {
    '& td': {
      position: 'sticky',
      bottom: 0,
      zIndex: 10,
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderTop: `2px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[4]
      }`,
      fontWeight: 600,
    },
    '& td:first-of-type': {
      zIndex: 11,
    },
  },
}))
