import { NumberInput } from '@mantine/core'
import classes from './AmountInput.module.css'

interface AmountInputProps {
  // NaN while the field is empty
  value: number
  onChange: (amount: number) => void
  error?: string
}

/**
 * The large free amount field after "Annet". An empty field is NaN, not
 * undefined: react-hook-form puts the default value back for undefined.
 */
export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <NumberInput
      autoFocus
      hideControls
      allowDecimal={false}
      allowNegative={false}
      thousandSeparator=" "
      size="xl"
      placeholder="0"
      aria-label="Eget beløp i kroner"
      classNames={{ input: classes.input }}
      rightSection={<span className={classes.unit}>kr</span>}
      rightSectionWidth={56}
      inputWrapperOrder={['label', 'input', 'description', 'error']}
      value={Number.isNaN(value) ? '' : value}
      onChange={amount => onChange(typeof amount === 'number' ? amount : NaN)}
      error={error}
      description="Fra 1 til 30 000 kr."
    />
  )
}
