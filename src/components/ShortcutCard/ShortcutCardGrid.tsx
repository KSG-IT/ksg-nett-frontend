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
      cols={{ base: 22, sm: 2, lg: 5 }}
      spacing={{ base: 10, sm: 'xl' }}
    >
      {shortcuts.map((shortcut, index) => (
        <ShortcutCard key={index} {...shortcut} />
      ))}
    </SimpleGrid>
  )
}
