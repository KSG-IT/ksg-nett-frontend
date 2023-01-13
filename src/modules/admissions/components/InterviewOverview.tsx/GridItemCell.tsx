import { createStyles, Stack, Text } from '@mantine/core'
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
  (
    theme,
    { colStart, rowStart, color, name, firstRowOrColumn }: GridItemProp
  ) => ({
    gridItem: {
      backgroundColor:
        name === 'Ledig' ? theme.colors.green[3] : theme.colors.orange[3],
      gridColumnStart: colStart,
      gridColumnEnd: colStart + 1,
      gridRowStart: rowStart,
      gridRowEnd: rowStart + 1,

      boxShadow: '4px 4px 0px #000',
      width: 150,
      borderRadius: theme.radius.md,
      color: name === 'Ledig' ? theme.black : theme.colors.gray[0],
      border: `4px solid #000`,
      fontWeight: 700,
      height: rowStart === 1 ? 40 : 60,
      display: 'flex',
      ':hover': {
        backgroundColor:
          name === 'Ledig' ? theme.colors.green[2] : theme.colors.orange[2],
        cursor: 'pointer',
        border: 'none',
      },
      // if the cell is the first row or column, we want to add a border to the top and left
      ...(firstRowOrColumn && {
        backgroundColor: theme.colors[theme.primaryColor][0],
        boxShadow: '4px 4px 0px #000',
        ':hover': {
          backgroundColor: theme.colors[theme.primaryColor][0],
        },
      }),
    },
    gridItemText: {
      borderRadius: theme.radius.md,
      paddingBottom: theme.spacing.xs,
      paddingLeft: theme.spacing.sm,
      fontFamily: 'Comic Sans MS, cursive',
      fontWeight: 700,
      fontSize: 14,
      width: '100%',
      height: '100%',
      color: 'black',
    },
  })
)
