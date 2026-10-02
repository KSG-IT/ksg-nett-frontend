import { ActionIcon, Tooltip } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import {
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
} from '@tabler/icons-react'

export type TableDensity = 'compact' | 'normal'

// Row density for a table, remembered per table in localStorage.
// Spread tableProps on Mantine <Table>.
export function useTableDensity(
  storageKey: string,
  defaultValue: TableDensity = 'normal'
) {
  const [density, setDensity] = useLocalStorage<TableDensity>({
    key: `table-density:${storageKey}`,
    defaultValue,
    getInitialValueInEffect: false,
  })
  const compact = density === 'compact'

  return {
    density,
    compact,
    setDensity,
    tableProps: {
      verticalSpacing: compact ? 4 : 'xs',
      horizontalSpacing: compact ? 'xs' : 'sm',
      fz: compact ? 'xs' : 'sm',
    } as const,
  }
}

interface DensityToggleProps {
  density: TableDensity
  onChange: (density: TableDensity) => void
}

export const DensityToggle: React.FC<DensityToggleProps> = ({
  density,
  onChange,
}) => {
  const compact = density === 'compact'
  const label = compact ? 'Vanlig visning' : 'Kompakt visning'
  const Icon = compact ? IconBaselineDensityMedium : IconBaselineDensitySmall

  return (
    <Tooltip label={label}>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label={label}
        aria-pressed={compact}
        onClick={() => onChange(compact ? 'normal' : 'compact')}
      >
        <Icon size={18} />
      </ActionIcon>
    </Tooltip>
  )
}
