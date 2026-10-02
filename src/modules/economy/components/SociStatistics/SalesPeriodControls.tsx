import { Input, SegmentedControl, Select } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import 'dayjs/locale/nb'
import {
  allowedGranularities,
  defaultGranularity,
  GRANULARITY_LABELS,
  isoDate,
  periodRange,
  SALES_PERIOD_OPTIONS,
  SalesGranularity,
  SalesPeriod,
} from 'modules/economy/salesStatistics'
import { useMemo, useState } from 'react'

// Period and grouping for the sales statistics and Min økonomi. The default
// is this semester, per month.
export function useSalesPeriod() {
  const today = useMemo(() => new Date(), [])
  const [period, setPeriodState] = useState<SalesPeriod>('this-semester')
  const [customRange, setCustomRangeState] = useState<
    [string | null, string | null]
  >([null, null])
  // null: use the default for the length of the period
  const [pickedGranularity, setPickedGranularity] =
    useState<SalesGranularity | null>(null)

  const { dateFrom, dateTo } = periodRange(period, today, customRange)
  const allowed = allowedGranularities(period)
  const granularity =
    pickedGranularity && allowed.includes(pickedGranularity)
      ? pickedGranularity
      : defaultGranularity(period, dateFrom, dateTo)

  return {
    today,
    period,
    customRange,
    dateFrom,
    dateTo,
    granularity,
    allowed,
    customIncomplete: period === 'custom' && (!dateFrom || !dateTo),
    // A new period or range gets its own default grouping
    setPeriod: (value: SalesPeriod) => {
      setPeriodState(value)
      setPickedGranularity(null)
    },
    setCustomRange: (value: [string | null, string | null]) => {
      setCustomRangeState(value)
      setPickedGranularity(null)
    },
    setGranularity: setPickedGranularity,
  }
}

type SalesPeriodState = ReturnType<typeof useSalesPeriod>

export const SalesPeriodControls: React.FC<{ state: SalesPeriodState }> = ({
  state,
}) => (
  <>
    <Select
      label="Periode"
      data={SALES_PERIOD_OPTIONS}
      value={state.period}
      onChange={value => value && state.setPeriod(value as SalesPeriod)}
      allowDeselect={false}
      w={200}
    />
    {state.period === 'custom' && (
      <DatePickerInput
        type="range"
        label="Fra og til"
        placeholder="Velg datoer"
        locale="nb"
        valueFormat="D. MMM YYYY"
        value={state.customRange}
        onChange={value =>
          state.setCustomRange(value as [string | null, string | null])
        }
        maxDate={isoDate(state.today)}
        allowSingleDateInRange
        w={280}
      />
    )}
    <Input.Wrapper label="Vis per">
      <SegmentedControl
        data={state.allowed.map(value => ({
          value,
          label: GRANULARITY_LABELS[value].option,
        }))}
        disabled={state.allowed.length === 1}
        value={state.granularity}
        onChange={value => state.setGranularity(value as SalesGranularity)}
        display="flex"
      />
    </Input.Wrapper>
  </>
)
