import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
  createStyles,
} from '@mantine/core'
import React from 'react'

const useStyles = createStyles(theme => ({
  pandaCard: {
    boxShadow: `-4px 4px 20px ${theme.colors['samfundet-red'][6]}`,
    fontSize: theme.fontSizes.xs,
  },
}))

const TutorialHome: React.FC = () => {
  const { classes } = useStyles()

  return (
    <Stack align="flex-start">
      <Card withBorder>
        <Text>Velkommen til min lille del av KSG-nett!</Text>
      </Card>
      <Card className={classes.pandaCard} withBorder w={300} radius={'lg'}>
        <Card.Section>
          <Image
            src="https://miro.medium.com/v2/resize:fit:640/format:webp/1*0XYZ-jEFqIw3dVWdmz3-QQ.gif"
            alt="KSG"
            height={200}
            width={300}
          />
        </Card.Section>

        <Stack mt={'xs'}>
          <Group position="apart">
            <Title order={4}>Pandaen Po</Title>
            <Badge>Idol</Badge>
          </Group>

          <Text>
            Po the panda is the laziest of all the animals in the Valley of
            Peace, but unwittingly becomes the chosen one when enemies threaten
            their way of life.
          </Text>

          <Button fullWidth>Jeg vil lære om Po!</Button>
        </Stack>
      </Card>
    </Stack>
  )
}

export default TutorialHome
