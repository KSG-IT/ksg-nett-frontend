import { Accordion, Group, Paper, Text } from '@mantine/core'
import { ShiftTemplateNode } from 'modules/schedules/types.graphql'
import { ShiftTemplateAccordionItem } from './ShiftTemplateAccordionItem'

interface ShiftTemplateAccordionProps {
  shiftTemplates: ShiftTemplateNode[]
}

export const ShiftTemplateAccordion: React.FC<ShiftTemplateAccordionProps> = ({
  shiftTemplates,
}) => {
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
            <Group position="apart">
              <Text weight={600}>Dag</Text>
              <Text weight={600}>Lokale</Text>
              <Text weight={600}>Start</Text>
              <Text weight={600}>Slutt</Text>
            </Group>
          </Accordion.Control>
        </Accordion.Item>
        {accordionItems}
      </Accordion>
    </Paper>
  )
}
