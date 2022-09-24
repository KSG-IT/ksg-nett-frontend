import {
  Card,
  Group,
  Image,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core'
import { format } from 'date-fns'
import { UserNode } from 'modules/users'

export const MyShifts: React.VFC = () => {
  type Mock = {
    id: number
    date: Date
    venue: string
    users: Pick<UserNode, 'id' | 'fullName' | 'initials' | 'profileImage'>[]
  }
  const mockData = [
    {
      id: 1,
      date: new Date(),
      venue: 'Bodegaen',
      users: [
        {
          user: {
            id: '1',
            fullName: 'Alexander Orvik',
            initials: 'AO',
            profileImage: 'https://picsum.photos/100/100',
          },
          role: 'Bartender',
        },
        {
          user: {
            id: '2',
            fullName: 'Sebastian Småland',
            initials: 'SS',
            profileImage: 'https://picsum.photos/100/100',
          },
          role: 'Bartender',
        },
        {
          user: {
            id: '3',
            fullName: 'Anhkha Vo',
            initials: 'AV',
            profileImage: 'https://picsum.photos/100/100',
          },
          role: 'Bartender',
        },
        {
          user: {
            id: '4',
            fullName: 'Magnus Holtet',
            initials: 'MH',
            profileImage: 'https://picsum.photos/100/100',
          },
          role: 'Bartender',
        },
        {
          user: {
            id: '5',
            fullName: 'Sander Haga',
            initials: 'SH',
            profileImage: 'https://picsum.photos/100/100',
          },
          role: 'Barsjef',
        },
      ],
    },
  ]

  return (
    <ScrollArea p="md">
      <h1>Mine vakter</h1>
      {mockData.map(shift => (
        <Card>
          <Group>
            <Stack>
              <Text>{shift.venue}</Text>
              <Text>{format(shift.date, 'cccc d. MMMM')}</Text>
              <Text>Oppmøte {format(shift.date, 'HH:mm')}</Text>
            </Stack>
            <Group>
              {shift.users.map(user => (
                <Stack>
                  <Paper>
                    <Image src={user.user.profileImage} />
                  </Paper>
                  <Text>{user.user.fullName}</Text>
                  <Text>{user.role}</Text>
                </Stack>
              ))}
            </Group>
          </Group>
        </Card>
      ))}
    </ScrollArea>
  )
}
