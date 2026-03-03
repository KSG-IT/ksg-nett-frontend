import { Anchor, Breadcrumbs as BreadcrumbsBase } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

type BreadcrumbItem = {
  label: string
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <BreadcrumbsBase
      separator={<IconChevronRight size={18} />}
      style={{ flexWrap: 'wrap' }}
    >
      {items.map((item, index) => (
        <Anchor
          key={index}
          component={Link}
          to={item.path}
          c="samfundet-red"
          fw={500}
          style={{ marginBottom: '0.5rem' }}
        >
          {item.label}
        </Anchor>
      ))}
    </BreadcrumbsBase>
  )
}
