import { Group, Stack, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { BackButton } from 'components/BackButton'
import { CardTable } from 'components/CardTable'
import { MessageBox } from 'components/MessageBox'

export const AssignInterview: React.FC = () => {
  return (
    <Stack>
      <BackButton to="/admissions" />
      <Title>Intervjuallokerring</Title>
      <MessageBox type="info">
        Her har du mulighet til å gi noen et nytt intervju. lister de
      </MessageBox>
      <Group></Group>

      <CardTable>
        <thead>
          <tr>
            <th>Når</th>
            <th>Hvor</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody></tbody>
      </CardTable>
    </Stack>
  )
}
