import { Group, Text, Title } from '@mantine/core'
import { IconBulldozer } from '@tabler/icons-react'
import { MessageBox } from 'components/MessageBox'

export const MyAvailability = () => {
  return (
    <div>
      <Title>Min tilgjengelighet</Title>
      <MessageBox type="info">
        Her skal det være mulig å ønske seg vakter og melde generell
        utilgjengelighet
      </MessageBox>
      <Group align="center">
        <IconBulldozer size="64px" />
        <Text>Denne tjenesten er ikke tilgjengelig enda</Text>
      </Group>
    </div>
  )
}
