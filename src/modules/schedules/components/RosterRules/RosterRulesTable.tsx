import { ActionIcon, Paper, Text } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { availabilityLabel, capLabel, membershipTypeLabel } from '../../roster'
import { ScheduleRosterGroupingNode } from '../../types.graphql'
import { parseShiftRole } from '../../util'
import classes from './RosterRules.module.css'

interface RosterRulesTableProps {
  rules: ScheduleRosterGroupingNode[]
  onEdit: (rule: ScheduleRosterGroupingNode) => void
  onDelete: (rule: ScheduleRosterGroupingNode) => void
}

// A table on a wide screen, a card per rule on a phone
export const RosterRulesTable: React.FC<RosterRulesTableProps> = ({
  rules,
  onEdit,
  onDelete,
}) => {
  if (rules.length === 0) {
    return (
      <Paper withBorder radius="md" p="md">
        <Text size="sm" c="dimmed">
          Ingen regler ennå. Lag en regel for hvert verv og hver type som skal
          stå på rosteren.
        </Text>
      </Paper>
    )
  }
  return (
    <Paper withBorder radius="md" className={classes.table}>
      <div className={`${classes.row} ${classes.header}`}>
        <span>Verv</span>
        <span>Type</span>
        <span>Rolle</span>
        <span>Standard</span>
        <span>Maks</span>
        <span />
      </div>
      {rules.map(rule => (
        <RuleRow
          key={rule.id}
          rule={rule}
          onEdit={() => onEdit(rule)}
          onDelete={() => onDelete(rule)}
        />
      ))}
    </Paper>
  )
}

interface RuleRowProps {
  rule: ScheduleRosterGroupingNode
  onEdit: () => void
  onDelete: () => void
}

const RuleRow: React.FC<RuleRowProps> = ({ rule, onEdit, onDelete }) => (
  <div className={classes.row}>
    <Text fw={600} size="sm" className={classes.position}>
      {rule.internalGroupPosition.name}
    </Text>
    <Text size="sm">{membershipTypeLabel(rule.positionType)}</Text>
    <Text size="sm">
      <span className={classes.label}>Rolle: </span>
      {parseShiftRole(rule.role)}
    </Text>
    <Text size="sm">{availabilityLabel(rule.defaultAvailability)}</Text>
    <Text size="sm">
      <span className={classes.label}>Maks: </span>
      {capLabel(rule.shiftCap)}
    </Text>
    <div className={classes.actions}>
      <ActionIcon variant="subtle" aria-label="Endre regel" onClick={onEdit}>
        <IconPencil size={16} />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="red"
        aria-label="Slett regel"
        onClick={onDelete}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </div>
  </div>
)
