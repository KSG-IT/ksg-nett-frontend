import { createStyles, Grid, Paper, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { useMemo } from 'react'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Orvik', path: '/admissions' },
  { label: 'Intervjuoverdsikt', path: '' },
]

const locations = [
  {
    name: 'Bodegaen',
  },
  {
    name: 'Knaus',
  },
  {
    name: 'Lyche',
  },
  {
    name: 'Edgar',
  },
  {
    name: 'Klubben',
  },
]

// array of half hour intervals whole for 24 hours
const timeIntervals = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
]

function locationToRowIndex(location: 'bodegaen' | 'knaus') {
  if (location === 'bodegaen') {
    return 2
  }

  if (location === 'knaus') {
    return 3
  }
}

function timeToColumnIndex(time: string) {
  return timeIntervals.indexOf(time) + 1
}

const inteviewCellSlots = [
  {
    location: 'bodegaen',
    interviews: [
      {
        time: '10:30',
        name: 'Ola Nordmann',
      },
      {
        time: '14:00',
        name: 'Alex Orvik',
      },
    ],
  },
  {
    location: 'knaus',
    interviews: [
      {
        time: '14:00',
        name: 'Ola Nordmann',
      },
      {
        time: '14:30',
        name: 'Alex Orvik',
      },
    ],
  },
]

export const InterviewsOverview: React.FC = () => {
  const { classes } = useStyles()

  const parsedCellItems = useMemo(() => {
    const headerRow = timeIntervals.map(time => ({
      rowIndex: 0,
      columnIndex: timeToColumnIndex(time) + 1,
      name: time,
    }))

    const locaationColumn = locations.map(location => ({
      rowIndex: locationToRowIndex(location.name as 'bodegaen'),
      columnIndex: 0,
      name: location.name,
    }))

    const cellItems = inteviewCellSlots.map(cellItem => {
      const rowIndex = locationToRowIndex(cellItem.location as 'bodegaen')
      return cellItem.interviews.map(interview => {
        const columnIndex = timeToColumnIndex(interview.time)
        return {
          rowIndex,
          columnIndex,
          name: interview.name,
        }
      })
    })

    return [...headerRow, ...locaationColumn, ...cellItems.flat()]
  }, [])

  return (
    <Stack>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Intervjuoversikt</Title>
      <Paper>
        <div className={classes.grid}>
          {parsedCellItems.map(cellItem => (
            // <div
            //   style={{
            //     fontSize: 12,
            //     width: 100,
            //     gridColumnStart: cellItem.columnIndex,
            //     gridColumnEnd: cellItem.columnIndex + 1,
            //     gridRowStart: cellItem.rowIndex,
            //     gridRowEnd: cellItem.rowIndex,
            //   }}
            // >
            //   {cellItem.name}
            // </div>
            <GridItemCell
              colStart={cellItem.columnIndex}
              rowStart={cellItem.rowIndex as number}
              name={cellItem.name}
            />
          ))}
        </div>
      </Paper>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  grid: {
    padding: theme.spacing.sm,
    display: 'grid',
    overflowX: 'scroll',
    backgroundColor: 'hotpink',
    //     row-gap: 10px;
    // column-gap: 20px;
    // grid-template-columns: 200px 100px auto 100px 200px;
    // grid-template-rows: 25% 50% 25%;
    rowGap: 5,
    columnGap: 5,
    gridTemplateColumns: 'repeat(21, 1fr)',
    gridTemplateRows: 'auto',
  },
}))

type GridItem = {
  colStart: number
  rowStart: number
}

type GridItemProp = {
  colStart: number
  rowStart: number
  name: string
}

const GridItemCell: React.FC<GridItemProp> = ({ colStart, rowStart, name }) => {
  const { classes } = useGridItemStyles({
    colStart,
    rowStart,
  })

  return <div className={classes.gridItem}>{name}</div>
}

const useGridItemStyles = createStyles(
  (theme, { colStart, rowStart }: GridItem) => ({
    gridItem: {
      backgroundColor: 'red',
      gridColumnStart: colStart,
      gridColumnEnd: colStart + 1,
      gridRowStart: rowStart,
      gridRowEnd: rowStart,
      fontSize: 12,
      width: 100,
      color: 'yellow',
      height: 40,
    },
  })
)
