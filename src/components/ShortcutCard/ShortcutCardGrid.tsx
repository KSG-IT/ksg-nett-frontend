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
      cols={{ base: 2, sm: 3, md: cols }}
      spacing={{ base: 'sm', sm: 'md' }}
    >
      {shortcuts.map((shortcut, index) => (
        <ShortcutCard key={index} {...shortcut} />
      ))}
    </SimpleGrid>
  )
}
