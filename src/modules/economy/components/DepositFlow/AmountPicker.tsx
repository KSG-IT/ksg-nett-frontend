import { Stack, Text } from '@mantine/core'
import { DEPOSIT_PRESETS } from 'modules/economy/deposit'
import { useState } from 'react'
import { AmountDisplay } from './AmountDisplay'
import { AmountInput } from './AmountInput'
import { AmountOptions } from './AmountOptions'

interface AmountPickerProps {
  // NaN while the free amount is empty
  value: number
  onChange: (amount: number) => void
  error?: string
}

/**
 * The amount is one of the presets, or a free amount after "Annet". "Annet"
 * keeps the amount so far, ready to edit.
 */
export const AmountPicker: React.FC<AmountPickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const [custom, setCustom] = useState(() => !DEPOSIT_PRESETS.includes(value))

  function handlePickPreset(amount: number) {
    setCustom(false)
    onChange(amount)
  }

  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="dimmed">
        Hvor mye vil du fylle på?
      </Text>
      {custom ? (
        <AmountInput value={value} onChange={onChange} error={error} />
      ) : (
        <AmountDisplay value={value} />
      )}
      <AmountOptions
        selected={custom ? 'custom' : value}
        onPickPreset={handlePickPreset}
        onPickCustom={() => setCustom(true)}
      />
    </Stack>
  )
}
