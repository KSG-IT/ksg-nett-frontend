import { Group, NumberFormatter, NumberInput, Stack, Text } from '@mantine/core'
import { DEPOSIT_PRESETS } from 'modules/economy/deposit'
import { useState } from 'react'
import { AmountOptions } from './AmountOptions'

interface AmountPickerProps {
  // NaN while the free amount is empty
  value: number
  onChange: (amount: number) => void
  error?: string
}

/**
 * The amount is one of the presets, or a free amount after "Annet". "Annet"
 * keeps the amount so far, ready to edit. An empty field is NaN, not
 * undefined: react-hook-form puts the default value back for undefined.
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
        <NumberInput
          autoFocus
          hideControls
          allowDecimal={false}
          allowNegative={false}
          thousandSeparator=" "
          size="xl"
          placeholder="0"
          aria-label="Eget beløp i kroner"
          rightSection={
            <Text fz={24} fw={700} c="dimmed">
              kr
            </Text>
          }
          rightSectionWidth={56}
          inputWrapperOrder={['label', 'input', 'description', 'error']}
          styles={{
            input: {
              fontSize: 48,
              fontWeight: 800,
              height: 80,
              // Red is for errors only
              '--input-bd-focus': 'var(--mantine-color-dark-3)',
            },
          }}
          value={Number.isNaN(value) ? '' : value}
          onChange={amount =>
            onChange(typeof amount === 'number' ? amount : NaN)
          }
          error={error}
          description="Fra 1 til 30 000 kr."
        />
      ) : (
        <Group justify="center" align="baseline" gap="xs" h={80}>
          <Text fz={56} fw={800} lh={1} style={{ letterSpacing: '-0.03em' }}>
            <NumberFormatter value={value} thousandSeparator=" " />
          </Text>
          <Text fz={28} fw={700} c="dimmed">
            kr
          </Text>
        </Group>
      )}
      <AmountOptions
        selected={custom ? 'custom' : value}
        onPickPreset={handlePickPreset}
        onPickCustom={() => setCustom(true)}
      />
    </Stack>
  )
}
