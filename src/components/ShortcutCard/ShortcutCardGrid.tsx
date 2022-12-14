import { SimpleGrid } from '@mantine/core'
import { ShortcutCard, ShortcutProps } from './ShortcutCard'

interface ShortcutCardGridProps {
  shortcuts: ShortcutProps[]
  cols?: number
}
export const ShortcutCardGrid: React.FC<ShortcutCardGridProps> = ({
  shortcuts,
  cols = 5,
}) => {
  return (
    <SimpleGrid
      cols={cols}
      breakpoints={[
        { maxWidth: 980, cols: 3, spacing: 'md' },
        { maxWidth: 755, cols: 2, spacing: 'sm' },
        { maxWidth: 600, cols: 2, spacing: 'sm' },
      ]}
    >
      {shortcuts.map((shortcut, index) => (
        <ShortcutCard key={index} {...shortcut} />
      ))}
    </SimpleGrid>
  )
}
