import {
  Anchor,
  Breadcrumbs as BreadcrumbsBase,
  useMantineTheme,
} from '@mantine/core'
import { IconChevronRight } from '@tabler/icons'
import { Link } from 'react-router-dom'

type BreadcrumbItem = {
  label: string
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const theme = useMantineTheme()
  return (
    <BreadcrumbsBase
      separator={
        <IconChevronRight size={16} style={{ marginBottom: '0.5rem' }} />
      }
      style={{ flexWrap: 'wrap' }}
    >
      {items.map((item, index) => (
        <Anchor
          key={index}
          component={Link}
          to={item.path}
          color={theme.primaryColor}
          weight={500}
          style={{ marginBottom: '0.5rem' }}
        >
          {item.label}
        </Anchor>
      ))}
    </BreadcrumbsBase>
  )
}
