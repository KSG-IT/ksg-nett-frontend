import { ScrollArea, Textarea, Title } from '@mantine/core'
import { MessageBox } from 'components/MessageBox'

export const ApplicantsOverview: React.FC<{}> = ({}) => {
  return (
    <ScrollArea p="md">
      <Title>Søkeroversikt</Title>
      {/* <ActiveAdmissionTable /> */}
      <Title order={2}>Legg til søkere</Title>
      <MessageBox type="info">
        Her kan du legge inn søkere sin epost. Hver epost på hver sin linje.
      </MessageBox>
      {/* ToDo: Replace with dropzone? Drop -> opens modal with all emails? */}
      <Textarea
        minRows={12}
        placeholder="søker1@epost.com&#10;søker2@epost.com&#10;..."
        value={'emails'}
        onChange={() => {}}
      />
    </ScrollArea>
  )
}
