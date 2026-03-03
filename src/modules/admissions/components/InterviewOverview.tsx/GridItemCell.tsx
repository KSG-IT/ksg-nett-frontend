import { Stack, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useMemo } from 'react'

type GridItemProp = {
  colStart: number
  rowStart: number
  name: string
  color: string
  onClick?: () => void

  firstRowOrColumn?: boolean
}
export const GridItemCell: React.FC<GridItemProp> = ({
  colStart,
  rowStart,
  name,
  color,
  onClick,
}) => {
  const firstRowOrColumn = useMemo(
    () => rowStart === 1 || colStart === 1,
    [rowStart, colStart]
  )
  const { classes } = useGridItemStyles({
    colStart,
    rowStart,
    color,
    name,
    firstRowOrColumn,
  })

  return (
    <Stack
      className={classes.gridItem}
      align={'center'}
      justify={'center'}
      onClick={onClick}
    >
      <Text className={classes.gridItemText} size={'md'}>
        {name}
      </Text>
    </Stack>
  )
}

const useGridItemStyles = createStyles(
  (_theme, { colStart, rowStart, name, firstRowOrColumn }: GridItemProp) => ({
    gridItem: {
      backgroundColor:
        name === 'Ledig'
          ? 'var(--mantine-color-green-3)'
          : 'var(--mantine-color-orange-3)',
      gridColumnStart: colStart,
      gridColumnEnd: colStart + 1,
      gridRowStart: rowStart,
      gridRowEnd: rowStart + 1,

      boxShadow: '4px 4px 0px #000',
      width: 150,
      borderRadius: 'var(--mantine-radius-md)',
      color: name === 'Ledig' ? 'black' : 'var(--mantine-color-gray-0)',
      border: `4px solid #000`,
      fontWeight: 700,
      height: rowStart === 1 ? 40 : 60,
      display: 'flex',
      ':hover': {
        backgroundColor:
          name === 'Ledig'
            ? 'var(--mantine-color-green-2)'
            : 'var(--mantine-color-orange-2)',
        cursor: 'pointer',
        border: 'none',
      },
      // if the cell is the first row or column, we want to add a border to the top and left
      ...(firstRowOrColumn && {
        backgroundColor: 'var(--mantine-color-brand-0)',
        boxShadow: '4px 4px 0px #000',
        ':hover': {
          backgroundColor: 'var(--mantine-color-brand-0)',
        },
      }),
    },
    gridItemText: {
      borderRadius: 'var(--mantine-radius-md)',
      paddingBottom: 'var(--mantine-spacing-xs)',
      paddingLeft: 'var(--mantine-spacing-sm)',
      fontFamily: 'Comic Sans MS, cursive',
      fontWeight: 700,
      fontSize: 14,
      width: '100%',
      height: '100%',
      color: 'black',
    },
  })
)
