import { Card, Title, Text, createStyles, keyframes } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

export const RecruitBanner: React.FC = () => {
  const navigate = useNavigate()
  const { classes } = useStyles()
  function handlePinnedThreadClick() {
    navigate('/forum/ksg-it-har-opptak')
  }
  const wavyText = (text: string) => {
    return text.split(/(?!$)/u).map((letter, index) => {
      const style = wavyTextStyles(index)
      console.log(letter)
      return (
        <span key={index} className={style.classes.wavyText}>
          {letter.match(/\s/) ? '\u00A0' : letter}
        </span>
      )
    })
  }

  return (
    <Card
      className={classes.pinnedThreadCard}
      onClick={handlePinnedThreadClick}
    >
      <Title color="samfundet-red.0" order={2}>
        KSG-IT har opptak!
      </Title>
      <Text color="samfundet-red.0">
        {wavyText('Trykk her for å lese mer')}
      </Text>
    </Card>
  )
}
const wavyTextStyles = createStyles((theme, duration: number) => ({
  wavyText: {
    animationName: 'wavy',
    animationDuration: `1.5s`,
    animationDelay: `${duration / 15}s`,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease',
    display: 'inline-block',
    '@keyframes wavy': {
      // make bob up and down
      '0%': { transform: 'translateY(0)' },
      '25%': { transform: 'translateY(-0.5rem)' },
      '50%': { transform: 'translateY(0)' },
      '75%': { transform: 'translateY(0.5rem)' },
      '100%': { transform: 'translateY(0)' },
    },
  },
}))

const useStyles = createStyles(theme => ({
  pinnedThreadCard: {
    textShadow: '2px 2px rgba(0, 0, 0, 1)',
    marginBottom: theme.spacing.md,
    ':hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[0],
    },
    // Animated border rainbow
    backgroundImage: `linear-gradient(
      to right,
      ${theme.colors.red[5]},
      ${theme.colors.orange[5]},
      ${theme.colors.yellow[5]},
      ${theme.colors.green[5]},
      ${theme.colors.teal[5]},
      ${theme.colors.cyan[5]},
      ${theme.colors.blue[5]},
      ${theme.colors.indigo[5]},
      ${theme.colors.violet[5]}
    )`,
    backgroundSize: '200% 100%',
    backgroundPosition: 'left bottom',
    animationDuration: '3s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationName: 'gradient, bounce',
    '@keyframes gradient': {
      '0%': { backgroundPosition: 'left bottom' },
      '50%': { backgroundPosition: 'right bottom' },
      '100%': { backgroundPosition: 'left bottom' },
    },
    '@keyframes bounce': {
      'from, 20%, 53%, 80%, to': { transform: 'translate3d(0, 0, 0)' },
      '40%, 43%': { transform: 'translate3d(0, -1.875rem, 0)' },
      '70%': { transform: 'translate3d(0, -0.9375rem, 0)' },
      '90%': { transform: 'translate3d(0, -0.25rem, 0)' },
    },
  },
}))
