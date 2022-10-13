import { Badge, createStyles, Group, Paper, Stack, Text } from '@mantine/core'
import { SociSessionNode } from 'modules/economy/types.graphql'
import { format } from 'util/date-fns'
import { numberWithSpaces } from 'util/parsing'

interface MetaDataDisplayProps {
  sociSession: Pick<
    SociSessionNode,
    'id' | 'name' | 'type' | 'moneySpent' | 'closed' | 'createdBy' | 'closedAt'
  >
}

export const MetaDataDisplay: React.FC<MetaDataDisplayProps> = ({
  sociSession,
}) => {
  const { classes } = useMetaDisplayStyles()
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
        <Group>
          <Text className={classes.label}>Opprettet av:</Text>
          <Badge color="samfundet-red">{sociSession.createdBy.fullName}</Badge>
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
