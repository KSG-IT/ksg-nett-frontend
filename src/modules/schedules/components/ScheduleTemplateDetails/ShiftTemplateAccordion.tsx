import { Accordion, createStyles, Group, Paper, Text } from '@mantine/core'
import { ShiftTemplateNode } from 'modules/schedules/types.graphql'
import { ShiftTemplateAccordionItem } from './ShiftTemplateAccordionItem'

interface ShiftTemplateAccordionProps {
  shiftTemplates: ShiftTemplateNode[]
}

export const ShiftTemplateAccordion: React.FC<ShiftTemplateAccordionProps> = ({
  shiftTemplates,
}) => {
  const { classes } = shiftTemplateAccordionStyles()
  const accordionItems = shiftTemplates.map(shiftTemplate => {
    return (
      <ShiftTemplateAccordionItem
        key={shiftTemplate.id}
        shiftTemplate={shiftTemplate}
      />
    )
  })
  return (
    <Paper>
      <Accordion defaultValue="customization">
        <Accordion.Item value="header">
          <Accordion.Control chevron={false}>
            <Group className={classes.shiftTemplateRow} position="apart">
              <Text className={classes.shiftTemplateColumnCell} weight={600}>
                Dag
              </Text>
              <Text className={classes.shiftTemplateColumnCell} weight={600}>
                Lokale
              </Text>
              <Text className={classes.shiftTemplateColumnCell} weight={600}>
                Start
              </Text>
              <Text className={classes.shiftTemplateColumnCell} weight={600}>
                Slutt
              </Text>
            </Group>
          </Accordion.Control>
        </Accordion.Item>
        {accordionItems}
      </Accordion>
    </Paper>
  )
}

const shiftTemplateAccordionStyles = createStyles(theme => ({
  shiftTemplateRow: {
    ':nth-child(3)': {
      textAlign: 'right',
    },
  },
  shiftTemplateColumnCell: {
    width: '120px',
    textAlign: 'left',
  },
}))
