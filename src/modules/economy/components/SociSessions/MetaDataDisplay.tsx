import { Badge, Group, Paper, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { SociSessionNode } from 'modules/economy/types.graphql'
import { format } from 'util/date-fns'
import { useCurrencyFormatter } from 'util/hooks'

interface MetaDataDisplayProps {
  sociSession: Pick<
    SociSessionNode,
    | 'id'
    | 'getNameDisplay'
    | 'type'
    | 'moneySpent'
    | 'closed'
    | 'createdBy'
    | 'closedAt'
    | 'minimumRemainingBalance'
  >
}

export const MetaDataDisplay: React.FC<MetaDataDisplayProps> = ({
  sociSession,
}) => {
  const { classes } = useMetaDisplayStyles()
  const { formatCurrency } = useCurrencyFormatter()
  return (
    <Paper p="md">
      <Group>
        <Group>
          <Text className={classes.label}>Status:</Text>
          <Badge color="samfundet-red">
            {sociSession.closed ? 'Stengt' : 'Åpen'}
          </Badge>
        </Group>
        {sociSession.closed && (
          <Group>
            <Text className={classes.label}>Tid stengt:</Text>
            <Badge color="samfundet-red">
              {format(new Date(sociSession.closedAt), 'yyyy.MM.dd HH:mm')}
            </Badge>
          </Group>
        )}

        <Group>
          <Text className={classes.label}>Listetype:</Text>
          <Badge color="samfundet-red">{sociSession.type}</Badge>
        </Group>

        {sociSession.minimumRemainingBalance !== 0 && (
          <Group>
            <Text className={classes.label}>Beløpsgrense:</Text>
            <Badge color="samfundet-red">
              {formatCurrency(sociSession.minimumRemainingBalance)}
            </Badge>
          </Group>
        )}
        <Group>
          {sociSession.createdBy && (
            <>
              <Text className={classes.label}>Opprettet av:</Text>
              <Badge color="samfundet-red">
                {sociSession.createdBy.getCleanFullName}
              </Badge>
            </>
          )}
        </Group>
      </Group>
    </Paper>
  )
}

const useMetaDisplayStyles = createStyles(theme => ({
  label: {
    fontWeight: 600,
    fontSize: 16,
  },
}))
