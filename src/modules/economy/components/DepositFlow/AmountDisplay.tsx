import { Group, NumberFormatter, Text } from '@mantine/core'
import classes from './AmountDisplay.module.css'

interface AmountDisplayProps {
  value: number
}

/** A preset amount, the same size as the free amount field */
export const AmountDisplay: React.FC<AmountDisplayProps> = ({ value }) => {
  return (
    <Group justify="center" align="baseline" gap="xs" h={80}>
      <Text className={classes.amount}>
        <NumberFormatter value={value} thousandSeparator=" " />
      </Text>
      <Text className={classes.amountUnit}>kr</Text>
    </Group>
  )
}
