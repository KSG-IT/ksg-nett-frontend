import { Group, Paper, Text, Title } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { IconArrowRight } from '@tabler/icons-react'
import { InternalGroupApplicantData } from 'modules/admissions/types.graphql'
import { useNavigate } from 'react-router-dom'

export const InternalGroupPreviewCard: React.FC<{
  internalGroupDiscussionData: InternalGroupApplicantData
}> = ({ internalGroupDiscussionData }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  function handleRedirect(internalGroupId: string) {
    navigate(`/admissions/discussion-dashboard/${internalGroupId}`)
  }

  return (
    <Paper
      className={classes.card}
      p="sm"
      key={internalGroupDiscussionData.internalGroup.id}
      onClick={() =>
        handleRedirect(internalGroupDiscussionData.internalGroup.id)
      }
    >
      <Title order={3}>{internalGroupDiscussionData.internalGroup.name}</Title>
      <Group>
        <Text>Se fordeling</Text>
        <IconArrowRight />
      </Group>
    </Paper>
  )
}

const useStyles = createStyles(theme => ({
  card: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[0],
      textDecoration: 'underline',
    },
  },
}))
