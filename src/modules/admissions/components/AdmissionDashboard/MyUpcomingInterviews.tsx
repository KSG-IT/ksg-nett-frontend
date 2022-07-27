import { Paper, Stack, Table, Title } from '@mantine/core'

export const MyUpcomingInterviews: React.VFC<{}> = ({}) => {
  return (
    <Stack>
      <Title order={2}>Mine kommende intervjuer</Title>
      <Paper p="sm" mb="md">
        <Table>
          <thead>
            <td>Tidspunkt</td>
            <td>Lokale</td>
            <td>Søker</td>
          </thead>
          <tbody>
            <td>Ikke</td>
            <td>Implementert</td>
            <td>Enda</td>
          </tbody>
        </Table>
      </Paper>
    </Stack>
  )
}
