import { Button, SimpleGrid } from '@mantine/core'
import { DEPOSIT_PRESETS } from 'modules/economy/deposit'

interface AmountOptionsProps {
  selected: number | 'custom'
  onPickPreset: (amount: number) => void
  onPickCustom: () => void
}

export const AmountOptions: React.FC<AmountOptionsProps> = ({
  selected,
  onPickPreset,
  onPickCustom,
}) => {
  return (
    <SimpleGrid cols={4} spacing="xs">
      {DEPOSIT_PRESETS.map(amount => (
        <Button
          key={amount}
          px={0}
          variant={selected === amount ? 'light' : 'default'}
          aria-pressed={selected === amount}
          onClick={() => onPickPreset(amount)}
        >
          {amount} kr
        </Button>
      ))}
      <Button
        px={0}
        variant={selected === 'custom' ? 'light' : 'default'}
        aria-pressed={selected === 'custom'}
        onClick={onPickCustom}
      >
        Annet
      </Button>
    </SimpleGrid>
  )
}
