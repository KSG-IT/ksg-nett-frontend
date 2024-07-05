import { Badge, Image, Paper, SimpleGrid, Stack, Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from 'util/hooks'
import { UserNode } from '../types'
import { createStyles } from '@mantine/emotion'
interface NewbieCardProps {
  newbies: Pick<
    UserNode,
    'id' | 'fullName' | 'activeInternalGroupPosition' | 'profileImage'
  >[]
}

export const NewbieCards: React.FC<NewbieCardProps> = ({ newbies }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  function handleClickCard(id: string) {
    navigate(`/users/${id}`)
  }

  return (
    <SimpleGrid cols={isMobile ? 1 : 4}>
      {newbies.map(newbie => (
        <Paper
          className={classes.card}
          radius={'md'}
          onClick={() => handleClickCard(newbie.id)}
        >
          <Image
            src={
              newbie.profileImage ||
              'https://m.media-amazon.com/images/M/MV5BMjA5NTE4NTE5NV5BMl5BanBnXkFtZTcwMTcyOTY5Mw@@._V1_.jpg'
            }
          />
          <Stack spacing={0} p="xs" my="xs">
            <Text>{newbie.fullName}</Text>
            <Badge>{newbie.activeInternalGroupPosition.name}</Badge>
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    height: 'auto',
    width: 200,
    ':hover': {
      boxShadow: theme.shadows.md,
      cursor: 'pointer',
    },
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
}))
